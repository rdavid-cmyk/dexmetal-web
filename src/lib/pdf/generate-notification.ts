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
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8')) as Record<string, RegistryBlock>;
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

      const value = blockData[fieldKey];
      if (value === null || value === undefined) continue;
      if (value === '') continue;

      const pageNum = coord.page - 1;
      if (pageNum < 0 || pageNum >= pages.length) {
        console.warn(`[PDFGEN] Invalid page ${coord.page} for ${blockKey}.${fieldKey}`);
        continue;
      }

      const page = pages[pageNum];
      const { height: pageHeight } = page.getSize();
      
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