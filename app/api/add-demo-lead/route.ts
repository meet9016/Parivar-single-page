import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("http://crm.insuraa.in/add-demo-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(
      { success: response.ok, data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    console.error("Proxy error to crm.insuraa.in:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to forward lead" },
      { status: 500 }
    );
  }
}
