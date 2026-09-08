import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const formData = new URLSearchParams();
    if (body.name) formData.append("name", body.name);
    if (body.mobile) formData.append("mobile", body.mobile);
    if (body.city) formData.append("city", body.city);
    if (body.samaj_name) formData.append("samaj_name", body.samaj_name);

    const response = await fetch("https://crm.parivar.in/add-demo-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData.toString(),
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
