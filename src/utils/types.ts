export interface Message {
  text: string | Solution;
  user: string;
  timestamp: string;
  conversationId: string;
  isJsonFile?: boolean;
  fileName?: string;
}

export interface Conversation {
  _id: string;
  name: string;
  user: string;
}

export interface Solution {
  ambiente: string;
  apiVersion: string;
  arquivo: string;
  bauherei: string;
  baumuster: string;
  configurationDate: number;
  isValid: string;
  localizedMessage: string;
  nsrExtension: string;
  organizationId: string;
  priceType: string;
  pricingDate: number;
  productStructureId: string;
  saleSystem: string;
  sugestao_rpa: string;
}

export interface FileData {
  fileName: string;
  fileData: string;
}
