import { NextResponse } from "next/server";


class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}
export function GET() {
  // A faulty API route to test Sentry's error monitoring
  // throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
