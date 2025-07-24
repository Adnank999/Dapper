"use client";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import React from "react";

const CreateProjectButton = () => {
  const { user, userRole } = useUser();

  const isAdmin = userRole === "admin";


  console.log("User Role:", userRole);

  // if (userRole === null) {
  //   return (
  //     <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
  //       <div className="text-white">Not authorized</div>
  //     </div>
  //   );
  // }



  // User exists but doesn't have correct permission
  // if (!isAdmin) {
  //   return (
  //     <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
  //       <div className="text-white">
  //         You do not have permission to create a project.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Link href="/projects/create">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Create New Project
      </button>
    </Link>
  );
};

export default CreateProjectButton;
