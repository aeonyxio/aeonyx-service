import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetPostsSummaryFunction } from "../../../gen/router.ts";

export const getPostsSummary: GetPostsSummaryFunction = async ({ query }) => {
  const data = injector.get(DataProvider);
  const search: { author?: string; hidden: false } = {
    hidden: false,
  };
  if (query.author) search.author = query.author;
  const posts = await data.posts.find(search).toArray();
  return {
    body: posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        thumbnail: post.thumbnail,
        author: post.author,
        tags: post.tags,
        date: post.date.toISOString(),
      };
    }),
  };
};
