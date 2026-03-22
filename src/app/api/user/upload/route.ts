import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you would upload to S3, Vercel Blob, etc.
    // For now, we'll return a mock URL that includes the filename
    const mockUrl = `https://skillbridge-uploads.mock/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    return NextResponse.json({ 
      url: mockUrl,
      name: file.name,
      size: file.size
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
