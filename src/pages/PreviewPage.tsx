// "use client";

// import React from "react";
// // import { Preview } from "@/components/features/blog/Preview";
// import AuthorProfileCard from "@/components/features/user/AuthorProfileCard";
// import ParticleBackground from "@/components/common/background/ParticeBackground";
// import type { Blog } from "@/types/api";
// import { Button } from "@/components/ui/button";
// import { Eye } from "lucide-react";
// import ThemeToggle from "@/components/common/wrappers/ThemeToggle";

// // --- NEW, MINIMAL HEADER FOR PREVIEW MODE ---
// const PreviewHeader: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => (
//   <header className="fixed top-0 left-0 right-0 z-50 p-4">
//     <div className="mx-auto max-w-7xl flex justify-end items-center">
//       <div className="flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border">
//         <Button
//           onClick={onGoBack}
//           variant="ghost"
//           size="sm"
//           className="flex items-center gap-2"
//         >
//           <Eye className="w-4 h-4" />
//           <span>Back to Editor</span>
//         </Button>
//         <ThemeToggle />
//       </div>
//     </div>
//   </header>
// );

// interface BlogPreviewPageProps {
//   blog: Blog;
//   onGoBackToEditor: () => void;
// }

// export default function BlogPreviewPage({
//   blog,
//   onGoBackToEditor,
// }: BlogPreviewPageProps) {
//   if (!blog) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-muted-foreground">No blog data to preview.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-muted/50">
//       {/* Use the new, minimal header */}
//       <PreviewHeader onGoBack={onGoBackToEditor} />

//       <div className="relative flex-grow w-full pt-24">
//         <ParticleBackground className="fixed inset-0 -z-10" />
//         <main className="container mx-auto py-8">
//           <div className="max-w-4xl mx-auto space-y-4">
//             <div>
//               <AuthorProfileCard author={blog.owner} />
//               {/* The action bar is not needed in a preview */}
//             </div>
//             <div className="bg-card p-4 sm:p-8 rounded-2xl border border-border">
//               <Preview content={blog.content} />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
