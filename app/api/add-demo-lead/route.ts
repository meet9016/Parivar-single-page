import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let name = "";
    let mobile = "";
    let city = "";
    let samaj_name = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      name = body.name || "";
      mobile = body.mobile || "";
      city = body.city || "";
      samaj_name = body.samaj_name || "";
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      name = params.get("name") || "";
      mobile = params.get("mobile") || "";
      city = params.get("city") || "";
      samaj_name = params.get("samaj_name") || "";
    }

    const formData = new URLSearchParams();
    if (name) formData.append("name", name);
    if (mobile) formData.append("mobile", mobile);
    if (city) formData.append("city", city);
    if (samaj_name) formData.append("samaj_name", samaj_name);

    const response = await fetch("https://crm.parivar.me/add-demo-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData.toString(),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(
      { success: response.ok, ...data, data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    console.error("Proxy error to crm.parivar.me:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to forward lead" },
      { status: 500 }
    );
  }
}
