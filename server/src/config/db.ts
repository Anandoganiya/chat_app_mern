import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then((res) => {
      console.log(`mongodb connected ${res.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB;
