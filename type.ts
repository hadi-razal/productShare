export interface ProductType {
    id: string; 
    name: string;
    description: string;
    category: string;
    colors:string[];
    images: string[];
    regularPrice: number;
    discountPrice: number;
    isNew: boolean;
    isInStock: boolean;
    rating: number;
    totalReviews: number;
    ratingCount: number;
  }
  
export interface userType {
    id: string; 
    name: string;
    profile: string;
    email: string;
    isVisitedCount: string;
}
  