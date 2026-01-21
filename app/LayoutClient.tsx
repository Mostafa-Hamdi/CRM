"use client";
import Layout from "./layout components/Layout";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import { PropsWithChildren } from "react";

export default function LayoutClient({ children }: PropsWithChildren) {
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);
  console.log(isLogin);
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
