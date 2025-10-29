export interface CreateCommentData {
    content: string;
  }
  
  export interface PaginatedCommentData {
    docs: Comment[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  