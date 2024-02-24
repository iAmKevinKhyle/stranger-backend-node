import express from "express";
import {
  fetch_specific_message,
  is_there_a_new_chat,
  remove_all_chat,
  send_message,
} from "../controllers/chat-controllers.js";

const chatRouter = express.Router();

chatRouter.post("/send", send_message);
chatRouter.get("/get/:index/:id", fetch_specific_message);

// utility
chatRouter.get("/new/:id/:length", is_there_a_new_chat);
chatRouter.delete("/delete", remove_all_chat);

export default chatRouter;
