import { apiClient } from "../lib/apiConfig.ts";
import type { Category, CreateSubCategoryPayload } from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const getTopLevelCategories = () => {
  return apiClient.get<ApiResponse<{ data: Category[] }>>(
    "/categories/top-level"
  );
};

export const getSubCategories = (parentId: string) => {
  return apiClient.get<ApiResponse<{ data: Category[] }>>(
    `/categories/${parentId}/sub-categories`
  );
};
interface mainCategory {
  _id: string; // Use string on the frontend
  slug: string;
  name: string;
  type: "pre-defined";
}

export const getFilterableSubCategories = () => {
  return apiClient.get<
    ApiResponse<mainCategory[]>
  >(`/categories/filterable-subcategories`);
};
// export const getFilterableSubCategories = (
//   parentId: string,
//   threshold: number = 5
// ) => {
//   return apiClient.get<ApiResponse<{ data: Category[] }>>(
//     `/categories/${parentId}/filterable-subcategories`,
//     { params: { threshold } }
//   );
// };

export const createSubCategory = (
  parentId: string,
  data: CreateSubCategoryPayload
) => {
  return apiClient.post<ApiResponse<{ data: Category }>>(
    `/categories/${parentId}/sub-categories`,
    data
  );
};
