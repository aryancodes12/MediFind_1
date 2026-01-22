export interface Medicine {
  id: string;
  name: string;
  brand: string;
  dosage: string;
  isPrescriptionRequired: boolean;
  price: number;
  currency: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  pharmacyName: string;
  distance: string;
  deliveryTime: string;
  category: string;
  image: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}