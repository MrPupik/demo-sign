import { Document } from "./doc-utils";
import express from "express";
import { signDocuments } from "./manager";
const app = express();
const port = 3333; // default port to listen
app.use(express.json());

app.get("/", (req, res) => {
  res.json("{status: document signing service is up}");
});

app.get("/sign", (req, res) => {
  const doc_id = req.body.templateName;
  const sigData = req.body.signatureData;
  const textFields = new Map<string, string>();
  (sigData.textFields as string[][]).forEach(([key, value]) => {
    textFields.set(key, value);
  });

  sigData.textFields = textFields;
  signDocuments(sigData, doc_id);

  res.status(201);
  res.json({ status: "signed" });
});

app.listen(port, () => {
  console.log(`tf1-docpsign running at http://localhost:${port}`);
});
