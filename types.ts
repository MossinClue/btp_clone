export interface ContactRow {
  name: string;
  phone: string;
  [key: string]: string; // Allow dynamic fields from CSV
}

export interface GeneratedMessage {
  id: number;
  text: string;
  phoneNumbers: string[];
  status: 'pending' | 'sent' | 'failed';
  statusDetails: string;
  statusUpdatedTimestamp: number;
}

export interface AutoTexterJson {
  formatVersion: number;
  creationDate: string;
  sendInterval: number;
  messages: Record<string, GeneratedMessage>;
}

export enum Platform {
  IMESSAGE = 'iMessage',
  WHATSAPP = 'WhatsApp',
  SMS = 'SMS'
}

export enum MultiNumberStrategy {
  INDIVIDUAL = 'Send Individual Texts',
  GROUP = 'Create Group Chat',
  FIRST = 'Use First Number Only'
}