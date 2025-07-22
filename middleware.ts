import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { getUser } from "./lib/user";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { user, role } = await getUser();
  const protectedRoutes = ["/projects/create"]; 

  const url = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => url.startsWith(route));

  if (isProtected && !user && role !== "admin") {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}


