import type { Contents } from "./Contents.ts";
export type Documentation = {
  documentationTitle: string;
  sectionTitle: string;
  subSectionTitle: string;
  contents: Contents;
  html: string;
};
