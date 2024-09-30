/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export function handleApiError(
  error: any,
  errorMessage: string = "An error occurred",
  statusCode: number = 500
) {
  console.error(errorMessage, error);
  return NextResponse.json({ error: errorMessage }, { status: statusCode });
}
