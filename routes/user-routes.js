import express from "express";
import {
  add_user,
  did_found_stranger,
  find_another_random_user,
  remove_all_user,
  time_out_delete,
} from "../controllers/user-controllers.js";

const userRouter = express.Router();

userRouter.post("/add", add_user);
userRouter.post("/delete/:id/:bool", time_out_delete);
userRouter.post("/find/:id", find_another_random_user);

// utility
userRouter.get("/found/:id", did_found_stranger);
userRouter.delete("/delete", remove_all_user);

export default userRouter;
