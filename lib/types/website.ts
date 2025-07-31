// Navigation Section Types
export interface NavigationData {
  announcement: string;
  logo: string;
  navigation_items: NavigationItem[];
}

export interface NavigationItem {
  label: string;
  slug: string;
}

// Hero Section Types
export interface HeroData {
  hero_image_1: string;
  hero_image_2: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
}

// Intro Section Types
export interface IntroData {
  include_intro: boolean;
  intro_text: string;
}

// Blog Posts Section Types
export interface BlogPostsData {
  include_blog: boolean;
  blog_posts: BlogPost[];
}

export interface BlogPost {
  title: string;
  image: string;
  body: string;
  slug: string;
}

// Email List Section Types
export interface EmailListData {
  include_email_list: boolean;
  email_list_title: string;
  email_list_cta: string;
}

// Footer Section Types
export interface FooterData {
  footer_items: FooterItem[];
}

export interface FooterItem {
  label: string;
  slug: string;
}

// Social Links Section Types
export interface SocialLinksData {
  social_links: string[];
}

// Main Website Data Type
export interface WebsiteData {
  // Theme
  theme: string;
  
  // Navigation
  announcement: string;
  logo: string;
  navigation_items: NavigationItem[];
  
  // Hero
  hero_image_1: string;
  hero_image_2: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  
  // Intro
  include_intro: boolean;
  intro_text: string;
  
  // Blog Posts
  include_blog: boolean;
  blog_posts: BlogPost[];
  
  // Email List
  include_email_list: boolean;
  email_list_title: string;
  email_list_cta: string;
  
  // Footer
  social_links: string[];
  footer_items: FooterItem[];
}

// Legacy types for backward compatibility
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