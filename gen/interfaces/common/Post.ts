import type { Contents } from "./Contents.ts";
import type { Author } from "./Author.ts";
export type Post = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  contents: Contents;
  html: string;
  author: Author;
  tags: string[];
  date: string;
};
