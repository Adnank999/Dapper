



import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/user";

export async function GET(request: Request) {
  console.log("Auth callback route triggered");

  const { searchParams, origin } = new URL(request.url);
  // console.log("Request URL:", request.url);
  // console.log("Origin:", origin);

  const code = searchParams.get("code");
  // console.log("Auth code present:", !!code);

  // Default redirect URL
  let next = searchParams.get("next") ?? "/";
  // console.log("Initial next parameter:", next);

  if (!next.startsWith("/")) {
    // Ensure "next" is a relative URL
    next = "/";
    // console.log("Next parameter not relative, reset to:", next);
  }

  const supabase = await createClient();

  if (code) {
    console.log("Attempting to exchange code for session");
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        // console.error("Error exchanging code for session:", error);
        const errorRedirect = `${origin}/auth/auth-code-error`;
        console.log("Redirecting to error page:", errorRedirect);
        return NextResponse.redirect(errorRedirect);
      }

      // Retrieve the authenticated user
      const userData = await getUser();
      // console.log("User data retrieved:", userData);

      // Redirect to the "next" route or default route
      const successRedirect = `${origin}${next}`;
      // console.log("Redirecting to success route:", successRedirect);
      return NextResponse.redirect(successRedirect);
    } catch (error) {
      console.error("Exception during auth flow:", error);
      const errorRedirect = `${origin}/auth/auth-code-error`;
      console.log("Redirecting to error page:", errorRedirect);
      return NextResponse.redirect(errorRedirect);
    }
  } else {
    console.warn("No code parameter found in URL");
    const errorRedirect = `${origin}/auth/auth-code-error`;
    console.log("Redirecting to error page:", errorRedirect);
    return NextResponse.redirect(errorRedirect);
  }
}
