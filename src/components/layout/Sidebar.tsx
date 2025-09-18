import React from "react";
import FollowSuggestions from "../features/user/FollowSuggestions";
import Trending from "../features/blog/Trending"; // 1. Import the new component
import Footer from "./Footer";

const Sidebar: React.FC = () => {
  return (
    <aside className="sticky top-40 space-y-3.5">
      <Trending />
      <FollowSuggestions />
      {/* 2. Add the new component here */}
      <Footer variant="compact" />
    </aside>
  );
};

export default Sidebar;
