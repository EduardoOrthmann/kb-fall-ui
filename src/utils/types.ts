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
  // there is no id
  ambiente: string; // environment
  apiVersion: string; // api_version
  arquivo: string; // file
  bauherei: string; // bauheri
  baumuster: string;
  configurationDate: number; // configuration_date
  isValid: string; // is_valid
  localizedMessage: string; // localized_message
  nsrExtension: string; // nsr_extension
  organizationId: string;
  priceType: string; // price_type
  pricingDate: number; // pricing_date
  productStructureId: string;
  saleSystem: string;
  sugestao_rpa: string; // description
}
