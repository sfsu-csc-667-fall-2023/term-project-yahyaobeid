const path = require("path");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();
console.log(process.env.DATABASE_URL);

const express = require("express");
const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const testRoutes = require("./routes/test/index.js")
app.use("/test", testRoutes);

const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const rootRoutes = require("./routes/root");
const requestTimeMiddleware = require("./middleware/request-times");
const { connect } = require("http2");

app.use(requestTimeMiddleware);

if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLiveReload());
}

app.use(express.static(path.join(__dirname, "static")));

app.use("/", rootRoutes);

app.use((_req, _res, next) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
