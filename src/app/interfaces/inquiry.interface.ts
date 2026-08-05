export interface CustomizationInquiry {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  budget?: string;
  referenceImages?: string[];
  eventId?: string;
}
