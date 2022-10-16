import { PDFPageDrawPageOptions, PDFPageDrawTextOptions } from "pdf-lib";

export const DEFAULTS = {
  signatures: [
    {
      x: 50,
      y: 100,
      width: 50,
      height: 50,
    },
  ],
  textFields: {},
};

type TemplateConfigType = Record<string, TemplateInfoType>;

type TemplateInfoType = {
  templateFileName: string;
  signatures: PDFPageDrawPageOptions[];
  stemp?: boolean;
  pages?: number[];
  textFields?: Record<string, PDFPageDrawTextOptions>;
};

export const TemplateConfig: TemplateConfigType = {
  FormFields: {
    templateFileName: "fullApp",
    ...DEFAULTS,
    pages: [0, 1, 2, 3, 5, 6, 8],
  },
  legalAuth: {
    ...DEFAULTS,
    templateFileName: "Legal_Authorizations.pdf",
    stemp: true,
  },
  prevExpirence: {
    templateFileName: "Information_prev_employer.pdf",
    signatures: [
      {
        x: 215,
        y: 630,
        width: DEFAULTS.signatures[0].width,
        height: DEFAULTS.signatures[0].height,
      },
    ],
    textFields: {
      date: {
        x: 50,
        y: 717,
      },
      ssn: {
        x: 215,
        y: 717,
      },
      applicantName1: {
        x: 50,
        y: 660,
      },
      applicantName2: {
        x: 520,
        y: 718,
      },
      FormerEmployerName: {
        x: 280,
        y: 623,
      },
      ApplyingCompanyName: {
        x: 132,
        y: 603,
        size: 10,
      },
    },
  },
};

type relativeLocationType = {
  stepsRight: number;
  stepsDown: number;
};

type relativeText = {
  name?: string;
  value?: string;
  relativeLocation: relativeLocationType;
};

type relativeTextGroup = {
  options?: PDFPageDrawTextOptions;
  fields: relativeText[];
};

type stempConfigType = {
  signature: {
    relativeLocation: relativeLocationType;
    options?: PDFPageDrawPageOptions;
  };
  titles: relativeTextGroup;
  textFields: relativeTextGroup;
};

export const stempConfig: stempConfigType = {
  signature: {
    relativeLocation: {
      stepsRight: 7,
      stepsDown: 5,
    },
    options: {
      width: 50,
      height: 50,
    },
  },
  titles: {
    options: {
      opacity: 0.7,
      size: 12,
    },
    fields: [
      {
        value: "Printed Name:",
        relativeLocation: {
          stepsRight: 0,
          stepsDown: 1,
        },
      },
      {
        value: "Social Security #:",
        relativeLocation: {
          stepsRight: 0,
          stepsDown: 4,
        },
      },
      {
        value: "Signed Date:",
        relativeLocation: {
          stepsRight: 0,
          stepsDown: 6,
        },
      },
    ],
  },
  textFields: {
    fields: [
      {
        name: "applicantName",
        relativeLocation: {
          stepsRight: 0,
          stepsDown: 2,
        },
      },
      {
        name: "ssn",
        relativeLocation: {
          stepsRight: 0,
          stepsDown: 5,
        },
      },
      {
        name: "date",
        relativeLocation: {
          stepsRight: 3.2,
          stepsDown: 6,
        },
      },
    ],
  },
};
