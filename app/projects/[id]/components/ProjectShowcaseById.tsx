"use client";
import React from "react";
import Image from "next/image"; // Make sure you're using Next.js Image component

const ProjectShowcaseById = ({ projectDetails }) => {
 const projectImage = projectDetails.project_images[0]?.image_url;

  return (
    <div id="to" >
      {/* Main image section */}
      
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
   

      {/* Gallery section */}
      {/* <div
        className="gallery"
        style={{
          width: "40%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {projectImages &&
          projectImages.length > 1 &&
          projectImages.slice(1).map((image, index) => (
            <div key={index} style={{ position: "relative", width: "100%" }}>
              <Image
                src={image?.image_url}
                alt={projectDetails.title || "Project Image"}
                layout="responsive"
                width={300}
                height={200}
                objectFit="cover"
              />
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default ProjectShowcaseById;

