import {
  registerGetPostByIdFunction,
  registerGetPostsSummaryFunction,
} from "$generated/router.ts";
import { getPostById } from "./get-post-by-id.ts";
import { getPostsSummary } from "./get-posts-summary.ts";

export class PostController {
  init() {
    registerGetPostsSummaryFunction(getPostsSummary);
    registerGetPostByIdFunction(getPostById);
  }
}
