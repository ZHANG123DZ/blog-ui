import conversationService from "@/services/conversation/conversation.service";

const markAsReadOnServer = async (convId, messageId, readAt) => {
  if (!messageId) return;
  await conversationService.markedRead(convId, {
    messageId,
    readAt: readAt || new Date(),
  });
};

export default markAsReadOnServer;
