
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const appUrl = process.env.APP_URL || new URL(request.url).origin;
  
  const manifest = {
    url: appUrl,
    name: "Apex Gift Bot",
    iconUrl: `${appUrl}/icon.png`, // Assuming you have an icon.png in your public folder
    termsOfUseUrl: `${appUrl}/terms-of-use.html`,
    privacyPolicyUrl: `${appUrl}/privacy-policy.html`,
  };

  return NextResponse.json(manifest);
}
