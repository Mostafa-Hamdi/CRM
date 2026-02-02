"use client";
import UnauthorizedPage from "@/app/Unauthorized";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import EditCategory from "../../components/EditCategory";

const page = () => {
  const params = useParams();
  const id = Number(params.id);
  const permissions = useSelector((state: any) => state.auth.user?.permissions);
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);
  return (
    <>
      {isLogin && permissions?.includes("Categories.Edit") ? (
        <EditCategory id={id} />
      ) : (
        <UnauthorizedPage />
      )}
    </>
  );
};

export default page;
