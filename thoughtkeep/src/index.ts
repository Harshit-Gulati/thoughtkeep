import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { validateUserInput, userMiddleware } from "./middleware";
import bcrypt from "bcrypt";
import { random } from "./utils";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "https://thoughtkeep.vercel.app",
  })
);
app.use(express.json());

app.post(
  "/api/v1/signup",
  validateUserInput,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        res.status(403).json({
          message: "User already exists",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.create({
        username,
        password: hashedPassword,
      });

      res.status(200).json({
        message: "User signed up",
      });
    } catch (e) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

app.post(
  "/api/v1/signin",
  validateUserInput,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        //@ts-ignore
        JWT_SECRET
      );
      res.status(200).json({
        message: "LoggedIn successfully",
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrect credentials",
      });
    }
  }
);

app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { link, type, title, tags } = req.body;

    if (!title) {
      res.status(411).json({
        message: "Title is required!",
      });
      return;
    }

    try {
      await ContentModel.create({
        link,
        type,
        title,
        tags,
        userId: req.userId,
      });

      res.json({
        message: "Content added",
      });
    } catch (e) {
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }
  }
);

app.get(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { type } = req.query;
    try {
      const filter: any = { userId };
      if (type) {
        filter.type = type;
      }
      const content = await ContentModel.find(filter).populate(
        "userId",
        "username"
      );

      res.json({
        content,
      });
    } catch (e) {
      res.status(500).json({
        message: "Content not found",
      });
      return;
    }
  }
);

app.delete(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const contentId = req.contentId;
    const userId = req.userId;

    try {
      await ContentModel.deleteOne({
        contentId,
        userId,
      });

      res.status(200).json({
        message: "Deleted successfully",
      });
    } catch (e) {
      res.status(403).json({
        message: "cannot delete someone else's content",
      });
    }
  }
);

app.post(
  "/api/v1/brain/share",
  userMiddleware,
  async (req: Request, res: Response) => {
    const share = req.body.share;
    if (share) {
      try {
        const existingLink = await LinkModel.findOne({
          userId: req.userId,
        });
        if (existingLink) {
          res.json({
            hash: existingLink.hash,
          });
          return;
        }

        const hash = random(10);

        await LinkModel.create({
          userId: req.userId,
          hash,
        });

        res.status(200).json({
          hash,
          message: "Link created",
        });
      } catch (e) {
        res.status(500).json({
          message: "Couldn't create link",
        });
        return;
      }
    } else {
      try {
        await LinkModel.deleteOne({
          userId: req.userId,
        });

        res.status(200).json({
          message: "Link removed",
        });
      } catch (e) {
        res.status(500).json({
          message: "Couldn't remove link",
        });
        return;
      }
    }
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;

  try {
    const link = await LinkModel.findOne({
      hash,
    });

    if (!link) {
      res.status(411).json({
        message: "Incorrect link",
      });
      return;
    }
    const content = await ContentModel.find({
      userId: link.userId,
    });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
      res.status(411).json({
        message: "user not found, error should ideally not happen",
      });
      return;
    }

    res.status(200).json({
      username: user.username,
      content: content,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
});

app.listen(3000);
