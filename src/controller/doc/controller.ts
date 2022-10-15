import {
  registerGetDocumentationFunction,
  registerGetDocumentationSectionFunction,
  registerGetDocumentationSummaryFunction,
} from "../../../gen/router.ts";
import { getDocumentation } from "./get-documentation.ts";
import { getDocumentationSection } from "./get-documentation-section.ts";
import { getDocumentationSummary } from "./get-documentation-summary.ts";

export class DocController {
  init() {
    registerGetDocumentationSummaryFunction(getDocumentationSummary);
    registerGetDocumentationFunction(getDocumentation);
    registerGetDocumentationSectionFunction(getDocumentationSection);
  }
}
