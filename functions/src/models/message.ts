import { DatabaseService } from '@src/services';
import type { DocumentReference } from '@src/types';

export interface Message {
  user: DocumentReference;
  content: string;
}

export class MessageSchema extends DatabaseService<Message> {}

export const MessageModel = new MessageSchema('messages');
