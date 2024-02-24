import User from "../Models/User.js";
import Chat from "../models/Chat.js";

let cancel;
let time_interval;
let count = 10;

// add user
export const add_user = async (req, res, next) => {
  const { name, age } = req.body;
  try {
    const users = await User.find();

    const index = users.length > 0 ? users[users.length - 1].index++ : 1;

    // create new user
    const user = new User({
      index: index,
      name,
      age,
      partner: [],
      chat: [],
    });

    // find user that dont have a partner yet
    const user_partner = await User.findOne({ partner: [] });

    // save the user to the random user as partner
    if (user_partner) {
      // create new chat
      const new_chat = new Chat({
        owners: [],
        messages: [],
      });

      //   push id to each other
      user.partner.push(user_partner);
      user_partner.partner.push(user);

      //   push chat owners
      new_chat.owners.push(user, user_partner);

      //   push chat_id to user and partner
      user.chat.push(new_chat);
      user_partner.chat.push(new_chat);

      // save
      await new_chat.save();
      await user.save();
      await user_partner.save();

      return res
        .status(201)
        .json({ user, message: "You have been paired with an Stranger." });
    }

    // if there is no user available to be paired
    // save user
    await user.save();

    return res.status(201).json({
      user,
      message: "There are no user to pair, Maybe you can try again Later.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// remove user
const remove_user = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);

    if (user.partner.length > 0) {
      // find user partner
      const partner = await User.findById(user.partner[0]._id);

      //   remove user id
      partner.partner.pull(user);

      //   find chat_id and remove
      await Chat.findByIdAndDelete(partner.chat[0]._id);

      //   empty partner chat id
      partner.chat = [];

      //   save
      await partner.save();
    }
  } catch (error) {
    console.log(error.message);
  }
};

// remove user
export const time_out_delete = async (req, res, next) => {
  const { id, bool } = req.params;
  cancel = JSON.parse(bool);

  if (!cancel) {
    time_interval = setInterval(() => {
      console.log(count);
      count--;

      if (count === 0) {
        console.log("Countdown Ended... \nDeleting...");
        clearInterval(time_interval);
        remove_user(id);
        console.log("Deleted");
      }

      // sometimes countdown doesn't stop
      // so i put for added insurance
      if (count < 0) {
        clearInterval(time_interval);
      }
    }, 1000);
  } else {
    if (time_interval) {
      clearInterval(time_interval);
    }
    count = 10;
    console.log("cancelled");
  }
};

// find another random user
export const find_another_random_user = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    // find new partner
    const newPartner = await User.findOne({ partner: [] });

    if (user.partner.length !== 0) {
      // find user current_partner
      const currentPartner = await User.findById(user.partner[0]._id);

      //   remove user_id from current partner
      currentPartner.partner.pull(user);

      //   find chat id and delete
      await Chat.findByIdAndDelete(currentPartner.chat[0]._id);

      //   empty chat array
      currentPartner.chat = [];

      //   save
      await currentPartner.save();
    }

    // empty partner and chat array
    user.partner = [];
    user.chat = [];

    if (!newPartner || newPartner._id.toString() === user._id.toString()) {
      await user.save();
      return res
        .status(404)
        .json({ message: "All Active Strangers are Busy.", ok: false });
    }

    // create new chat
    const new_chat = new Chat({
      owners: [],
      messages: [],
    });

    // push new chat owners
    new_chat.owners.push(user, newPartner);

    // push new partner and chat_id
    user.partner.push(newPartner);
    newPartner.partner.push(user);
    user.chat.push(new_chat);
    newPartner.chat.push(new_chat);

    // save
    await new_chat.save();
    await user.save();
    await newPartner.save();

    return res.status(201).json({ message: "New Stranger Found...", ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// did user found a stranger to chat
export const did_found_stranger = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (user.partner.length > 0) {
      return res.status(200).json({ found: true, user });
    }
    return res.status(200).json({ found: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// remove all user
export const remove_all_user = async (req, res, next) => {
  try {
    const users = await User.find();

    users.forEach(async (user) => {
      await User.findByIdAndDelete(user._id);
    });

    return res
      .status(201)
      .json({ message: "All User has Deleted Successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
