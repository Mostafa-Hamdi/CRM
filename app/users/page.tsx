"use client";

import { useGetUsersQuery } from "@/store/api/apiSlice";
import { useEffect, useState } from "react";

const page = () => {
  const [currentUsers, setCurrentUsers] = useState();
  const { data, isLoading } = useGetUsersQuery();
  useEffect(() => {
    setTimeout(() => {
      console.log(data);
    }, 2000);
  }, []);
  return <div>asfas</div>;
};

export default page;
