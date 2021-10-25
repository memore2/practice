import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";
import { localmiddleware } from "./middleware";
const app = express();
const logger = morgan("dev");

app.use(logger);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localmiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
