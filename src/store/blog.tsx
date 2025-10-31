import * as blogService from "../services/blog.service.ts";
import * as userService from "../services/user.service.ts";
import * as contextInterfaces from "../types/context.ts";
import * as apiInterfaces from "../types/apisInterfaces/api.ts";
import type { Blog } from "../types/apisInterfaces/api.ts";
import React, { createContext, useCallback, useContext, useState } from "react";
import { requestHandler } from "../lib/requestHandler.ts";
import { useAuth } from "./auth.tsx";

const BlogContext = createContext<contextInterfaces.IBlogContext | undefined>(
  undefined
);

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider.");
  }
  return context;
};

export const BlogProvider: React.FC<contextInterfaces.BlogProviderProps> = ({
  children,
}) => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [readHistory, setReadHistory] = useState<Blog[]>([]);
  const [feedBlogs, setFeedBlogs] = useState<Blog[]>([]);
  const [feedPagination, setFeedPagination] =
    useState<apiInterfaces.PaginatedBlogResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSingleBlog, setLoadingSingleBlog] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] =
    useState<apiInterfaces.PaginatedBlogResponse | null>(null);
  const [userBlogsPagination, setUserBlogsPagination] =
    useState<apiInterfaces.PaginatedBlogResponse | null>(null);
  const [readHistoryPagination, setReadHistoryPagination] =
    useState<apiInterfaces.PaginatedBlogResponse | null>(null);

  let currentUser = null;

  try {
    const authContext = useAuth();
    currentUser = authContext.currentUser;
  } catch (error) {
    console.log("AuthProvider not ready yet");
  }

  const updatePaginationState = useCallback(
    (
      data: apiInterfaces.PaginatedBlogResponse,
      setter: React.Dispatch<
        React.SetStateAction<apiInterfaces.PaginatedBlogResponse | null>
      >
    ) => {
      setter(data);
    },
    []
  );

  const fetchAllBlogs = useCallback(
    async (params: apiInterfaces.GetBlogsParams = {}) => {
      return await requestHandler(
        () => blogService.getBlogs(params),
        setLoading,
        (response) => {
          if (!response.data) {
            return { success: false, message: "No blog found" };
          }
          const { blogs } = response?.data;
          // Append blogs if loading next page, otherwise replace
          if (params.page && params.page > 1) {
            setAllBlogs((prev) => [...prev, ...blogs]);
          } else {
            setAllBlogs(blogs);
            setTrendingBlogs(blogs.slice(0, 5));
          }
          updatePaginationState(response.data, setPagination);
        },
        (response) => {
          return response;
        }
      );
    },
    [updatePaginationState]
  );

  const fetchSearchBlog = useCallback(async (blogId: string) => {
    if (currentBlog && blogId === currentBlog._id) {
      return {
        status: 201,
        success: true,
        currentBlog,
        message: "Fetched from Blog Context",
      };
    }
    return await requestHandler(
      () => blogService.getSearchedBlog(blogId),
      setLoadingSingleBlog,
      (response) => {
        if (!response.data)
          return {
            status: 301,
            success: false,
            data: {},
            message: "Response not recieved",
          };
        setCurrentBlog(response?.data);
        return response;
      },
      (response) => {
        return response;
      }
    );
  }, []);
  const fetchSingleBlog = useCallback(async (blogId: string) => {
    if (blogId === currentBlog?._id) {
      return {};
    }
    await requestHandler(
      () => blogService.getBlog(blogId),
      setLoadingSingleBlog,
      (response) => {
        if (!response) {
          return {};
        }
        // console.log(response);
        // console.log(response.data);
        setCurrentBlog(response.data);
      },
      setError
    );
  }, []);

  const initiateBlogCreation = useCallback(
    async (blogData: { title: string; content: string }) => {
      let createdBlog: Blog | null = null;
      await requestHandler(
        () => blogService.createBlog(blogData),
        setLoading,
        (response) => {
          const { data } = response;
          setUserBlogs((prev) => [data, ...prev]);
          createdBlog = data;
        },
        setError
      );
      console.log("initiateBlogCreation returning:", createdBlog);
      return createdBlog;
    },
    []
  );

  const updateBlogDetailsAction = useCallback(
    async (payload: apiInterfaces.UpdateBlogDetailsPayload) => {
      let success = false;
      await requestHandler(
        () => blogService.updateBlogDetails(payload),
        setLoading,
        (response) => {
          const { data: updatedBlog } = response.data;
          const updater = (blog: Blog) =>
            blog._id === updatedBlog._id ? updatedBlog : blog;

          setAllBlogs((prev) => prev.map(updater));
          setUserBlogs((prev) => prev.map(updater));
          setCurrentBlog((prev) =>
            prev?._id === updatedBlog._id ? updatedBlog : prev
          );
          success = true;
        },
        setError
      );
      return success;
    },
    []
  );

  // const createNewBlog = useCallback(async (blogData: FormData) => {
  //   let success = false;
  //   await requestHandler(
  //     () => blogService.createBlog(blogData),
  //     setLoading,
  //     (response) => {
  //       const { data } = response;
  //       setAllBlogs((prev) => [data, ...prev]);
  //       setUserBlogs((prev) => [data, ...prev]);
  //       success = true;
  //     },
  //     setError
  //   );
  //   return success;
  // }, []);

  const updateBlogTitleAction = useCallback(
    async (payload: apiInterfaces.UpdateBlogTitlePayload) => {
      let success = false;
      await requestHandler(
        () => blogService.updateBlogTitle(payload),
        setLoading,
        () => {
          const updater = (blog: apiInterfaces.Blog) =>
            blog._id === payload.blogId
              ? { ...blog, title: payload.newTitle }
              : blog;
          setAllBlogs((prev) => prev.map(updater));
          setCurrentBlog((prev) =>
            prev?._id === payload.blogId ? updater(prev) : prev
          );
          success = true;
        },
        setError
      );
      return success;
    },
    []
  );

  const updateBlogContentAction = useCallback(
    async (payload: apiInterfaces.UpdateBlogContentPayload) => {
      let success = false;
      await requestHandler(
        () => blogService.updateBlogContent(payload),
        setLoading,
        () => {
          setCurrentBlog((prev) =>
            prev?._id === payload.blogId
              ? { ...prev, content: payload.newContent }
              : prev
          );
          success = true;
        },
        setError
      );
      return success;
    },
    []
  );

  const updateBlogThumbnailAction = useCallback(
    async (payload: apiInterfaces.UpdateBlogThumbnailPayload) => {
      let success = false;
      await requestHandler(
        () => blogService.UpdateBlogThumbnail(payload),
        setLoading,
        (response) => {
          const { data } = response.data;
          const updater = (blog: apiInterfaces.Blog) =>
            blog._id === payload.blogId
              ? { ...blog, thumbnail: data.thumbnail }
              : blog;
          setAllBlogs((prev) => prev.map(updater));
          setUserBlogs((prev) => prev.map(updater));
          setCurrentBlog((prev) =>
            prev?._id === payload.blogId ? updater(prev) : prev
          );
          success = true;
        },
        setError
      );
      return success;
    },
    []
  );

  const toggleBlogStatusAction = useCallback(async (blogId: string) => {
    let success = false;
    await requestHandler(
      () => blogService.toggleBlogStatus(blogId),
      setLoading,
      (response) => {
        const { data } = response.data;
        const updater = (blog: apiInterfaces.Blog): apiInterfaces.Blog =>
          blog._id === blogId
            ? {
                ...blog,
                isPublished: Boolean(data.isPublished),
                status: data.status as "draft" | "published" | "archived",
                updatedAt: data.updatedAt,
              }
            : blog;
        setAllBlogs((prev) => prev.map(updater));
        setUserBlogs((prev) => prev.map(updater));
        setCurrentBlog((prev) =>
          prev && prev._id === blogId ? updater(prev) : prev
        );
        success = true;
      },
      setError
    );
    return success;
  }, []);

  const fetchUserBlogs = useCallback(
    async (params: apiInterfaces.GetUserBlogsParams) => {
      await requestHandler(
        () => userService.getUserBlogs(params),
        setLoading,
        (response) => {
          const { data } = response;
          setUserBlogs(data.blogs);
          updatePaginationState(data, setUserBlogsPagination);
        },
        setError
      );
    },
    [updatePaginationState]
  );

  const deleteBlogAction = useCallback(
    async (blogId: string) => {
      let success = false;
      await requestHandler(
        () => blogService.deleteBlog(blogId),
        setLoading,
        () => {
          setAllBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
          setUserBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
          if (currentBlog && currentBlog._id === blogId) {
            setCurrentBlog(null);
          }
          success = true;
        },
        setError
      );
      return success;
    },
    [currentBlog]
  );

  const restoreBlogAction = useCallback(
    async (blogId: string) => {
      let success = false;
      await requestHandler(
        () => blogService.restoreBlog(blogId),
        setLoading,
        async () => {
          success = true;
          if (currentBlog && currentBlog._id === blogId) {
            await fetchSingleBlog(blogId);
          }
          if (currentUser && currentUser._id) {
            await fetchUserBlogs({ userId: currentUser._id });
          }
        },
        setError
      );
      return success;
    },
    [currentBlog, currentUser, fetchSingleBlog, fetchUserBlogs]
  );

  const fetchReadHistory = useCallback(
    async (params: apiInterfaces.PaginationParams = {}) => {
      await requestHandler(
        () => userService.getReadHistory(params),
        setLoading,
        (response) => {
          const { data } = response;
          setReadHistory(data.blogs);
          updatePaginationState(data, setReadHistoryPagination);
        },
        setError
      );
    },
    [updatePaginationState]
  );
  const fetchFollowingFeed = useCallback(
    async (params: apiInterfaces.GetBlogsParams = {}) => {
      await requestHandler(
        () => blogService.getFollowingFeed(params),
        setLoading,
        (response) => {
          const { data } = response;
          // Append blogs if loading next page, otherwise replace
          if (params.page && params.page > 1) {
            setFeedBlogs((prev) => [...prev, ...data.blogs]);
          } else {
            setFeedBlogs(data.blogs);
          }
          updatePaginationState(data, setFeedPagination);
        },
        setError
      );
    },
    [updatePaginationState]
  );
  const fetchBlogsByCategory = useCallback(
    async (categoryId: string, params: apiInterfaces.GetBlogsParams = {}) => {
      await requestHandler(
        () => blogService.getBlogsByTopLevelCategory(categoryId, params),
        setLoading,
        (response) => {
          if (params.page && params.page > 1) {
            setAllBlogs((prev) => [...prev, ...response.data.blogs]);
          } else {
            setAllBlogs(response.data.blogs);
          }
          setPagination(response.data);
        },
        setError
      );
    },
    []
  );

  const contextValue: contextInterfaces.IBlogContext = {
    allBlogs,
    currentBlog,
    trendingBlogs,
    userBlogs,
    readHistory,
    loading,
    loadingSingleBlog,
    error,
    pagination,
    userBlogsPagination,
    readHistoryPagination,
    feedBlogs,
    feedPagination,
    fetchAllBlogs,
    fetchSearchBlog,
    initiateBlogCreation,
    updateBlogDetailsAction,
    updateBlogTitleAction,
    updateBlogContentAction,
    updateBlogThumbnailAction,
    fetchUserBlogs,
    fetchReadHistory,
    toggleBlogStatusAction,
    deleteBlogAction,
    restoreBlogAction,
    fetchFollowingFeed,
    fetchBlogsByCategory,
  };

  return (
    <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
  );
};

// import * as blogService from "../services/blog.service.ts";
// import * as userService from "../services/user.service.ts";
// import * as contextInterfaces from "../types/context.ts";
// import * as apiInterfaces from "../types/api.ts";
// import type { Blog } from "../types/api.ts";
// import React, { createContext, useCallback, useContext, useState } from "react";
// import { requestHandler } from "../lib/requestHandler.ts";
// import { useAuth } from "./auth.tsx";

// const BlogContext = createContext<contextInterfaces.IBlogContext | undefined>(
//   undefined
// );

// export const useBlogs = () => {
//   const context = useContext(BlogContext);
//   if (!context) {
//     throw new Error("useBlogs must be used within a BlogProvider.");
//   }
//   return context;
// };

// export const BlogProvider: React.FC<contextInterfaces.BlogProviderProps> = ({
//   children,
// }) => {
//   const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
//   const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
//   const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
//   const [readHistory, setReadHistory] = useState<Blog[]>([]);
//   const [feedBlogs, setFeedBlogs] = useState<Blog[]>([]);
//   const [feedPagination, setFeedPagination] =
//     useState<apiInterfaces.PaginatedBlogResponse | null>(null);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingSingleBlog, setLoadingSingleBlog] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const [pagination, setPagination] =
//     useState<apiInterfaces.PaginatedBlogResponse | null>(null);
//   const [userBlogsPagination, setUserBlogsPagination] =
//     useState<apiInterfaces.PaginatedBlogResponse | null>(null);
//   const [readHistoryPagination, setReadHistoryPagination] =
//     useState<apiInterfaces.PaginatedBlogResponse | null>(null);

//   const { currentUser } = useAuth();
//   const updatePaginationState = useCallback(
//     (
//       data: apiInterfaces.PaginatedBlogResponse,
//       setter: React.Dispatch<
//         React.SetStateAction<apiInterfaces.PaginatedBlogResponse | null>
//       >
//     ) => {
//       setter(data);
//     },
//     []
//   );

//   const fetchSingleBlog = useCallback(async (blogId: string) => {
//     await requestHandler(
//       () => blogService.getBlog(blogId),
//       setLoadingSingleBlog,
//       (response) => {
//         const { data } = response;
//         setCurrentBlog(data);
//       },
//       setError
//     );
//   }, []);

//   // --- NEW: Step 1 of Blog Creation ---
//   // This function now handles the initial creation with just title and content.
//   // It returns the newly created blog object on success.
//   const initiateBlogCreation = useCallback(
//     async (blogData: { title: string; content: object }) => {
//       let createdBlog: Blog | null = null;
//       await requestHandler(
//         () => blogService.createBlog(blogData),
//         setLoading,
//         (response) => {
//           const { data } = response;
//           // Add the new "pending" blog to the start of the lists
//           setAllBlogs((prev) => [data, ...prev]);
//           setUserBlogs((prev) => [data, ...prev]);
//           createdBlog = data; // Assign for return
//         },
//         setError
//       );
//       return createdBlog; // Return the new blog or null
//     },
//     []
//   );

//   // --- NEW: Step 2 of Blog Creation ---
//   // This function handles updating the blog with status and an optional thumbnail.
//   const updateBlogDetailsAction = useCallback(
//     async (payload: apiInterfaces.UpdateBlogDetailsPayload) => {
//       let success = false;
//       await requestHandler(
//         () => blogService.updateBlogDetails(payload),
//         setLoading,
//         (response) => {
//           const { data: updatedBlog } = response;
//           // Helper function to update a blog in an array
//           const updater = (blog: Blog) =>
//             blog._id === updatedBlog._id ? updatedBlog : blog;

//           // Update all relevant state arrays
//           setAllBlogs((prev) => prev.map(updater));
//           setUserBlogs((prev) => prev.map(updater));
//           setCurrentBlog((prev) =>
//             prev?._id === updatedBlog._id ? updatedBlog : prev
//           );
//           success = true;
//         },
//         setError
//       );
//       return success;
//     },
//     []
//   );

//   const updateBlogTitleAction = useCallback(
//     async (payload: apiInterfaces.UpdateBlogTitlePayload) => {
//       let success = false;
//       await requestHandler(
//         () => blogService.updateBlogTitle(payload),
//         setLoading,
//         () => {
//           const updater = (blog: apiInterfaces.Blog) =>
//             blog._id === payload.blogId
//               ? { ...blog, title: payload.newTitle }
//               : blog;
//           setAllBlogs((prev) => prev.map(updater));
//           setCurrentBlog((prev) =>
//             prev?._id === payload.blogId ? updater(prev) : prev
//           );
//           success = true;
//         },
//         setError
//       );
//       return success;
//     },
//     []
//   );

//   const updateBlogContentAction = useCallback(
//     async (payload: apiInterfaces.UpdateBlogContentPayload) => {
//       // For auto-save, we don't need a global loading state
//       let success = false;
//       await requestHandler(
//         () => blogService.updateBlogContent(payload),
//         null, // No setLoading
//         () => {
//           // No need to update state here as it's just a background save
//           success = true;
//         },
//         (err) => {
//           // You might want a specific way to handle auto-save errors
//           console.error("Auto-save failed:", err);
//           setError("Auto-save failed.");
//         }
//       );
//       return success;
//     },
//     []
//   );

//   // Other actions remain the same...

//   const contextValue: contextInterfaces.IBlogContext = {
//     allBlogs,
//     currentBlog,
//     userBlogs,
//     readHistory,
//     loading,
//     loadingSingleBlog,
//     error,
//     pagination,
//     userBlogsPagination,
//     readHistoryPagination,
//     feedBlogs,
//     feedPagination,
//     fetchSingleBlog,
//     initiateBlogCreation, // <-- REPLACED
//     updateBlogDetailsAction, // <-- ADDED
//     updateBlogTitleAction,
//     updateBlogContentAction,
//     // ... other actions
//   };

//   return (
//     <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
//   );
// };
