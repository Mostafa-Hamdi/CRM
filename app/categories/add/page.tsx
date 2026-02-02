"use client";

import { useSelector } from "react-redux";
import AddCategory from "../components/AddCategory";
import UnauthorizedPage from "@/app/Unauthorized";

const page = () => {
  const permissions = useSelector((state: any) => state.auth.user?.permissions);
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);
  return (
    <>
      {isLogin && permissions?.includes("Categories.Add") ? (
        <AddCategory />
      ) : (
        <UnauthorizedPage />
      )}
    </>
  );
};

export default page;
