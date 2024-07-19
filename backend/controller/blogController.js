const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const {
  BACKEND_SERVER_PATH,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
} = require("../config/index");
const BlogDTO = require("../dto/blog");
const BlogDetailsDTO = require("../dto/blog-detials");
const Comment = require("../models/comment");
// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

var mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    // 1.validate req body
    // 2.handle photo storage ,naming
    // 3.add to db
    // 4.return response

    //photo -> client side -> base64 encoded string -> decode -> store -> save photo's path in db

    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    //read as buffer
    // const buffer = Buffer.from(
    //   photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
    //   "base64"
    // );

    //allot a random name
    // const imagePath = `${Date.now()}-${author}.png`;

    //save locally
    // try {
    //   fs.writeFileSync(`storage/${imagePath}`, buffer);
    // } catch (e) {
    //   return next(e);
    // }

    //save to cloudinary
    let response;
    try {
      response = await cloudinary.uploader.upload(photo);
    } catch (e) {
      return next(e);
    }

    //save blog in db
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        // photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        photoPath: response.url,
        publicId: response.public_id,
      });
      await newBlog.save();
    } catch (e) {
      return next(e);
    }
    const blogDTO = new BlogDTO(newBlog);
    return res.status(201).json({ blogDTO });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});
      const blogsDTO = [];

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDTO.push(dto);
      }

      return res.status(200).json({ blogs: blogsDTO });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    //validate id
    //response

    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (e) {
      return next(e);
    }

    const blogDTO = new BlogDetailsDTO(blog);

    return res.status(200).json({ blog: blogDTO });
  },
  async update(req, res, next) {
    const updateBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      blogId: Joi.string().regex(mongodbIdPattern).required(),
      photo: Joi.string(),
      publicId: Joi.string(),
    });

    const { error } = updateBlogSchema.validate(req.body);
    const { title, content, author, blogId, photo } = req.body;
    //delete previous photo
    //save new photo

    let blog;
    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (e) {
      return next(e);
    }

    if (photo) {
      // let previousPhoto = blog.photoPath;
      // previousPhoto = previousPhoto.split("/").at(-1);

      //delete photo
      // fs.unlinkSync(`storage/${previousPhoto}`);

      // Delete the old photo from Cloudinary
      try {
        await cloudinary.uploader.destroy(blog.publicId);
      } catch (e) {
        return next(e);
      }

      //read as buffer
      // const buffer = Buffer.from(
      //   photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      //   "base64"
      // );

      //allot a random name
      // const imagePath = `${Date.now()}-${author}.png`;

      //save locally
      // try {
      //   fs.writeFileSync(`storage/${imagePath}`, buffer);
      // } catch (e) {
      //   return next(e);
      // }

      //save in cloudinary
      let response;
      try {
        response = await cloudinary.uploader.upload(photo);
      } catch (e) {
        return next(e);
      }

      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          // photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
          photoPath: response.url,
          publicId: response.public_id,
        }
      );
    } else {
      await Blog.updateOne({ _id: blogId }, { title, content });
    }

    return res.status(200).json({ message: "blog updated!" });
  },
  async delete(req, res, next) {
    //validate id
    //delete blog
    //delete comments on this blog

    const deleteBlogSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = deleteBlogSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;

    let blog;
    try {
      blog = await Blog.findOne({ _id: id });
    } catch (e) {
      return next(e);
    }

    // Delete the photo from Cloudinary
    try {
      await cloudinary.uploader.destroy(blog.publicId);
    } catch (e) {
      return next(e);
    } 

    //delete blogs
    //delete comments

    try {
      await Blog.deleteOne({ _id: id });

      await Comment.deleteMany({ blog: id });
    } catch (e) {
      return next(e);
    }
    return res.status(200).json({ message: "blog deleted" });
  },
};

module.exports = blogController;
