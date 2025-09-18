import { apiClient } from "../lib/apiConfig.ts";
import type * as apiInterfaces from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const createSaveCollection = (data: apiInterfaces.CreateSaveCollectionPayload) => {
    return apiClient.post<ApiResponse<apiInterfaces.SaveCollection>>("/saves", data);
}

export const getUserCollections = () => {
    return apiClient.get<ApiResponse<apiInterfaces.SaveCollection[] >>("/saves");
}

export const getBlogsInCollection = (collectionId: string) => {
    return apiClient.get<ApiResponse<{ data: apiInterfaces.PaginatedBlogResponse }>>(`/saves/${collectionId}`);
}

export const updateSaveCollection = (collectionId: string, data: apiInterfaces.UpdateSaveCollectionPayload) => {
    return apiClient.patch<ApiResponse<apiInterfaces.SaveCollection>>(`/saves/${collectionId}`,data)
}

export const deleteSaveCollection = (collectionId: string) => {
    return apiClient.delete(`/saves/${collectionId}`);
}

export const toggleBlogInCollection = (collectionId: string, blogId: string) => {
    return apiClient.patch<ApiResponse<apiInterfaces.ToggleBlogInCollectionResponse>>(`/saves/toggle/${collectionId}/${blogId}`)
}