
// import * as React from "react";
// // import { useAuth } from "@/store/auth";
// import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
// import { EditorDrawer } from "@/components/features/blog/EditorDrawer";
// import type { Blog} from "@/types/api";
// import Loader from "@/components/ui/Loader";
// import { EditorProvider, useEditorContextSafe } from "@/store/editor";
// import { BlogDetailsDrawer,type BlogDetailsData } from "@/components/features/blog/BlogDetailsDrawer";
// import Header from "@/components/layout/Header";
// import { useNavigate } from "react-router-dom";
// import { useBlogs } from "@/store/blog";

// type EditorView = "drawer" | "fullscreen" | "preview" | "publish"|"previewd"|"previewf"|"post-details";

// // Inner component that has access to the EditorContext
// const EditorFlow: React.FC = () => {
//   const [view, setView] = React.useState<EditorView>("drawer");
//   const [blog] = React.useState<Blog | null>(null);
//   const [createdBlog, setCreatedBlog] = React.useState<Blog | null>(null);
  
//   const { initiateBlogCreation, updateBlogDetailsAction } = useBlogs();
//   const navigate = useNavigate();

//   const { title, content, setContent,  } = useEditorContextSafe();

  
//   const handleSaveContent = async (savedContent: object) => {
//     const newBlog = await initiateBlogCreation({
//       title,
//       content: JSON.stringify(savedContent),
//     });
//     if (newBlog) {
//       setCreatedBlog(newBlog);
//       setView("post-details"); // Move to the final publishing step
//     } else {
//       alert("Failed to save draft. Please try again.");
//     }
//   };
//   const handleFinalizeBlog = async (details: BlogDetailsData) => {
//       if (!createdBlog) return;
  
//       const success = await updateBlogDetailsAction({
//         blogId: createdBlog._id,
//         status: details.status,
//         thumbnail: details.thumbnail,
//         // categoryId: details.categoryId,
//       });
  
//       if (success) {
//         navigate(
//           details.status === "published" ? `/home` : "/home"
//         );
//         // navigate(
//         //   details.status === "published" ? `/blog/${createdBlog._id}` : "/profile"
//         // );
//       }
//     };
//   // React.useEffect(() => {
//   //   const createDraft = async () => {
//   //     const newBlog = await initiateBlogCreation();
//   //     if (newBlog) {
//   //       setBlog(newBlog);
//   //       setTitle(newBlog.title || "Untitled");
//   //       setContent(newBlog.content || "");
//   //     } else {
//   //       navigate("/home");
//   //     }
//   //   };
//   //   createDraft();
//   // }, [initiateBlogCreation, navigate, setTitle, setContent]);

//   const handleSave = () => setView("publish");
//   const handlePreview = () => setView("preview");
//   const handleBackToEditor = () =>
//     setView(view==="previewd" ? "drawer" : "fullscreen");

//   if (!blog) return <Loader />;

//   if (view === "previewd") {
//     //  const previewData: Blog = {
//     //   _id: "preview-id",
//     //   title: title,
//     //   slug: "preview-slug",
//     //   thumbnail:"./placeholder_image.jpg",
//     //   content: content,
//     //   owner: currentUser as User,
//     //   categories: [],
//     //   excerpt: "This is a preview...",
//     //   views: 0,
//     //   isPublished: false,
//     //   status: "draft",
//     //   createdAt: new Date().toISOString(),
//     //   updatedAt: new Date().toISOString(),
//     //   likeCount: 0,
//     //   commentCount: 0,
//     // };
//     return (
//       <EditorDrawer
//       isOpen={view === "previewd"}
//       onClose={() => navigate(-1)}
//       onSave={handleSave}
//       onPreview={handlePreview}
//       onFullscreen={() => setView("fullscreen")}
//     />
//     );
//   }
//   if (view === "previewf") {
//     //  const previewData: Blog = {
//     //   _id: "preview-id",
//     //   title: title,
//     //   slug: "preview-slug",
//     //   thumbnail:"./placeholder_image.jpg",
//     //   content: content,
//     //   owner: currentUser as User,
//     //   categories: [],
//     //   excerpt: "This is a preview...",
//     //   views: 0,
//     //   isPublished: false,
//     //   status: "draft",
//     //   createdAt: new Date().toISOString(),
//     //   updatedAt: new Date().toISOString(),
//     //   likeCount: 0,
//     //   commentCount: 0,
//     // };
//     return (
//       <div className="bg-background min-h-screen">
//         <Header />
//         <SimpleEditor initialContent={content} isEditable={false} />
//       </div>
//     );
//   }

//   if (view === "fullscreen") {
//     // The fullscreen editor will now get its header from the main Header component
//     return (
//       <div className="bg-background min-h-screen pt-16">
//         <SimpleEditor initialContent={content} />
//       </div>
//     );
//   }

//   if (view === "publish") {
//     return (
//       <BlogDetailsDrawer
//         isOpen={true}
//         onOpenChange={() => setView("drawer")}
//         initialData={blog}
//         mode="post-editor"
//         onSave={(details) => {
//           // Final API call logic
//           console.log("Finalizing blog with details:", details);
//           // updateBlogDetailsAction(...)
//         }}
//       />
//     );
//   }

//   // Default view is the drawer
//   return (
//     <EditorDrawer
//       isOpen={view === "drawer"}
//       onClose={() => navigate(-1)}
//       onSave={handleSave}
//       onPreview={handlePreview}
//       onFullscreen={() => setView("fullscreen")}
//     />
//   );
// };

// // The main export wraps the entire flow in the provider
// const EditorPage: React.FC = () => (
//   <EditorProvider>
//     <EditorFlow />
//   </EditorProvider>
// );

// export default EditorPage;