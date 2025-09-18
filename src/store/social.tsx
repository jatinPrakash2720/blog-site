import * as followService from "../services/userFollow.service.ts";
import * as likeService from "../services/like.service.ts";
import * as commentService from "../services/comment.service.ts";
import * as saveService from "../services/save.service.ts";

import * as contextInterfaces from "../types/context.ts";
import * as apiInterfaces from "../types/api.ts";
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
  const [followers, setFollowers] = useState<apiInterfaces.User[]>([]);
  const [following, setFollowing] = useState<apiInterfaces.User[]>([]);
  const [collections, setCollections] = useState<
    apiInterfaces.SaveCollection[]
  >([]);
  const [likedByUsers, setLikedByUsers] = useState<apiInterfaces.User[]>([]);

  //Comment Actions
  const fetchComments = useCallback(async (blogId: string) => {
    await requestHandler(
      () => commentService.getBlogComments(blogId),
      setLoading,
      (response) => {
        const { data } = response;
        setComments(data.docs || []);
      },
      setError
    );
  }, []);

  const addComment = useCallback(async (blogId: string, content: string) => {
    let success = false;
    await requestHandler(
      () => commentService.addCommentToBlog(blogId, { content }),
      setLoading,
      (response) => {
        setComments((prev) => [response.data, ...prev]);
        success = true;
      },
      setError
    );
    return success;
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    let success = false;
    await requestHandler(
      () => commentService.deleteComment(commentId),
      setLoading,
      () => {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        success = true;
      },
      setError
    );
    return success;
  }, []);

  //Like Actions
  const toggleBlogLike = useCallback(async (blogId: string) => {
    let likedStatus = false;
    await requestHandler(
      () => likeService.toggleBlogLike(blogId),
      null,
      (response) => (likedStatus = response.data.liked),
      setError
    );
    return likedStatus;
  }, []);

  const toggleCommentLike = useCallback(async (commentId: string) => {
    let likedStatus = false;
    await requestHandler(
      () => likeService.toggleCommentLike(commentId),
      null,
      (response) => (likedStatus = response.data.liked),
      setError
    );
    return likedStatus;
  }, []);

  const fetchUsersWhoLikedBlog = useCallback(async (blogId: string) => {
    await requestHandler(
      () => likeService.getBlogLikes(blogId),
      setLoading,
      (res) => setLikedByUsers(res.data),
      setError
    );
  }, []);

  const fetchUsersWhoLikedComment = useCallback(async (commentId: string) => {
    await requestHandler(
      () => likeService.getCommentLikes(commentId),
      setLoading,
      (res) => setLikedByUsers(res.data),
      setError
    );
  }, []);

  // --- Follow Actions ---
  const toggleFollowUser = useCallback(async (userId: string) => {
    let followStatus = false;
    await requestHandler(
      () => followService.toggleFollow(userId),
      null,
      (res: { data: { followed: boolean } }) =>
        (followStatus = res.data.followed),
      setError
    );
    return followStatus;
  }, []);

  const fetchFollowers = useCallback(async (userId: string) => {
    await requestHandler(
      () => followService.getUserFollowers(userId),
      setLoading,
      (res: { data: apiInterfaces.User[] }) => setFollowers(res.data),
      setError
    );
  }, []);

  const fetchFollowing = useCallback(async (userId: string) => {
    await requestHandler(
      () => followService.getUserFollowing(userId),
      setLoading,
      (res: { data: apiInterfaces.User[] }) => setFollowing(res.data),
      setError
    );
  }, []);

  // --- Save Actions ---
  const createSaveCollection = useCallback(
    async (data: apiInterfaces.CreateSaveCollectionPayload) => {
      let success = false;
      await requestHandler(
        () => saveService.createSaveCollection(data),
        setLoading,
        (res) => {
          setCollections((prev) => [...prev, res.data]);
          success = true;
        },
        setError
      );
      return success;
    },
    []
  );

  const fetchCollections = useCallback(async () => {
    await requestHandler(
      () => saveService.getUserCollections(),
      setLoading,
      (res) => setCollections(res.data),
      setError
    );
  }, []);

  const toggleSaveToCollection = useCallback(
    async (collectionId: string, blogId: string) => {
      await requestHandler(
        () => saveService.toggleBlogInCollection(collectionId, blogId),
        null,
        (res) => {
          setCollections((prev) =>
            prev.map((c) => (c._id === collectionId ? res.data.collection : c))
          );
        },
        setError
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
        (res) => {
          setCollections((prev) =>
            prev.map((c) => (c._id === collectionId ? res.data : c))
          );
          success = true;
        },
        setError
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
      () => {
        setCollections((prev) => prev.filter((c) => c._id !== collectionId));
        success = true;
      },
      setError
    );
    return success;
  }, []);

  const contextValue: contextInterfaces.ISocialContext = {
    loading,
    error,
    comments,
    followers,
    following,
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
    createSaveCollection,
    fetchCollections,
    toggleSaveToCollection,
    updateSaveCollection,
    deleteSaveCollection,
    };
    
    return <SocialContext.Provider value={contextValue}>{children}</SocialContext.Provider>
};
