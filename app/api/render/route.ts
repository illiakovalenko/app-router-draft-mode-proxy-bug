import { NextRequest } from "next/server";
import { cookies as nextCookies, draftMode } from "next/headers";
import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

const PreviewCookies = {
  PREVIEW_DATA: "__next_preview_data",
  PRERENDER_BYPASS: "__prerender_bypass",
};

export const resolveServerUrl = (req: NextApiRequest | NextRequest) => {
  // to preserve auth headers, use https if we're in our 3 main hosting options
  const useHttps = process.env.VERCEL !== undefined;
  const host = (req.headers as Headers).get
    ? (req.headers as Headers).get("x-forwarded-host") ||
      (req.headers as Headers).get("host")
    : (req as NextApiRequest).headers["x-forwarded-host"] ||
      (req as NextApiRequest).headers.host;

  // use https for requests with auth but also support unsecured http rendering hosts
  return `${useHttps ? "https" : "http"}://${host}`;
};

export const getQueryParamsForPropagation = (
  searchParams: URLSearchParams
): { [key: string]: string } => {
  const params: { [key: string]: string } = {};

  const xVercelProtectionBypass = searchParams.get(
    "x-vercel-protection-bypass"
  );
  const xVercelSetBypassCookie = searchParams.get("x-vercel-set-bypass-cookie");

  if (xVercelProtectionBypass) {
    params["x-vercel-protection-bypass"] = xVercelProtectionBypass;
  }
  if (xVercelSetBypassCookie) {
    params["x-vercel-set-bypass-cookie"] = xVercelSetBypassCookie;
  }

  return params;
};

export async function GET(request: Request) {
  const draft = await draftMode();

  draft.enable();

  redirect(`/test?language=en&timestamp=${Date.now()}`);
}
