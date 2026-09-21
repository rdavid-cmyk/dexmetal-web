import { NextRequest, NextResponse } from 'next/server';
import { generateNotificationPdf } from '../../../lib/pdf/generate-notification';
import { generateMovementPdf } from '../../../lib/pdf/generate-movement';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Document-type discriminator — Movement PDF bug fix 2026-08-18.
    // The Movement tab was silently producing Notification PDFs (same class
    // as Amendment 17: a sibling action wired to the wrong handler). Each
    // tool's Generate PDF button now tags its body with documentType so the
    // route invokes the correct generator.
    const docType = body?.documentType || 'notification';

    if (docType === 'movement') {
      if (!body || !body.movement || !body.movement.block_1) {
        return NextResponse.json(
          { error: 'Invalid Movement JSON — missing required blocks' },
          { status: 400 }
        );
      }
      const pdfBytes = await generateMovementPdf(body);
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="basel_movement_draft.pdf"'
        }
      });
    }

    // Default: Notification document.
    if (!body || !body.notification || !body.notification.block_1 || !body.notification.block_2) {
      return NextResponse.json(
        { error: 'Invalid FormProject JSON — missing required blocks' },
        { status: 400 }
      );
    }

    const pdfBytes = await generateNotificationPdf(body);

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="basel_notification_draft.pdf"'
      }
    });
  } catch (error) {
    console.error('[PDFGEN-API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
