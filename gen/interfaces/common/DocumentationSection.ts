import type { Contents } from "./Contents.ts";
import type { DocSectionLookup } from "./DocSectionLookup.ts";
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
  previous?: DocSectionLookup;
  next?: DocSectionLookup;
};
