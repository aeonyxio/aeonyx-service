import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetPostsSummaryFunction } from "../../../gen/router.ts";

export const getPostsSummary: GetPostsSummaryFunction = async () => {
  const data = injector.get(DataProvider);
  const posts = await data.posts.find({}).toArray();
  return {
    body: posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        thumbnail: post.thumbnail,
        author: post.author,
        tags: post.tags,
      };
    }),
  };
};
