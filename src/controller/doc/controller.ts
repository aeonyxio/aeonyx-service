import {
  registerGetDocumentationSummaryFunction,
  registerGetDocumentationSectionFunction,
} from "$generated/router.ts";
import { getDocumentationSection } from "./get-documentation-section.ts";
import { getDocumentationSummary } from "./get-documentation-summary.ts";

export class DocController {
  init() {
    registerGetDocumentationSummaryFunction(getDocumentationSummary);
    registerGetDocumentationSectionFunction(getDocumentationSection);
  }
}
