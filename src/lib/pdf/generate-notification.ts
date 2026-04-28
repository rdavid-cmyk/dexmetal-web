import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface FormProject {
  project: {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    jurisdiction: {
      export_country_iso: string;
      import_country_iso: string;
      transit_country_isos?: string[];
      is_eu_route: boolean;
    };
  };
  notification: Record<string, unknown>;
  movement?: Record<string, unknown> | null;
  supporting_documents?: Record<string, unknown> | null;
  validation?: Record<string, unknown> | null;
  meta?: {
    schema_version: string;
    exported_at: string;
    tool: string;
  };
}

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

export async function generateNotificationPdf(formData: FormProject): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), 'public/templates/vcop8_notification.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const registryPath = path.join(process.cwd(), 'src/lib/schemas/template_registry.json');
  const registryRaw = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const registry = (registryRaw.blocks ?? registryRaw) as Record<string, RegistryBlock>;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const fontSize = 10;

  const notification = formData.notification as Record<string, Record<string, unknown>>;

  for (const [blockKey, block] of Object.entries(registry)) {
    const blockData = notification[blockKey] as Record<string, unknown> | undefined;
    if (!blockData) continue;

    for (const [fieldKey, coord] of Object.entries(block.fields)) {
      if (coord.x === 0 && coord.y === 0) {
        console.warn(`[PDFGEN] Skipping ${blockKey}.${fieldKey} — coordinates not calibrated`);
        continue;
      }

      const pageNum = coord.page - 1;
      if (pageNum < 0 || pageNum >= pages.length) {
        console.warn(`[PDFGEN] Invalid page ${coord.page} for ${blockKey}.${fieldKey}`);
        continue;
      }

      const page = pages[pageNum];
      const { height: pageHeight } = page.getSize();

      // Checkbox fields: draw 'x' at matching option coordinate only
      // Note: '✓' requires an embedded TTF font; StandardFonts.Helvetica uses WinAnsi
      if (coord.type === 'checkbox') {
        const lastUnderscore = fieldKey.lastIndexOf('_');
        const parentKey = fieldKey.substring(0, lastUnderscore);
        const optionSuffix = fieldKey.substring(lastUnderscore + 1).toLowerCase();
        const rawValue = blockData[parentKey];
        if (rawValue === null || rawValue === undefined) continue;
        const normalizedValue = typeof rawValue === 'boolean'
          ? (rawValue ? 'yes' : 'no')
          : String(rawValue).toLowerCase();
        if (normalizedValue !== optionSuffix) continue;
        page.drawText('x', {
          x: coord.x,
          y: pageHeight - coord.y - fontSize,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });
        continue;
      }

      // Text fields: normal rendering
      const value = blockData[fieldKey];
      if (value === null || value === undefined) continue;
      if (value === '') continue;
      if (typeof value === 'string' && (value.toLowerCase() === 'na' || value.toLowerCase() === 'n/a')) continue;

      let displayValue: string;
      if (Array.isArray(value)) {
        displayValue = value.map(v => String(v)).join(', ');
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else {
        displayValue = String(value);
      }

      page.drawText(displayValue, {
        x: coord.x,
        y: pageHeight - coord.y - fontSize,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}