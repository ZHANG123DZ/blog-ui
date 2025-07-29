import conversationService from "@/services/conversation/conversation.service";

const markAsReadOnServer = async (convId, msgs) => {
  if (!msgs?.length) return;
  const lastMessage = msgs[msgs.length - 1];
  await conversationService.markedRead(convId, {
    messageId: lastMessage.id,
    readAt: new Date(),
  });
};

export default markAsReadOnServer;
