import { createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "@/services/message/message.service";

export const getMessagesByConversationId = createAsyncThunk(
  "messages/getMessagesByConversationId",
  async (payload) => {
    const res = await messageService.getMessagesByConversationId(payload);
    return res.data;
  }
);
