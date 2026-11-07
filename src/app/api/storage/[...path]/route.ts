import { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://127.0.0.1:8000";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendUrl = `${BACKEND}/storage/${path.join("/")}`;

  const headers: HeadersInit = {};
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) headers["Range"] = rangeHeader;

  const upstream = await fetch(backendUrl, { headers });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  const acceptRanges = upstream.headers.get("accept-ranges");
  const contentRange = upstream.headers.get("content-range");

  if (contentType) responseHeaders.set("content-type", contentType);
  if (contentLength) responseHeaders.set("content-length", contentLength);
  if (acceptRanges) responseHeaders.set("accept-ranges", acceptRanges);
  if (contentRange) responseHeaders.set("content-range", contentRange);
  responseHeaders.set("cache-control", "public, max-age=86400");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
