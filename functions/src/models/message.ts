import { DatabaseService } from '@src/services';
import type { DocumentReference } from '@src/types';

export interface Message {
  user: DocumentReference;
  content: string;
}

export const MessageModel = new DatabaseService<Message>('messages');
