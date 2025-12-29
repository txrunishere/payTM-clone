import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongodbConnectionInstence = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: "paytmClone",
      }
    );

    console.log(
      "MongoDB connection successfully!!",
      mongodbConnectionInstence.connection.host,
      mongodbConnectionInstence.connection.name
    );
  } catch (error) {
    console.log("DB Connection failed!!");
    process.exit(1);
  }
};
