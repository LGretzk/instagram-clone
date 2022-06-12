const Post = require("../models/post");
const Format = require("../Format");
const receiveImage = require('../uploadMiddleware');
const {uploadImage} = require('../utilities/cloudinaryUtil');

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
  Upload: (req, res) => {
    receiveImage(req, res, async (err) => {
      // handling errors from multer
      if (err) {
        return res.status(401).json({ error: err.message });
      }

      try {
        // format the image with sharp (i.e. Format class)
        const file = new Format();
        const fileToUpload = await file.format(req.file.buffer);

        if(!fileToUpload) {
          return res.status(401).json({ error: 'Image could not be formatted'});
        }
        // upload to cloudinary
        const imageStream = fileToUpload.formattedFile;
        const imageName = fileToUpload.fileName;

        const uploadResult = await uploadImage(imageStream, imageName); 
        const uploadUrl = uploadResult.url;

        // save in the posts table
        const post = new Post({message: req.body.message, picture_url: uploadUrl});
        await post.save((err) => {
          if (err) {
            throw err;
          }
          return res.status(201).redirect("/posts");
        }); 
      } catch (error) {
        return res.json({error: 'Failed to upload'})
      }
    });
  },
};

module.exports = PostsController;
