import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken } from "./utils/storage";

export default function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const accessToken = cookies.get("lettering-access")?.value;
  const { pathname, searchParams } = request.nextUrl;

  /* 정적 파일 요청인지 확인 */
  if (
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.endsWith(".svg") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname === "/manifest.json"
  ) {
    return NextResponse.next();
  }

  /* /verify/letter 페이지 접근 시 토큰 유무에 따라 처리 */
  if (pathname === "/verify/letter") {
    const urlParam = searchParams.get("url");

    // 액세스 토큰이 없는 경우
    if (!accessToken) {
      // `url` 파라미터가 있으면 해당 URL로, 없으면 기본 `/login`으로 이동
      const redirectUrl = urlParam ? `/login?url=${urlParam}` : "/login";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/error") ||
    request.nextUrl.pathname.startsWith("/verify")
  ) {
    return NextResponse.next();
  }
  
  /* 로그인 필요 없는 페이지 */
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/kakao")
  ) {
    // 로그인 되어 있는 경우 메인 페이지로 리다이렉트
    if (accessToken) {
      const redirectUrl = "/planet";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      // 로그인이 필요 없는 페이지는 그냥 다음 요청으로 진행
      return NextResponse.next();
    }
  }

  /* 로그인 필요한 페이지 */
  if (!accessToken) {
    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인 되어 있는 경우 요청 페이지로 진행
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images|manifest.json).*)",
  ],
};
