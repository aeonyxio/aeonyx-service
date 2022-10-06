import { injector } from "$injector/mod.ts";
import { DataProvider } from "@/provider/data.ts";
import { GetPostByIdFunction } from "$generated/router.ts";
import { RendererService } from "@/service/renderer.service.ts";

export const getPostById: GetPostByIdFunction = async ({ params }) => {
  const data = injector.get(DataProvider);
  const renderer = injector.get(RendererService);
  const post = await data.posts.findOne({ id: params.id });

  if (post === undefined) {
    throw new Error();
  }

  const author = await data.authors.findOne({ id: post.author });

  if (author === undefined) {
    throw new Error();
  }

  return {
    body: {
      id: post.id,
      title: post.title,
      description: post.description,
      thumbnail: post.thumbnail,
      tags: post.tags,
      markdown: renderer.render(post.markdown),
      date: post.date.toISOString(),
      author: {
        name: author.id,
        youtube: author.youtube,
        description: author.description,
        thumbnail: author.thumbnail,
      },
    },
  };
};
