const express = require("express");
const authController = require("../controller/authController");
const auth = require("../middleWares/auth");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");

const router = express.Router();

//user
//register
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

//logout
router.post("/logout", auth, authController.logout);
//refreash
router.get("/refresh", authController.refresh);

//blog

//CRUD
//create
//read all blogs
//read blog by id
//update
//delete

//create
router.post("/blog", auth, blogController.create);

//get all
router.get("/blog/all", auth, blogController.getAll);

//get blog by id
router.get("/blog/:id", auth, blogController.getById);

//update
router.put("/blog", auth, blogController.update);

//delete
router.delete("/blog/:id", auth, blogController.delete);

//comments
//create comments
router.post("/comment", auth, commentController.create);
//read comments by id
router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
