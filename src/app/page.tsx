"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const accessToken = localStorage.getItem("lettering_access");

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, []);
  return <div>Lettering Initial Project</div>;
}
