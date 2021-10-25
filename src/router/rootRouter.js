import express from "express";
import {
  home,
  getUpload,
  postUpload,
  search,
} from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { protectMiddleware, publicmiddleware } from "../middleware";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUpload)
  .post(postUpload);
rootRouter.get("/search", search);
rootRouter.route("/join").all(publicmiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicmiddleware).get(getLogin).post(postLogin);
rootRouter.get("/logout", protectMiddleware, logout);
export default rootRouter;
