const express = require("express");
const router = express.Router();
const upload = require('../uploadMiddleware');

const PostsController = require("../controllers/posts");

router.get("/", PostsController.Index);
router.post("/", PostsController.Create);
router.get("/new", PostsController.New);
router.post("/upload", upload.single('image'), PostsController.Upload);

module.exports = router;
