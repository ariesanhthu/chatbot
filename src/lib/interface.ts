
// export interface Message {
//     id: string;
//     content: string;
//     role: "user" | "assistant";
//     timestamp: Date;
//   }
// Enum for message types
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
}

// Enum for message roles
export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface Message {
  // id: string | null;                // Unique identifier for the message (from the DB)
  conversationId: string;    // Identifier for the conversation this message belongs to
  senderId: string | null;          // Identifier for the sender (could be a user's UUID)
  content: string;           // The text (or other content) of the message
  messageType: MessageType; // Type of the message; the DB has an enum type "message_type_enum"
  timestamp: Date;           // The creation time of the message (mapped from the DB's created_at column)
  role: MessageRole; // Derived value: determines whether the message was sent by the user or the chatbot/assistant
}
  
export interface MessageProps extends Message {
  id: string;                // Unique identifier for the message (from the DB)
}