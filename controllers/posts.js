const Post = require("../models/post");
const path = require("path");
const Resize = require("../Resize");

const PostsController = {
  Index: (req, res) => {
    Post.find((err, posts) => {
      if (err) {
        throw err;
      }

      res.render("posts/index", { posts: posts });
    });
  },
  New: (req, res) => {
    res.render("posts/new", {});
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.save((err) => {
      if (err) {
        throw err;
      }

      res.status(201).redirect("/posts");
    });
  },
  Upload: async (req, res) => {
    const imagePath = path.join(__dirname, './../public/images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({ error: 'Please provide an image' });
    }
    const fileName = await fileUpload.save(req.file.buffer);
    // return res.status(201).redirect("/posts/new");
    return res.status(201).redirect("/posts/new/?name=" + fileName);

  },
};

module.exports = PostsController;
