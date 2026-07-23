import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * The current Atendimento.Center frontend does not expose Next.js Server
 * Actions. Reject requests that impersonate a Server Action so malformed
 * probes do not reach the App Router and pollute production logs.
 *
 * Remove or narrow this guard when legitimate Server Actions are introduced.
 */
export function proxy(request: NextRequest) {
  if (request.headers.has('next-action')) {
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
