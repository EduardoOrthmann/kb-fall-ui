export interface Message {
  text: string | Solution;
  user: string;
  timestamp: string;
  conversationId: string;
  isJsonFile?: boolean;
}

export interface Conversation {
  _id: string;
  name: string;
  user: string;
}

export interface Solution {
  id: string;
  description: string;
  environment: string;
  api_version: string;
  file: string;
  bauheri: string;
  baumuster: string;
  nsr_extension: string;
  configuration_date: string;
  price_type: string;
  pricing_date: string;
  localized_message: string;
  is_valid: boolean;
}
