"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProjectShowcaseById = ({ projectDetails }) => {
  const projectImages = projectDetails.project_images || [];

  return (
    <div id="to">
      {projectImages.length > 0 ? (
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent className="-ml-1">
            {projectImages.map((imageObj, index) => (
              <CarouselItem key={index} className="pl-1">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center h-[80vh] justify-center p-0 relative">
                      <div className="relative w-full h-full">
                        {" "}
                        {/* ✅ Container for fill */}
                        <Image
                          id={index === 0 ? "original-image" : undefined}
                          src={imageObj.image_url}
                          alt={`${projectDetails.title || "Project"} - Image ${
                            index + 1
                          }`}
                          fill
                          className="object-cover rounded-lg" // ✅ object-cover with fill
                        />
                      </div>
                    </CardContent>

                    {/* <CardContent className="flex items-center h-[80vh] justify-center p-0 relative">
                      <div className="relative w-full h-full">
                        <Image
                          id={index === 0 ? "original-image" : undefined}
                          src={imageObj.image_url}
                          alt={`${projectDetails.title || "Project"} - Image ${
                            index + 1
                          }`}
                          fill
                          className="object-contain rounded-lg" // ✅ Shows entire image, may have empty space
                        />
                      </div>
                    </CardContent> */}
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>No project images available</p>
      )}
    </div>
  );
};

export default ProjectShowcaseById;
