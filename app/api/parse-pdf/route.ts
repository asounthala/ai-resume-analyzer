import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("pdf") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const text = await new Promise<string>((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                const text = pdfData.Pages.flatMap((page) =>
                    page.Texts.map((t) => {
                        try {
                            return decodeURIComponent(t.R.map((r) => r.T).join(""));
                        } catch {
                            return t.R.map((r) => r.T).join("");
                        }
                    })
                ).join(" ");
                resolve(text);
            });

            pdfParser.on("pdfParser_dataError", reject);
            pdfParser.parseBuffer(buffer);
        });


        return NextResponse.json({ text });
    } catch (err) {
        console.error("PDF parse error:", err);
        return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }
}