require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require("./models/blog.js");

const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");

const { checkForAuthenticationCookie } = require("./middlewares/auth.js");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("mongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
