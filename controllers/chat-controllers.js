import Chat from "../models/Chat.js";

// send message
export const send_message = async (req, res, next) => {
  const { chat_id, user_id, user_message } = req.body;
  try {
    const chat = await Chat.findById(chat_id);

    chat.messages.push({
      user_id,
      user_message,
    });

    await chat.save();
    return res.status(200).json({ message: "Message Sent!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// remove all existing chat
export const is_there_a_new_chat = async (req, res, next) => {
  const { id, length } = req.params;
  try {
    const chat = await Chat.findById(id);

    if (chat.messages.length > length) {
      return res.status(200).json({ new: true, count: chat.messages.length });
    }
    return res.status(200).json({ new: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// remove all existing chat
export const remove_all_chat = async (req, res, next) => {
  try {
    const chats = await Chat.find();

    chats.forEach(async (chat) => {
      await Chat.findByIdAndDelete(chat._id);
    });

    return res.status(200).json({ message: "All Chat has been Deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// fetch specific message content
export const fetch_specific_message = async (req, res, next) => {
  const { index, id } = req.params;
  try {
    const message = await Chat.findById(id);

    return res.status(200).json({ message: message.messages[index] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
