"use client";

import { signOut } from "next-auth/react";

export default function ButtonLogout() {
  return (
    <button className="btn btn-primary" onClick={() => signOut()}>Logout</button>
  );
}