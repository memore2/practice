import express from "express";
import {
  edit,
  githubLoginStart,
  githubLoginfinish,
  getEdit,
  postEdit,
  getEditPassword,
  postEditPassword,
} from "../controllers/userController";
import { protectMiddleware, publicmiddleware } from "../middleware";

const userRouter = express.Router();

userRouter.get("/github/start", publicmiddleware, githubLoginStart);
userRouter.get("/github/finish", publicmiddleware, githubLoginfinish);
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(postEdit);
userRouter
  .route("/edit-password")
  .all(protectMiddleware)
  .get(getEditPassword)
  .post(postEditPassword);
export default userRouter;
