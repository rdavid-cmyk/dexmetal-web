import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

import type { FormProject } from './generate-notification';

interface FieldCoord {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  type?: string;
}

interface RegistryBlock {
  label: string;
  fields: Record<string, FieldCoord>;
}

// Word-wrap helper — same pattern as generate-notification.ts
function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  topY: number,
  options: {
    font: PDFFont;
    fontSize: number;
    maxWidth: number;
    lineHeight: number;
    maxLines: number;
    pageHeight: number;
  }
): void {
  const { font, fontSize, maxWidth, lineHeight, maxLines, pageHeight } = options;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && currentLine) {
      lines.push(currentLine);
      if (lines.length >= maxLines) break;
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x,
      y: pageHeight - (topY + i * lineHeight) - fontSize,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }
}

// Long-field wrap config for movement doc blocks
const WRAPPED_FIELDS: Record<string, Record<string, { lineHeight: number; maxLines: number }>> = {
  block_12: {
    common_name:            { lineHeight: 10, maxLines: 1 },
    major_constituents:     { lineHeight: 10, maxLines: 1 },
    hazardous_constituents: { lineHeight: 10, maxLines: 1 },
  },
  block_16: {
    additional_info: { lineHeight: 11, maxLines: 2 },
  },
};

export async function generateMovementPdf(formData: FormProject): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), 'public/templates/vcop8_notification.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const registryPath = path.join(process.cwd(), 'src/lib/schemas/template_registry_movement.json');
  const registryRaw = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const registry = (registryRaw.blocks ?? registryRaw) as Record<string, RegistryBlock>;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const fontSize = 10;

  const mv = formData as unknown as Record<string, Record<string, unknown>> | null | undefined;
  if (!mv) return new Uint8Array(await pdfDoc.save());

  // Flatten nested block_8 carriers and block_9 generators into a flat data map
  const block8 = mv.block_8 as Record<string, unknown> | undefined;
  const block9 = mv.block_9 as Record<string, unknown> | undefined;

  const flatData: Record<string, Record<string, unknown> | undefined> = {
    block_1: mv.block_1,
    block_2: mv.block_2,
    block_3: mv.block_3,
    block_4: mv.block_4,
    block_5: mv.block_5,
    block_6: mv.block_6,
    block_7: mv.block_7,
    block_8a: block8?.carrier_a as Record<string, unknown> | undefined,
    block_8b: block8?.carrier_b as Record<string, unknown> | undefined,
    block_8c: block8?.carrier_c as Record<string, unknown> | undefined,
    block_8_flags: block8 ? { more_than_3_carriers: block8.more_than_3_carriers } : undefined,
    block_9: Array.isArray(block9?.generators)
      ? (block9!.generators as Record<string, unknown>[])[0]
      : (block9 as Record<string, unknown> | undefined),
    block_10: mv.block_10,
    block_11: mv.block_11,
    block_12: mv.block_12,
    block_13: mv.block_13,
    block_14: mv.block_14,
    block_15: mv.block_15,
    block_16: mv.block_16,
    block_17: mv.block_17,
    block_18: mv.block_18,
    block_19: mv.block_19,
  };

  for (const [blockKey, block] of Object.entries(registry)) {
    const blockData = flatData[blockKey];
    if (!blockData) continue;

    for (const [fieldKey, coord] of Object.entries(block.fields)) {
      const pageNum = coord.page - 1;
      if (pageNum < 0 || pageNum >= pages.length) {
        console.warn(`[MVPDF] Invalid page ${coord.page} for ${blockKey}.${fieldKey}`);
        continue;
      }

      const page = pages[pageNum];
      const { height: pageHeight } = page.getSize();

      // ── Checkbox handling ─────────────────────────────────────────────────
      if (coord.type === 'checkbox') {
        const lastUnderscore = fieldKey.lastIndexOf('_');
        const parentKey = fieldKey.substring(0, lastUnderscore);
        const optionSuffix = fieldKey.substring(lastUnderscore + 1).toLowerCase();
        const rawValue = blockData[parentKey];
        if (rawValue === null || rawValue === undefined || rawValue === '') continue;
        if (Array.isArray(rawValue) && rawValue.length === 0) continue;
        const normalizedValue = typeof rawValue === 'boolean'
          ? (rawValue ? 'yes' : 'no')
          : String(rawValue).toLowerCase();
        if (normalizedValue !== optionSuffix) continue;
        page.drawText('x', {
          x: coord.x,
          y: pageHeight - coord.y - fontSize,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        continue;
      }

      // ── Text/value handling ───────────────────────────────────────────────
      let value = blockData[fieldKey];
      if (value === null || value === undefined) continue;
      if (value === '') continue;
      if (typeof value === 'string' && (value.toLowerCase() === 'na' || value.toLowerCase() === 'n/a')) continue;

      let displayValue: string;
      if (Array.isArray(value)) {
        displayValue = (value as unknown[]).map(item =>
          typeof item === 'object' && item !== null
            ? Object.values(item as Record<string, unknown>).filter(v => v !== null && v !== undefined && v !== '').join(' ')
            : String(item)
        ).filter(s => s.trim().length > 0).join(', ');
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (typeof value === 'object') {
        displayValue = Object.values(value as Record<string, unknown>).filter(Boolean).join(', ');
      } else {
        displayValue = String(value);
      }

      if (!displayValue || displayValue.trim() === '') continue;

      const wrapConfig = WRAPPED_FIELDS[blockKey]?.[fieldKey];
      if (wrapConfig) {
        drawWrappedText(page, displayValue, coord.x, coord.y, {
          font,
          fontSize,
          maxWidth: coord.width,
          lineHeight: wrapConfig.lineHeight,
          maxLines: wrapConfig.maxLines,
          pageHeight,
        });
      } else {
        page.drawText(displayValue, {
          x: coord.x,
          y: pageHeight - coord.y - fontSize,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}
