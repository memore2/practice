import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoController";
import { protectMiddleware } from "../middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-z]{24})", watch);
videoRouter
  .route("/:id([0-9a-z]{24})/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-z]{24})/delete", protectMiddleware, deleteVideo);
export default videoRouter;
