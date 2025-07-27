"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image"; // Make sure you're using Next.js Image component

const ProjectShowcaseById = ({ projectDetails }) => {

  const projectImage = projectDetails.project_images[0]?.image_url;

 

  return (
    <div id="to">
      {/* Check if the image_url exists before rendering */}
      {projectImage ? (
        <Image
          id="original-image"
          src={projectImage}
          alt={projectDetails.title || "Project Image"}
          width={1000} // Customize the width
          height={600} // Customize the height
         
        />
      ) : (
        <p>No project image available</p> // Fallback if no image is found
      )}
    </div>
  );
};

export default ProjectShowcaseById;
