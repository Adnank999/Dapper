"use server";


import { getById } from "@/utils/supabase/projects/getById";
import ProjectShowcaseById from "./components/ProjectShowcaseById";
import Gallery from "./components/Gallery";


export default async function project({ params }) {

  const projectId = params.id;

  const projectDetails = await getById(projectId)

  console.log("projectDetails",projectDetails)

  return <section className="w-full mt-24 mx-auto max-w-5xl">
    {/* <ProjectShowcaseById projectDetails={projectDetails}/> */}
    <div id="original-image" className="gallery-body">
       <Gallery projectDetails={projectDetails}/>
    </div>
   
  </section>;
}
