export interface SaveCollection {
    _id: string;
    name: string;
    description?: string;
    owner: string;
    blogs: string[];
    createdAt: string;
    updatedAt: string;
  }