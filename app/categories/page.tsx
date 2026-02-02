"use client";

import { Cat } from "lucide-react";
import { useSelector } from "react-redux";
import Categories from "./components/Categories";
import UnauthorizedPage from "../Unauthorized";

const page = () => {
  const permissions = useSelector((state: any) => state.auth.user?.permissions);
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);

  return (
    <>
      {isLogin && permissions?.includes("Categories.View") ? (
        <Categories />
      ) : (
        <UnauthorizedPage />
      )}
    </>
  );
};

export default page;
