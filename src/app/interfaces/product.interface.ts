export interface Product {
  _id: string;
  name: string;
  category: string;
  categorySlug?: string;
  subcategory?: string;
  description: string;
  images: string[];
  material?: string;
  weight?: string;
  featured?: boolean;
  slug: string;
  tags?: string[];
  createdAt?: Date;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  image?: string;
  coverImage?: string;
  productCount?: number;
  description?: string;
}

export interface InquiryForm {
  fullName: string;
  email: string;
  phone: string;
  productInterest: string;
  customizationDetails: string;
  budget?: string;
}
