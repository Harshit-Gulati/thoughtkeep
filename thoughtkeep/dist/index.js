"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const middleware_1 = require("./middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    credentials: true,
    origin: "https://thoughtkeep.vercel.app",
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.post("/api/v1/signup", middleware_1.validateUserInput, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(403).json({
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.UserModel.create({
            username,
            password: hashedPassword,
        });
        res.status(200).json({
            message: "User signed up",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
app.post("/api/v1/signin", middleware_1.validateUserInput, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({
        username,
    });
    if (existingUser) {
        const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id,
            }, 
            //@ts-ignore
            JWT_SECRET);
            res.status(200).json({
                message: "LoggedIn successfully",
                token,
            });
        }
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, tags } = req.body;
    if (!title) {
        res.status(411).json({
            message: "Title is required!",
        });
        return;
    }
    try {
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            tags,
            userId: req.userId,
        });
        res.json({
            message: "Content added",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error",
        });
        return;
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { type } = req.query;
    try {
        const filter = { userId };
        if (type) {
            filter.type = type;
        }
        const content = yield db_1.ContentModel.find(filter).populate("userId", "_id");
        res.json({
            content,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Content not found",
        });
        return;
    }
}));
app.delete("/api/v1/content/:id", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const userId = req.userId;
    try {
        if (!contentId) {
            throw new Error("content not found!");
        }
        const response = yield db_1.ContentModel.deleteOne({
            _id: contentId,
            // userId: { _id: userId },
        });
        res.status(200).json({
            response,
            message: "Deleted successfully",
        });
    }
    catch (e) {
        res.status(403).json({
            message: "cannot delete someone else's content",
        });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        try {
            const existingLink = yield db_1.LinkModel.findOne({
                userId: req.userId,
            });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash,
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({
                userId: req.userId,
                hash,
            });
            res.status(200).json({
                hash,
                message: "Link created",
            });
        }
        catch (e) {
            res.status(500).json({
                message: "Couldn't create link",
            });
            return;
        }
    }
    else {
        try {
            yield db_1.LinkModel.deleteOne({
                userId: req.userId,
            });
            res.status(200).json({
                message: "Link removed",
            });
        }
        catch (e) {
            res.status(500).json({
                message: "Couldn't remove link",
            });
            return;
        }
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    try {
        const link = yield db_1.LinkModel.findOne({
            hash,
        });
        if (!link) {
            res.status(411).json({
                message: "Incorrect link",
            });
            return;
        }
        const content = yield db_1.ContentModel.find({
            userId: link.userId,
        });
        const user = yield db_1.UserModel.findOne({ _id: link.userId });
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
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
        return;
    }
}));
app.listen(3000);
