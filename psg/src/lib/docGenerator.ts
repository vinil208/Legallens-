import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs as fileSaverSaveAs } from "file-saver";

interface DocData {
  templateId: string;
  templateTitle: string;
  fields: Record<string, string>;
}

const downloadBlob = (blob: Blob, filename: string) => {
  if (typeof fileSaverSaveAs === "function") {
    fileSaverSaveAs(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export async function generateAndDownloadDoc({ templateId, templateTitle, fields }: DocData) {
  const sections: Paragraph[] = [];

  const addHeading = (text: string) => {
    sections.push(new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }));
  };

  const addSubHeading = (text: string) => {
    sections.push(new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { after: 150 } }));
  };

  const addText = (text: string, bold = false) => {
    sections.push(new Paragraph({
      children: [new TextRun({ text, bold, size: 24 })],
      spacing: { after: 120 },
    }));
  };

  const addBlankLine = () => {
    sections.push(new Paragraph({ text: "", spacing: { after: 100 } }));
  };

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  if (templateId === "rti") {
    addHeading("APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005");
    addBlankLine();
    addText(`Date: ${today}`);
    addBlankLine();
    addText("To,");
    addText("The Public Information Officer,");
    addText(fields.department || "[Government Department]");
    addBlankLine();
    addSubHeading("Subject: Request for Information under RTI Act, 2005");
    addBlankLine();
    addText(`I, ${fields.name || "[Your Name]"}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`);
    addBlankLine();
    addText(fields.information || "[Information requested]");
    addBlankLine();
    addText("I am enclosing an application fee of ₹10 (Ten Rupees) by way of Postal Order / DD / Court Fee Stamp.");
    addBlankLine();
    addText("If the information sought concerns the life or liberty of a person, kindly provide it within 48 hours as per Section 7(1) of the RTI Act.");
    addBlankLine();
    addText("Thanking you,");
    addText("Yours faithfully,");
    addBlankLine();
    addText(fields.name || "[Your Name]", true);
    addText(`Address: ${fields.address || "[Your Address]"}`);
  } else if (templateId === "legal-notice") {
    addHeading("LEGAL NOTICE");
    addText(`Date: ${today}`);
    addBlankLine();
    addText("To,");
    addText(fields.recipient || "[Recipient Name]");
    addBlankLine();
    addText(`Subject: ${fields.subject || "[Subject]"}`, true);
    addBlankLine();
    addText("Under instructions from and on behalf of my client, I hereby serve upon you the following Legal Notice:");
    addBlankLine();
    addText(fields.details || "[Details of grievance]");
    addBlankLine();
    addText("You are hereby called upon to comply with the above demands within 15 days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, at your risk and cost.");
    addBlankLine();
    addText("Thanking you,");
    addText(fields.sender || "[Your Name]", true);
  } else if (templateId === "complaint") {
    addHeading("FORMAL COMPLAINT");
    addText(`Date: ${today}`);
    addBlankLine();
    addText("To,");
    addText(fields.authority || "[Authority]");
    addBlankLine();
    addText(`Subject: Formal Complaint regarding incident dated ${fields.incident || "[Date]"}`, true);
    addBlankLine();
    addText("Respected Sir/Madam,");
    addBlankLine();
    addText(`I, ${fields.complainant || "[Your Name]"}, wish to bring to your kind attention the following matter:`);
    addBlankLine();
    addText(fields.description || "[Description of complaint]");
    addBlankLine();
    addText("I kindly request you to take appropriate action in this matter at the earliest. I am willing to cooperate with any investigation and provide further details as required.");
    addBlankLine();
    addText("Thanking you,");
    addText("Yours faithfully,");
    addBlankLine();
    addText(fields.complainant || "[Your Name]", true);
  }

  if (!sections.length) {
    throw new Error("Unsupported document template");
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${templateTitle.replace(/\s+/g, "_")}_${Date.now()}.docx`;
  downloadBlob(blob, fileName);
}

