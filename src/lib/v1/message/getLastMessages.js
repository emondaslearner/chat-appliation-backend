const Message = require('@models/Message');

const getLastMessage = async ({ userId, id }) => {
  const filter = {
    $or: [
      {
        sent_by: userId,
        sent_to: id,
      },
      {
        sent_by: id,
        sent_to: userId,
      },
    ],
  };

  const lastMessage = await Message.findOne(filter).sort({ _id: -1 });
  
  return lastMessage
};

module.exports = getLastMessage;
