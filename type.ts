export interface ProductType {
    id?: string; 
    createdAt?: number | string | { toMillis: () => number } | null;
    name: string;
    video?: string;
    description: string;
    category: string;
    colors:string[];
    sizes:string[];
    images: string[];
    regularPrice: string | number;
    discountPrice: string | number;
    isNew?: boolean;
    isInStock?: boolean;
    isBestSelling?: boolean;
    views?: number;
    rating?: number;
    totalReviews?: number;
    ratingCount?: number;
    availableStock?: string;
    tags?: string;
    isHidden?: boolean;
    isFeatured?:boolean;
    isMostSelling?:boolean;
    isFreeDelivery?:boolean;
  }
  
  export interface userType {
    id?: string;
    uid?: string;
    name: string;
    logoImage?: string;
    image?: string;
    email: string;
    whatsappNumber?: string;
    showWhatsappButton?: boolean;
    allowProductEnquiries?: boolean;
    currency?: string;
    storeHeader?: import("@/lib/store-header").StoreHeader;
    description?: string;
    additionalNotes: string;
    username: string;
    onboardingCompleted?: boolean | null;
    isVisitedCount?: string;
    themeColor:string
    storeTheme?: string;
    storeFont?: string;
    isOffline?: boolean;
    productCategories?: string[];
  }

