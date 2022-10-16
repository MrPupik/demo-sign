import { readFileSync, writeFileSync } from "fs";
import moment, { Moment } from "moment";
import {
  PDFDocument,
  PDFImage,
  PDFPage,
  PDFPageDrawImageOptions,
  PDFSignature,
  rgb,
  StandardFonts,
  PDFPageDrawTextOptions,
} from "pdf-lib";
import { TemplateConfig } from "./template-config";

const TEMPLATES = {
  info: "Information_prev_employer.pdf",
  auth: "Legal_Authorizations.pdf",
};
const DEFAULTS = {
  TEXT_SIZE: 12,
  WIDHT: 50,
  HEIGHT: 50,
};

export function loadTemplate(name: string) {
  return readFileSync(`./templates/${name}`);
}

export type Signature = {
  pngDataUrl: string;
  stemp: boolean;
  options: PDFPageDrawImageOptions;
};

export type textField = {
  value: string;
  options: PDFPageDrawTextOptions;
};

export class Document {
  pdf: PDFDocument = undefined as unknown as PDFDocument;
  static defaultSignSpecs: PDFPageDrawImageOptions = {
    width: DEFAULTS.WIDHT,
    height: DEFAULTS.HEIGHT,
    x: 50,
    y: 100,
  };
  constructor(pdfDoc: PDFDocument | undefined) {
    if (pdfDoc) {
      this.pdf = pdfDoc;
    }
  }

  async combine(new_doc: Document) {
    if (!this.pdf) {
      this.pdf = new_doc.pdf;
      return this.pdf;
    }
    const new_pdf = new_doc.pdf;
    const readyToInsert = await this.pdf.copyPages(new_pdf, [0]);
    readyToInsert.forEach((page) => this.pdf.addPage(page));
    return this.pdf;
  }

  static async fromFile(file: Buffer) {
    return new Document(await PDFDocument.load(file));
  }

  async insertTextField(page: PDFPage, text: textField) {
    const timesRomanFont = await this.pdf.embedFont(StandardFonts.TimesRoman);
    const textOptions = {
      font: timesRomanFont,
      size: DEFAULTS.TEXT_SIZE,
      ...text.options,
    };
    page.drawText(text.value, textOptions);
  }

  async sign(
    sigs: Signature[],
    textFields: textField[],
    pageIndexes?: number[]
  ) {
    const pages = this.pdf.getPages();
    const Includedindexes = pageIndexes
      ? pageIndexes
      : this.pdf.getPageIndices();
    for (const index of Includedindexes) {
      for (const text of textFields) {
        this.insertTextField(pages[index], text);
      }
      for (const sigData of sigs) {
        const sigImage = await this.pdf.embedPng(sigData.pngDataUrl);
        if (sigData.stemp) {
          // Document.tf1Stemp(sigData, pages[index]);
          console.log("stemp");
        } else {
          pages[index].drawImage(sigImage, sigData.options);
        }
      }
    }
  }
}
