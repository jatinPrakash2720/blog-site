import React, { createContext, useCallback, useContext, useState } from "react";
import * as categoryService from "../services/categories.service.ts";
import * as apiInterfaces from "../types/api.ts";
import * as contextInterfaces from "../types/context.ts";
import { requestHandler } from "../lib";

const CategoryContext = createContext<contextInterfaces.ICategoryContext | undefined>(undefined);

interface mainCategory {
  _id: string; // Use string on the frontend
  slug: string;
  name: string;
  type: "pre-defined";
}
export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategories must be used within a CategoryProvider.");
    }
    return context;
};

export const CategoryProvider: React.FC<contextInterfaces.CategoryProviderProps> = ({ children }) => {
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);

      const [topLevelCategories, setTopLevelCategories] = useState<apiInterfaces.Category[]>([]);
      const [subCategories, setSubCategories] = useState<apiInterfaces.Category[]>([]);
      const [filterableSubCategories, setFilterableSubCategories] = useState<mainCategory[]>([]);

    const fetchTopLevelCategories = useCallback(async () => {
        await requestHandler(
            () => categoryService.getTopLevelCategories(),
            setLoading,
            (response) => {
                setTopLevelCategories(response.data.data);
            },
            setError
        );
    }, []);

    const fetchSubCategories = useCallback(async (parentId: string) => {
        await requestHandler(
            () => categoryService.getSubCategories(parentId),
            setLoading,
            (response) => {
                setSubCategories(response.data.data);
            },
            setError
        );

    }, []);

    const fetchFilterableSubCategories = useCallback(async () => {
        await requestHandler(
            () => categoryService.getFilterableSubCategories(),
            setLoading,
            (response) => {
                setFilterableSubCategories(response.data);
            },
            setError
        );
    }, []);
    // const fetchFilterableSubCategories = useCallback(async (parentId: string, threshold: number = 5) => {
    //     await requestHandler(
    //         () => categoryService.getFilterableSubCategories(parentId, threshold),
    //         setLoading,
    //         (response) => {
    //             setFilterableSubCategories(response.data.data);
    //         },
    //         setError
    //     );
    // }, []);

    const createSubCategory = useCallback(async (parentId: string, data: apiInterfaces.CreateSubCategoryPayload) => {
        
        let success = false;
        await requestHandler(
            () => categoryService.createSubCategory(parentId, data),
            setLoading,
            (response) => {
                setSubCategories((prev) => [...prev, response.data.data]);
                success = true;
            },
            setError
        );
        return success;
    }, []);

    const contextValue: contextInterfaces.ICategoryContext = {
        topLevelCategories,
        subCategories,
        filterableSubCategories,
        loading,
        error,
        fetchTopLevelCategories,
        fetchSubCategories,
        fetchFilterableSubCategories,
        createSubCategory
    };

    return (
        <CategoryContext.Provider value={contextValue}>{children }</CategoryContext.Provider>
    )
}