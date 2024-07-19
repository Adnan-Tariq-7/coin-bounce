const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTServices = require("../services/JWTServices");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    //1.valid user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    //2.if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    //3. if email or username is already register ->return an error
    //check if email is not already registerd
    const { username, name, email, password } = req.body;
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already register, use another email!",
        };
        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose  another username!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    //123abc ->dfki4ur9wskfu239rfjskdfu2ru9
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db

    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });
      user = await userToRegister.save();

      //token generate
      accessToken = JWTServices.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JWTServices.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    //store refresh token in db
    await JWTServices.storeRefreshToken(refreshToken, user._id);

    //store tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    // 6. response send
    const userDTO = new UserDTO(user);
    return res.status(201).json({ user: userDTO, auth: true });
  },

  async login(req, res, next) {
    // 1.validate user input
    // 2.if validation error, return error
    // 3.match username and password
    // 4.return response

    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });
    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    //const username=req.body.username
    //const password=req.body.password
    let user;
    try {
      //match username
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };
        return next(error);
      }

      //match password
      //req.body.password -> hash -> match
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //token generate
    const accessToken = JWTServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTServices.signRefreshToken({ _id: user._id }, "60m");

    try {
      await RefreshToken.updateOne(
        { _id: user._id },
        { token: refreshToken },
        { upsert: true }
      );
      // Upsert: Combination of "update" and "insert".
      //{ upsert: true }:
      //Update the document if it exists.
      //Insert a new document if no matching document is found
    } catch (err) {
      return next(err);
    }

    //store tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const userDTO = new UserDTO(user);

    return res.status(200).json({ user: userDTO, auth: true });
  },

  async logout(req, res, next) {
    console.log(req);
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    //delete Cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },

  async refresh(req, res, next) {
    // 1.get refreshToken from cookies
    // 2.verify refreshToken
    // 3.generate new tokens
    // 4.update db, return response

    const originalRefreshToken = req.cookies.refreshToken;
    let id;
    try {
      id = JWTServices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unathorized",
      };
      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JWTServices.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTServices.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });
    const userDTO = new UserDTO(user);
    return res.status(200).json({ user: userDTO, auth: true });
  },
};

module.exports = authController;
