"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Buttonlogin = ({ IsLoggedIn, Name, extraStyle = "" }) => {
  const dashboardUrl = "/dashboard";
  console.log(extraStyle);
  if (IsLoggedIn) {
    return (
      <Link href={dashboardUrl} className={`btn btn-primary ${extraStyle}`}>
        Welcome Back {Name}
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
        Get Started
      </button>
    );
  }
};

export default Buttonlogin;
