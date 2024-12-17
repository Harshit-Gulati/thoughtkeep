import mongoose, { model, Schema } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const MONOGDB_URL = process.env.MONOGDB_URL;
if (MONOGDB_URL) {
  mongoose.connect(MONOGDB_URL);
} else {
  console.error("could not connect to db.");
}

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  link: { type: String },
  type: { type: String },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const LinkModel = model("Link", LinkSchema);

const TagSchema = new Schema({
  name: { type: String, unique: true, required: true },
});

export const TagModel = model("Tag", TagSchema);
