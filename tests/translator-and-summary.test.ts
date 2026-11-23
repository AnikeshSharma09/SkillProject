import { describe, it, expect } from "vitest";
import { processDocumentContent, generateDocumentSummary } from "../lib/ai/document-processor";
import {
  SUPPORTED_LANGUAGES,
  translateSummary,
  translateFieldLabel,
} from "../lib/ai/translator";

describe("Document 4-5 Line Executive Summary & Multilingual Translation Engine", () => {
  it("generates a structured 4-to-5 line executive summary and extracts due date", async () => {
    const rawInvoice = `TAX INVOICE
Supplier: Apex Global Tech
Invoice No: INV-2026-99
Date: 2026-10-01
Due Date: 2026-10-15
Total Payable: USD 759.12`;

    const result = await processDocumentContent("Invoice_INV2026.pdf", rawInvoice);

    expect(result.summary).toBeDefined();
    const lines = result.summary!.split("\n");
    expect(lines.length).toBeGreaterThanOrEqual(4);
    expect(lines.length).toBeLessThanOrEqual(5);

    expect(result.dueDate).toBe("2026-10-15");
    expect(result.summary).toContain("Official commercial invoice");
    expect(result.summary).toContain("759.12");
  });

  it("supports all 6 business languages", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(["en", "es", "fr", "de", "hi", "ja"]);
  });

  it("translates executive summaries into Spanish, French, German, Hindi, and Japanese", () => {
    const sampleSummary = [
      "Official commercial invoice (Ref: INV-1024) issued by registered vendor to Symbiosis University.",
      "Total balance payable is USD 759.12, covering itemized products and standard applicable taxes.",
      "Itemized transaction schedule details multi-unit inventory fulfillments and operational service deliverables.",
      "Commercial settlement deadline is scheduled for 2026-10-15 via corporate banking disbursement.",
      "All line items and digital signatures have passed automated reconciliation checks and are queued for release approval.",
    ].join("\n");

    const es = translateSummary(sampleSummary, "es");
    expect(es).toContain("Factura comercial oficial");
    expect(es).toContain("El saldo total a pagar es");

    const fr = translateSummary(sampleSummary, "fr");
    expect(fr).toContain("Facture commerciale officielle");
    expect(fr).toContain("Le solde total à payer est de");

    const de = translateSummary(sampleSummary, "de");
    expect(de).toContain("Offizielle Handelsrechnung");
    expect(de).toContain("Der fällige Gesamtsaldo beträgt");

    const hi = translateSummary(sampleSummary, "hi");
    expect(hi).toContain("आधिकारिक वाणिज्यिक चालान");
    expect(hi).toContain("कुल देय शेष राशि है");

    const ja = translateSummary(sampleSummary, "ja");
    expect(ja).toContain("公式商業請求書");
    expect(ja).toContain("支払総額は");
  });

  it("translates field labels across languages accurately", () => {
    expect(translateFieldLabel("Total Amount", "es")).toBe("Monto total");
    expect(translateFieldLabel("Total Amount", "hi")).toBe("कुल देय राशि");
    expect(translateFieldLabel("Total Amount", "ja")).toBe("合計金額");
    expect(translateFieldLabel("Due Date", "es")).toBe("Fecha de vencimiento (Plazo)");
    expect(translateFieldLabel("Due Date", "de")).toBe("Fälligkeitsdatum");
    expect(translateFieldLabel("Invoice Number", "fr")).toBe("Numéro de facture");
  });
});
