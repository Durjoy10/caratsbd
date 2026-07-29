export interface Product {
  _id: string;
  catalogNumber?: string;
  catalogPage?: number;
  bagNo?: string;
  styleCode?: string;
  name: string;
  title?: string;
  category: string;
  categoryName?: string;
  categorySlug?: string;
  subcategory?: string;
  description: string;
  images: string[];
  baseMetal?: string;
  material?: string;
  grossWeight?: number;
  diamondWeight?: number;
  weight?: string;
  price?: number;
  stockQuantity?: number;
  isActive?: boolean;
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
  order?: number;
}

export interface InquiryForm {
  fullName: string;
  email: string;
  phone: string;
  productInterest: string;
  customizationDetails: string;
  budget?: string;
}
