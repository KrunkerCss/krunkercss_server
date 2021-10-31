const NotificationModel = require("../db/models/notification");

const push_n = async (
  payload = { from: "", for: "", read: false, title: "", reason: "" }
) => {
  const notification = new NotificationModel(payload);
  await notification.save();
};

const read_n = async (id, read) => {
  await NotificationModel.findByIdAndUpdate(id, { read });
};

const remove_n = async (id, user) => {
  await NotificationModel.findOneAndDelete({ _id: id, for: user });
};

module.exports = {
  push_n,
  read_n,
  remove_n,
};
