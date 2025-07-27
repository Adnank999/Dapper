'use server'
import React from "react";
import CreateProject from "../components/projectComponents/create/CreateProject";
import CreateProjectButton from "../components/projectComponents/create/CreateProjectButton";
import { createClient } from "@/utils/supabase/server";
import { getAllProjects } from "@/utils/supabase/projects/show";
import ProjectShowcase from "../components/projectComponents/ProjectShowcase";
import { AllProjects } from "@/types/projects/AllProject";

export default async function projects() {
  const allProjects : AllProjects = await getAllProjects();
  
  
  return (
    <section className="w-full mt-24 mx-auto max-w-5xl">
      {/* <h1>Projects will show here</h1> */}
        <CreateProjectButton/>
        <ProjectShowcase getAllProjects={allProjects}/>
    </section>

    
  );
}
