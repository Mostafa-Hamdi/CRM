"use client";
import Layout from "./layout-components/Layout";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LayoutClient({ children }: PropsWithChildren) {
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) router.push("/");
  }, [isLogin]);
  return (
    <>
      {isLogin ? (
        <>
          <Layout />
          <main
            className={`
              transition-all duration-300
              lg:pl-64
              `}
          >
            {children}
          </main>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
