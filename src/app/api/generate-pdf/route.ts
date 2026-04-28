import { NextRequest, NextResponse } from 'next/server';
import { generateNotificationPdf } from '../../../lib/pdf/generate-notification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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