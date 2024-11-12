export interface ProductType {
    id: string; 
    createdAt?:any;
    name: string;
    description: string;
    category: string;
    colors:string[];
    sizes:string[];
    images: string[];
    regularPrice: number;
    discountPrice: number;
    isNew?: boolean;
    isInStock?: boolean;
    isBestSelling?: boolean;
    views?: string;
    rating?: number;
    totalReviews?: number;
    ratingCount?: number;
    availableStock?: string;
    tags?: string;
    isHidden?: boolean;
    isFeatured:boolean;
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
  