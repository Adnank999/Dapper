'use server'
import { getById } from "@/utils/supabase/projects/getById";
import ProjectShowcaseById from "./components/ProjectShowcaseById";
import Gallery from "./components/Gallery";
import { Suspense } from "react";

export default async function project({ params }) {
  const projectId = params.id;

  return (
    <section className="w-full mt-24 mx-auto max-w-5xl">
      
      <div >  {/*id="original-image"  className="gallery-body" */}
        {/* <Suspense fallback={<></>}> */}
          <ProjectWrapper projectId={projectId} />
        {/* </Suspense> */}
      </div>
    </section>
  );
}

async function ProjectWrapper({ projectId }: any) {

  const projectDetails = await getById(projectId);

  // return <Gallery projectDetails={projectDetails} />;
  return <ProjectShowcaseById projectDetails={projectDetails}/>
}
