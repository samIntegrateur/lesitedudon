export interface ConversationFormProps {
  conversationId: string;
  startConversation: boolean;
  loading: boolean;
  error: Error;
  success: boolean;
  onSendMessage: Function;
  onSendMessageClear: Function;
}
