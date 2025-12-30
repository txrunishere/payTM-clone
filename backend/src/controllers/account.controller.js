import asyncHandler from "express-async-handler";
import { Account } from "../db/account.schema.js";
import mongoose from "mongoose";

const getBalance = asyncHandler(async (req, res) => {
  const user = req.user.sub;

  const account = await Account.findOne({
    user,
  });

  const balance = account.balance / 100;

  return res.status(200).json({
    balance,
  });
});

const transferBalance = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  const { to, amount } = req.body;

  let toId;

  try {
    toId = new mongoose.Types.ObjectId(to);
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  if (req.user.sub === to) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Something went wrong!",
    });
  }

  const user = await Account.findOne({
    user: req.user.sub,
  }).session(session);

  const refineAmount = parseFloat(amount) * 100;

  if (user.balance < refineAmount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({
    user: toId,
  }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(404).json({
      message: "Account not found",
    });
  }

  await Account.findByIdAndUpdate(user._id, {
    $inc: { balance: -refineAmount },
  }).session(session);

  await Account.findByIdAndUpdate(toAccount._id, {
    $inc: {
      balance: refineAmount,
    },
  }).session(session);

  await session.commitTransaction();

  return res.json({
    message: "Transfer successfully",
  });
});

export { getBalance, transferBalance };
