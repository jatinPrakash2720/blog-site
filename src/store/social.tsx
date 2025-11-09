import * as followService from "../services/userFollow.service.ts";
import * as likeService from "../services/like.service.ts";
import * as commentService from "../services/comment.service.ts";
import * as saveService from "../services/save.service.ts";

import * as contextInterfaces from "../types/context.ts";
import * as apiInterfaces from "../types/apisInterfaces/api.ts";
import React, { createContext, useCallback, useContext, useState } from "react";
import { requestHandler } from "../lib/requestHandler.ts";

// type FollowResponse = { data: { followed: boolean } };
// type UsersResponse = { data: apiInterfaces.User[] };

const SocialContext = createContext<
  contextInterfaces.ISocialContext | undefined
>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a Social Provider.");
  }
  return context;
};

export const SocialProvider: React.FC<
  contextInterfaces.SocialProviderProps
> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<apiInterfaces.Comment[]>([]);
  const [commentPagination, setCommentPagination] =
    useState<apiInterfaces.PaginatedCommentResponse | null>(null);
  const [followers, setFollowers] = useState<apiInterfaces.User[]>([]);
  const [following, setFollowing] = useState<apiInterfaces.User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<apiInterfaces.User[]>(
    []
  );
  const [collections, setCollections] = useState<
    apiInterfaces.SaveCollection[]
  >([]);
  const [likedByUsers, setLikedByUsers] = useState<apiInterfaces.User[]>([]);

  //Comment Actions
  const fetchComments = useCallback(
    async (
      blogId: string,
      params?: apiInterfaces.PaginationParams,
      append: boolean = false
    ): Promise<void> => {
      await requestHandler(
        () => commentService.getBlogComments(blogId, params),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No comments data found",
            };
          const { data } = response;
          // Backend uses customLabels: { docs: "comments" }, so response has "comments" not "docs"
          const newComments = data.comments || data.docs || [];
          if (append) {
            setComments((prev) => [...prev, ...newComments]);
          } else {
            setComments(newComments);
          }
          setCommentPagination({
            totalDocs: data.totalDocs || 0,
            limit: data.limit || 10,
            page: data.page || 1,
            totalPages: data.totalPages || 1,
            hasNextPage: data.hasNextPage || false,
            hasPrevPage: data.hasPrevPage || false,
          });
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No comments data found",
            };
          return response;
        }
      );
    },
    []
  );

  const addComment = useCallback(
    async (blogId: string, content: string): Promise<boolean> => {
      let success = false;
      await requestHandler(
        () => commentService.addCommentToBlog(blogId, { content }),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No comment data found",
            };
          if (response.data) {
            setComments((prev) => [
              response.data as apiInterfaces.Comment,
              ...prev,
            ]);
            setCommentPagination((prev) =>
              prev
                ? {
                    ...prev,
                    totalDocs: prev.totalDocs + 1,
                  }
                : null
            );
            success = true;
          }
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No comment data found",
            };
          return response;
        }
      );
      return success;
    },
    []
  );

  const deleteComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      let success = false;
      await requestHandler(
        () => commentService.deleteComment(commentId),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No delete data found",
            };
          setComments((prev) => prev.filter((c) => c._id !== commentId));
          success = true;
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No delete data found",
            };
          return response;
        }
      );
      return success;
    },
    []
  );

  //Like Actions
  const toggleBlogLike = useCallback(async (blogId: string) => {
    let likedStatus = false;
    await requestHandler(
      () => likeService.toggleBlogLike(blogId),
      null,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No like data found",
          };
        likedStatus = response.data.liked;
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No like data found",
          };
        return response;
      }
    );
    return likedStatus;
  }, []);

  const toggleCommentLike = useCallback(async (commentId: string) => {
    let likedStatus = false;
    await requestHandler(
      () => likeService.toggleCommentLike(commentId),
      null,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No like data found",
          };
        likedStatus = response.data.liked;
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No like data found",
          };
        return response;
      }
    );
    return likedStatus;
  }, []);

  const fetchUsersWhoLikedBlog = useCallback(async (blogId: string) => {
    await requestHandler(
      () => likeService.getBlogLikes(blogId),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No likes data found",
          };
        setLikedByUsers(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No likes data found",
          };
        return response;
      }
    );
  }, []);

  const fetchUsersWhoLikedComment = useCallback(async (commentId: string) => {
    await requestHandler(
      () => likeService.getCommentLikes(commentId),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No likes data found",
          };
        setLikedByUsers(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No likes data found",
          };
        return response;
      }
    );
  }, []);

  // --- Follow Actions ---
  const toggleFollowUser = useCallback(async (userId: string) => {
    let followStatus = false;
    await requestHandler(
      () => followService.toggleFollow(userId),
      null,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No follow data found",
          };
        followStatus = response.data.followed;
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No follow data found",
          };
        return response;
      }
    );
    return followStatus;
  }, []);

  const fetchFollowers = useCallback(async (userId: string) => {
    await requestHandler(
      () => followService.getUserFollowers(userId),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No followers data found",
          };
        setFollowers(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No followers data found",
          };
        return response;
      }
    );
  }, []);

  const fetchFollowing = useCallback(async (userId: string) => {
    await requestHandler(
      () => followService.getUserFollowing(userId),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No following data found",
          };
        setFollowing(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No following data found",
          };
        return response;
      }
    );
  }, []);

  const fetchSuggestedUsers = useCallback(async () => {
    await requestHandler(
      () => followService.getSuggestedUsers(),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No suggested users data found",
          };
        setSuggestedUsers(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No suggested users data found",
          };
        return response;
      }
    );
  }, []);

  // --- Save Actions ---
  const createSaveCollection = useCallback(
    async (data: apiInterfaces.CreateSaveCollectionPayload) => {
      let success = false;
      await requestHandler(
        () => saveService.createSaveCollection(data),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No collection data found",
            };
          if (response.data) {
            setCollections((prev) => [
              ...prev,
              response.data as apiInterfaces.SaveCollection,
            ]);
            success = true;
          }
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No collection data found",
            };
          return response;
        }
      );
      return success;
    },
    []
  );

  const fetchCollections = useCallback(async () => {
    await requestHandler(
      () => saveService.getUserCollections(),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No collections data found",
          };
        setCollections(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No collections data found",
          };
        return response;
      }
    );
  }, []);

  const toggleSaveToCollection = useCallback(
    async (collectionId: string, blogId: string) => {
      await requestHandler(
        () => saveService.toggleBlogInCollection(collectionId, blogId),
        null,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No toggle data found",
            };
          if (response.data?.collection) {
            setCollections((prev) =>
              prev.map((c) =>
                c._id === collectionId ? response.data!.collection : c
              )
            );
          }
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No toggle data found",
            };
          return response;
        }
      );
    },
    []
  );

  const updateSaveCollection = useCallback(
    async (
      collectionId: string,
      data: apiInterfaces.UpdateSaveCollectionPayload
    ) => {
      let success = false;
      await requestHandler(
        () => saveService.updateSaveCollection(collectionId, data),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No collection data found",
            };
          if (response.data) {
            setCollections((prev) =>
              prev.map((c) =>
                c._id === collectionId
                  ? (response.data as apiInterfaces.SaveCollection)
                  : c
              )
            );
            success = true;
          }
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No collection data found",
            };
          return response;
        }
      );
      return success;
    },
    []
  );

  const deleteSaveCollection = useCallback(async (collectionId: string) => {
    let success = false;
    await requestHandler(
      () => saveService.deleteSaveCollection(collectionId),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No delete data found",
          };
        setCollections((prev) => prev.filter((c) => c._id !== collectionId));
        success = true;
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            status: response.statusCode,
            success: false,
            message: "No delete data found",
          };
        return response;
      }
    );
    return success;
  }, []);

  const contextValue: contextInterfaces.ISocialContext = {
    loading,
    error,
    comments,
    commentPagination,
    followers,
    following,
    suggestedUsers,
    collections,
    likedByUsers,
    fetchComments,
    addComment,
    deleteComment,
    toggleBlogLike,
    toggleCommentLike,
    fetchUsersWhoLikedBlog,
    fetchUsersWhoLikedComment,
    toggleFollowUser,
    fetchFollowers,
    fetchFollowing,
    fetchSuggestedUsers,
    createSaveCollection,
    fetchCollections,
    toggleSaveToCollection,
    updateSaveCollection,
    deleteSaveCollection,
  };

  return (
    <SocialContext.Provider value={contextValue}>
      {children}
    </SocialContext.Provider>
  );
};
