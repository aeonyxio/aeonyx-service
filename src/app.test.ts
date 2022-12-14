import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import sinon from "https://cdn.skypack.dev/sinon@12.0.1?dts";
import {
  beforeAll,
  describe,
  it,
} from "https://deno.land/std@0.158.0/testing/bdd.ts";
import { injector } from "../injector/mod.ts";
import {
  AuthorSchema,
  DataProvider,
  DocSchema,
  DocSectionSchema,
  PostSchema,
} from "./provider/data.ts";
import { Application } from "./app.ts";

const app = new Application();

describe("Integration tests", () => {
  beforeAll(async () => {
    injector.inject(
      {
        init: sinon.stub(),
      },
      { token: DataProvider },
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
    ] as PostSchema[];

    injector.inject(
      {
        posts: { find: sinon.stub(() => ({ toArray: () => posts })) },
      },
      { token: DataProvider, override: true },
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
          date: "2022-10-02T14:51:31.406Z",
        },
      ]);
  });

  it("should return a summary of docs", async () => {
    const docs = [
      {
        id: "doc-1",
        title: "Test title 1.",
        default: "value",
        authors: ["name 1"],
        description: "description.",
        thumbnail: "thumb.png",
        tags: ["tag1"],
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
        hidden: false,
        updatedOn: new Date("2022-10-02T14:51:31.406Z"),
        syncedOn: new Date("2022-10-02T14:51:31.406Z"),
      },
      {
        id: "doc-2",
        title: "Test title 2.",
        default: "value",
        authors: ["name 1"],
        description: "description.",
        thumbnail: "thumb.png",
        tags: ["tag1"],
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
        hidden: false,
        updatedOn: new Date("2022-10-02T14:51:31.406Z"),
        syncedOn: new Date("2022-10-02T14:51:31.406Z"),
      },
    ] as DocSchema[];

    injector.inject(
      {
        docs: { find: sinon.stub(() => ({ toArray: () => docs })) },
      },
      { token: DataProvider, override: true },
    );

    const request = await superoak(app.app);
    await request
      .get("/doc")
      .expect(200)
      .expect([
        {
          id: "doc-1",
          default: "value",
          title: "Test title 1.",
          description: "description.",
          thumbnail: "thumb.png",
          authors: ["name 1"],
          tags: ["tag1"],
        },
        {
          id: "doc-2",
          default: "value",
          title: "Test title 2.",
          description: "description.",
          thumbnail: "thumb.png",
          authors: ["name 1"],
          tags: ["tag1"],
        },
      ]);
  });

  it("should return a specific documentation metadata", async () => {
    const doc = {
      id: "id",
      title: "Test title 1.",
      default: "value",
      authors: ["name 1"],
      description: "description.",
      thumbnail: "thumb.png",
      tags: ["tag1"],
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
      hidden: false,
      updatedOn: new Date("2022-10-02T14:51:31.406Z"),
      syncedOn: new Date("2022-10-02T14:51:31.406Z"),
    } as DocSchema;

    injector.inject(
      {
        docs: { findOne: sinon.stub(() => doc) },
      },
      { token: DataProvider, override: true },
    );

    const request = await superoak(app.app);
    await request
      .get("/doc/id")
      .expect(200)
      .expect({
        id: "id",
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
      });
  });

  it("should return a specific documentation section", async () => {
    const doc = {
      id: "doc",
      title: "Test title 1.",
      default: "value",
      authors: ["name 1"],
      description: "description.",
      thumbnail: "thumb.png",
      tags: ["tag1"],
      sections: {
        section: {
          title: "Test title 2.",
          subSections: {
            "sub-section": {
              title: "Test title 3.",
            },
          },
        },
      },
      hidden: false,
      updatedOn: new Date("2022-10-02T14:51:31.406Z"),
      syncedOn: new Date("2022-10-02T14:51:31.406Z"),
    } as DocSchema;

    const docSection = {
      documentationId: "doc",
      sectionId: "section",
      subSectionId: "sub-section",
      markdown: "## Heading",
    } as DocSectionSchema;

    injector.inject(
      {
        docs: { findOne: sinon.stub(() => doc) },
        docSections: { findOne: sinon.stub(() => docSection) },
      },
      { token: DataProvider, override: true },
    );

    const request = await superoak(app.app);
    await request
      .get("/doc/doc/section/sub-section")
      .expect(200)
      .expect({
        documentationTitle: "Test title 1.",
        sectionTitle: "Test title 2.",
        subSectionTitle: "Test title 3.",
        description: "description.",
        thumbnail: "thumb.png",
        authors: ["name 1"],
        tags: ["tag1"],
        contents: [{ level: 2, heading: "Heading", id: "heading" }],
        html: '<h2 id="heading">Heading</h2>',
      });
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
    } as PostSchema;

    const author = {
      id: "author-id",
      youtube: "author-youtube",
      description: "author-description",
      thumbnail: "author-thumbnail",
    } as AuthorSchema;

    injector.inject(
      {
        posts: { findOne: sinon.stub(() => post) },
        authors: { findOne: sinon.stub(() => author) },
      },
      { token: DataProvider, override: true },
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
        contents: [{ level: 2, heading: "Heading", id: "heading" }],
        html: '<h2 id="heading">Heading</h2>',
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
