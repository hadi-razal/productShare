export interface ProductType {
    id: string; 
    name: string;
    description: string;
    category: string;
    colors:string[];
    sizes:string[];
    images: string[];
    regularPrice: number;
    discountPrice: number;
    isNew: boolean;
    isInStock: boolean;
    isBestSelling?: boolean;
    rating: number;
    totalReviews?: number;
    ratingCount: number;
    availableStock?: number;
    isMostSelling?:boolean;
  }
  
export interface userType {
    id?: string; 
    uid?: string; 
    name: string;
    profile: string;
    email: string;
    isVisitedCount: string;
}
  