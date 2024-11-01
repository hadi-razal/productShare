export interface ProductTypes {
    id: string; 
    name: string;
    description: string;
    category: string;
    images: string[];
    regularPrice: number;
    discountPrice: number;
    isNew: boolean;
    isInStock: boolean;
    rating: number;
    ratingCount: number;
  }
  
export interface user {
    id: string; 
    name: string;
    profile: string;
    email: string;
    isVisitedCount: string;
}
  