import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import chatRouter from "./routes/chat-routes.js";

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// @route /
app.get("/", (req, res, next) => {
  res.json({ message: "Strangers Node Backend API" });
});

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Listening on Port: " + port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
