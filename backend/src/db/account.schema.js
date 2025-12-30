import { model, Schema } from "mongoose";

const accountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export const Account = model("Account", accountSchema);
