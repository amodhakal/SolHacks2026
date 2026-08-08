import { NextResponse } from 'next/server';
import { auditLogger } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actor, action, resource, details } = body;

    if (!actor || !action || !resource) {
      return NextResponse.json({ error: 'Missing required fields: actor, action, resource' }, { status: 400 });
    }

    const entry = auditLogger.log(actor, action, resource, details);
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const logs = auditLogger.getLogs();
  const isValid = auditLogger.verifyChain();
  return NextResponse.json({ logs, isValid });
}
