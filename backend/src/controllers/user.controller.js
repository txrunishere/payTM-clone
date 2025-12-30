import asyncHandler from "express-async-handler";
import { User } from "../db/user.schema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Account } from "../db/account.schema.js";

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

const updateUserDetails = z.object({
  firstName: z
    .string()
    .max(50, "First name must be at most 50 characters long")
    .optional(),
  lastName: z
    .string()
    .max(50, "Last name must be at most 50 characters long")
    .optional(),
});

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

  const balance = (1 + Math.random() * 10000).toFixed(2);

  const account = new Account({
    user: userId,
    balance: balance * 100,
  });

  await account.save();

  const token = jwt.sign(
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

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  });
});

const handleUpdateUserDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  const { success, error } = updateUserDetails.safeParse({
    firstName,
    lastName,
  });

  if (!success) {
    return res.status(400).json({
      message: error.flatten().fieldErrors,
    });
  }

  const user = await User.findById(req.user.sub);

  if (!user) {
    return res.json(404).json({
      message: "User not found",
    });
  }

  const updatedUser = await User.updateOne(
    { _id: user._id },
    { firstName, lastName }
  );

  if (updatedUser) {
    return res.status(204).json({
      message: "User updated successfully",
    });
  } else {
    return res.status(500).json({
      message: "Something went wrong, can't update user",
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  return res.status(200).json({
    users: users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    })),
  });
});

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUpdateUserDetails,
  getUsers,
  getUser,
};
