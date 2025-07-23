'use server'
import React from "react";
import CreateProject from "../components/projectComponents/create/CreateProject";
import CreateProjectButton from "../components/projectComponents/create/CreateProjectButton";
import { createClient } from "@/utils/supabase/server";

export default async function projects() {

  
  return (
    <section className="w-full mt-24">
      {/* <h1>Projects will show here</h1> */}
        <CreateProjectButton/>
      
    </section>
  );
}
