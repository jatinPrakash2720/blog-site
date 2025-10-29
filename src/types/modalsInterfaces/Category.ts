export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    parent: string | null;
    blogCount: number;
  }
  