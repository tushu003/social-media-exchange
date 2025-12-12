export interface Service {
  id: string;
  title: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    experience: string;
    image?: string;
  };
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
}