"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Buttonlogin = ({ session, extraStyle = "" }) => {
  console.log(extraStyle);
  const dashboardUrl = "/dashboard";
  if (session) {
    return (
      <Link href={dashboardUrl} className={`btn btn-primary ${extraStyle}`}>
        Welcome Back {session.user.name || ""}
      </Link>
    );
  } else {
    return (
      <button
        className={`btn btn-primary ${extraStyle}`}
        onClick={() => {
          signIn(undefined, { callbackUrl: dashboardUrl });
        }}
      >
        Login
      </button>
    );
  }
};

export default Buttonlogin;
