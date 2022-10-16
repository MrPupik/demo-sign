import { writeFileSync } from "fs";
import { PDFPageDrawImageOptions } from "pdf-lib";
import { Document, textField, Signature, loadTemplate } from "./doc-utils";
import { stempConfig, TemplateConfig } from "./template-config";

type SignatrueData = {
  pngDataURL: string;
  textFields: Map<string, string>;
};

export async function signDocuments(
  signatureFromClient: SignatrueData,
  doc_id: string
) {
  const config = TemplateConfig[doc_id as keyof typeof TemplateConfig];
  const textfields: Array<textField> = [];
  const sigs: Signature[] = [];


  // populate signatrues
  config.signatures.forEach((sig: PDFPageDrawImageOptions) => {
    sigs.push({
      pngDataUrl: signatureFromClient.pngDataURL,
      options: sig,
      stemp: config.stemp || false,
    });
  });

  // populate text fields
  type textFieldsKey = keyof typeof config.textFields;
  signatureFromClient.textFields.forEach((value, name) => {
    if (!config.textFields?.[name as textFieldsKey]) {
      throw Error(`No ${name} field in ${doc_id} template`);
    }
    textfields.push({
      value: value,
      options: config.textFields[name as textFieldsKey],
    });
  });

  // populate stemp data
  if (config.stemp)
  {
    sigs.push()
  }

  const doc = await Document.fromFile(loadTemplate(config.templateFileName));
  doc.sign(sigs, textfields, config.pages as number[]);

  writeFileSync("signed.pdf", await doc.pdf.save());
}
