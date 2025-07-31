export interface WebsitePost {
  title: string;
  description: string;
  image: string;
  cta: string;
  link: string;
}

export interface ProductCategory {
  image: string;
  title: string;
}

export interface Product {
  image: string;
  title: string;
  price: string;
}

export interface WebsiteData {
  quote: string;
  font: string;
  theme: string;
  hero_title: string;
  hero_subtitle: string;
  logo: string;
  announcement: string;
  announcement_bg: string;
  hero_image_1: string;
  hero_image_2: string;
  post: WebsitePost[];
  product_categories: ProductCategory[];
  new_products: Product[];
  about: string;
  footer_links: string[];
  social_links: string[];
} 