import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetPostByIdFunction } from "../../../gen/router.ts";
import { RendererService } from "../../service/renderer.service.ts";

export const getPostById: GetPostByIdFunction = async ({ params }) => {
  const data = injector.get(DataProvider);
  const renderer = injector.get(RendererService);
  const post = await data.posts.findOne({ id: params.id, hidden: false });

  if (post === undefined) {
    throw new Error();
  }

  const author = await data.authors.findOne({ id: post.author });

  if (author === undefined) {
    throw new Error();
  }

  const rendered = renderer.render(post.markdown);

  return {
    body: {
      id: post.id,
      title: post.title,
      description: post.description,
      thumbnail: post.thumbnail,
      tags: post.tags,
      contents: rendered.contents,
      html: rendered.html,
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
