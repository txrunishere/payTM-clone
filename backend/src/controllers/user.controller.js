import asyncHandler from "express-async-handler";
import { User } from "../db/user.schema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";

const signupValidationSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required",
      })
      .email()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long"),
    password: z
      .string({
        invalid_type_error: "Password must be a string",
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
    firstName: z
      .string({
        invalid_type_error: "First name must be a string",
        required_error: "First name is required",
      })
      .max(50, "First name must be at most 50 characters long"),
    lastName: z
      .string({
        invalid_type_error: "Last name must be a string",
        required_error: "Last name is required",
      })
      .max(50, "Last name must be at most 50 characters long"),
  })
  .required();

const signinValidationSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required",
      })
      .email()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long"),
    password: z
      .string({
        invalid_type_error: "Password must be a string",
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
  })
  .required();

const handleUserSignUp = asyncHandler(async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const { success, error } = signupValidationSchema.safeParse({
    username,
    password,
    firstName,
    lastName,
  });

  if (!success) {
    return res.status(400).json({
      message: error.flatten().fieldErrors,
    });
  }

  const isUserExists = await User.findOne({ username }).select("_id");

  if (isUserExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userObj = new User({
    username,
    password: hashedPassword,
    lastName,
    firstName,
  });

  const user = await userObj.save();

  const { password: pass, resUser } = user;
  const userId = user._id;

  const token = await jwt.sign(
    { sub: userId, username: user.username },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return res.status(201).json({
    jwt: token,
    user: resUser,
    message: "User created successfully",
  });
});

const handleUserSignIn = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const { success, error } = signinValidationSchema.safeParse({
    username,
    password,
  });

  if (!success) {
    return res.status(400).json({
      message: error.flatten().fieldErrors,
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  if (user) {
    const token = await jwt.sign(
      { sub: user._id, username: user.username },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    return res.status(200).json({
      jwt: token,
      message: "User login successfully",
    });
  }

  return res.status(400).json({
    message: "Error while logged in",
  });
});

export { handleUserSignUp, handleUserSignIn };
