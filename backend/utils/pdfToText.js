import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function pdfBufferToText(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((it) => it.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.replace(/\s+/g, " ").replace(/•/g, "• ").trim();
}