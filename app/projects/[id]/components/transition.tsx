"use client";
import { useRouter } from "next/router";

const handleNavigationTransition = (url: string) => {
  const router = useRouter();

  if (!document.startViewTransition) {
    router.push(url);
    return;
  }

  const transition = document.startViewTransition(() => {
    router.push(url);
  });

  transition.addEventListener("finish", () => {
    console.log("Transition finished!");
  });
};
