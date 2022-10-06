import { Collection, ObjectId, MongoClient } from "$mongo/mod.ts";
import {
  DB_NAME,
  DB_PASSWORD,
  DB_PATH,
  DB_SEC_MECHANISM,
  DB_USER,
} from "@/config.ts";

export interface PostSchema {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  markdown: string;
  tags: string[];
  author: string;
  date: Date;
}

export interface AuthorSchema {
  _id?: ObjectId;
  id: string;
  youtube: string;
  description: string;
  thumbnail: string;
}

export interface DocSchema {
  _id?: ObjectId;
  id: string;
  title: string;
  default: string;
  sections: Record<
    string,
    {
      title: string;
      subSections: Record<
        string,
        {
          title: string;
        }
      >;
    }
  >;
}

export interface DocSectionSchema {
  _id?: ObjectId;
  id: string;
  markdown: string;
}

export class DataProvider {
  posts!: Collection<PostSchema>;
  authors!: Collection<AuthorSchema>;
  docs!: Collection<DocSchema>;
  docSections!: Collection<DocSectionSchema>;

  async init() {
    const client = new MongoClient();
    await client.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_PATH}?authMechanism=${DB_SEC_MECHANISM}`
    );
    const db = client.database(DB_NAME);
    this.posts = db.collection<PostSchema>("posts");
    this.authors = db.collection<AuthorSchema>("authors");
    this.docs = db.collection<DocSchema>("docs");
    this.docSections = db.collection<DocSectionSchema>("doc-sections");
  }
}