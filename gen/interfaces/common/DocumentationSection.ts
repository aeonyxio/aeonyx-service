import type { Contents } from "./Contents.ts";
export type DocumentationSection = {
  documentationTitle: string;
  sectionTitle: string;
  subSectionTitle: string;
  description: string;
  thumbnail: string;
  authors: string[];
  tags: string[];
  contents: Contents;
  html: string;
};
