import { superoak } from "$superoak/mod.ts";
import sinon from "$sinon";
import { beforeAll, describe, it } from "$testing/bdd.ts";
import { injector } from "$injector/mod.ts";
import { DataProvider } from "@/provider/data.ts";
import { Application } from "./app.ts";

const app = new Application();

describe("Integration tests", () => {
  beforeAll(async () => {
    injector.inject(
      {
        init: sinon.stub(),
      },
      { token: DataProvider }
    );
    await app.init();
  });

  it("should return a summary of posts", async () => {
    const posts = [
      {
        id: "test-id",
        title: "Test title.",
        description: "test desacription!",
        thumbnail: "/image.png",
        author: "author-id",
        tags: ["these", "are", "tags"],
        markdown: "## Heading",
        date: new Date("2022-10-02T14:51:31.406Z"),
      },
    ];

    injector.inject(
      {
        posts: { find: sinon.stub(() => ({ toArray: () => posts })) },
      },
      { token: DataProvider, override: true }
    );

    const request = await superoak(app.app);
    await request
      .get("/post")
      .expect(200)
      .expect([
        {
          id: "test-id",
          title: "Test title.",
          description: "test desacription!",
          thumbnail: "/image.png",
          author: "author-id",
          tags: ["these", "are", "tags"],
        },
      ]);
  });

  it("should return a summary of docs", async () => {
    const docs = [
      {
        id: "doc-1",
        title: "Test title 1.",
        default: "value",
        sections: {
          section1: {
            title: "Test title.",
            subSections: {
              subSection1: {
                title: "Test title.",
              },
            },
          },
        },
      },
      {
        id: "doc-2",
        title: "Test title 2.",
        default: "value",
        sections: {
          section1: {
            title: "Test title.",
            subSections: {
              subSection1: {
                title: "Test title.",
              },
            },
          },
        },
      },
    ];

    injector.inject(
      {
        docs: { find: sinon.stub(() => ({ toArray: () => docs })) },
      },
      { token: DataProvider, override: true }
    );

    const request = await superoak(app.app);
    await request
      .get("/doc")
      .expect(200)
      .expect({
        "doc-1": {
          title: "Test title 1.",
          default: "value",
          sections: {
            section1: {
              title: "Test title.",
              subSections: {
                subSection1: {
                  title: "Test title.",
                },
              },
            },
          },
        },
        "doc-2": {
          title: "Test title 2.",
          default: "value",
          sections: {
            section1: {
              title: "Test title.",
              subSections: {
                subSection1: {
                  title: "Test title.",
                },
              },
            },
          },
        },
      });
  });

  it("should return a specific documentation section", async () => {
    const docSection = {
      id: "test-id",
      markdown: "## Heading",
    };

    injector.inject(
      {
        docSections: { findOne: sinon.stub(() => docSection) },
      },
      { token: DataProvider, override: true }
    );

    const request = await superoak(app.app);
    await request
      .get("/doc/doc|section|sub-section")
      .expect(200)
      .expect('<h2 id="heading">Heading</h2>\n');
  });

  it("should return a specific post", async () => {
    const post = {
      id: "test-id",
      title: "Test title.",
      description: "test desacription!",
      thumbnail: "/image.png",
      author: "author-id",
      tags: ["these", "are", "tags"],
      markdown: "## Heading",
      date: new Date("2022-10-02T14:51:31.406Z"),
    };
    const author = {
      id: "author-id",
      youtube: "author-youtube",
      description: "author-description",
      thumbnail: "author-thumbnail",
    };

    injector.inject(
      {
        posts: { findOne: sinon.stub(() => post) },
        authors: { findOne: sinon.stub(() => author) },
      },
      { token: DataProvider, override: true }
    );

    const request = await superoak(app.app);
    await request
      .get("/post/test-id")
      .expect(200)
      .expect({
        id: "test-id",
        title: "Test title.",
        description: "test desacription!",
        thumbnail: "/image.png",
        tags: ["these", "are", "tags"],
        markdown: '<h2 id="heading">Heading</h2>\n',
        date: "2022-10-02T14:51:31.406Z",
        author: {
          name: "author-id",
          youtube: "author-youtube",
          description: "author-description",
          thumbnail: "author-thumbnail",
        },
      });
  });

  it("should validate correctly", async () => {
    const request = await superoak(app.app);
    await request
      .get("/post/test_id")
      .expect(400)
      .expect({ errorText: 'data/id must match pattern "^[a-z0-9-]+$"' });
  });
});
