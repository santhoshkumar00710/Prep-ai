import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/interview', '/results'];
const AUTH_PATHS = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = supabaseUrl && 
                       supabaseUrl.startsWith('https://') && 
                       supabaseAnonKey && 
                       !supabaseAnonKey.startsWith('your_');

  if (!isConfigured) {
    return new NextResponse(
      `<!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <title>Setup Required — PrepAI</title>
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <style>
           body {
             background: #07080f;
             color: #f1f5f9;
             font-family: system-ui, -apple-system, sans-serif;
             display: flex;
             align-items: center;
             justify-content: center;
             min-height: 100vh;
             margin: 0;
             padding: 20px;
             box-sizing: border-box;
           }
           .card {
             background: rgba(19, 22, 41, 0.7);
             backdrop-filter: blur(20px);
             border: 1px solid rgba(255,255,255,0.06);
             padding: 40px;
             border-radius: 24px;
             max-width: 480px;
             text-align: center;
             box-shadow: 0 0 30px rgba(99, 102, 241, 0.25);
             box-sizing: border-box;
           }
           h1 {
             font-size: 24px;
             margin-top: 0;
             margin-bottom: 12px;
             background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #67e8f9 100%);
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
           }
           p {
             color: #94a3b8;
             font-size: 14px;
             line-height: 1.6;
             margin-bottom: 24px;
           }
           code {
             display: block;
             background: #0d0f1a;
             padding: 16px;
             border-radius: 12px;
             text-align: left;
             font-size: 13px;
             color: #a5b4fc;
             border: 1px solid rgba(255,255,255,0.04);
             overflow-x: auto;
           }
           .badge {
             display: inline-block;
             background: rgba(99, 102, 241, 0.1);
             color: #818cf8;
             padding: 4px 12px;
             border-radius: 99px;
             font-size: 12px;
             font-weight: 500;
             margin-bottom: 20px;
           }
         </style>
       </head>
       <body>
         <div class="card">
           <div class="badge">Configuration Guide</div>
           <h1>Configure Supabase</h1>
           <p>Before launching PrepAI, please replace the default placeholder credentials in your local environment file <code>.env.local</code> with your actual keys:</p>
           <code>
             NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br>
             NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here<br>
             GEMINI_API_KEY=your-gemini-api-key-here
           </code>
         </div>
       </body>
       </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );


  // Refresh session — do NOT remove this, it keeps cookies synced
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Not logged in → redirect to /auth
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // Already logged in → redirect away from /auth
  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|models|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)',
  ],
};
