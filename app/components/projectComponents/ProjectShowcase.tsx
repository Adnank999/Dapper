"use client";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AllProjects } from "@/types/projects/AllProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTransitionRouter } from "next-view-transitions";

interface ProjectShowcaseProps {
  getAllProjects: AllProjects;
}

export default function ProjectShowcase({
  getAllProjects,
}: ProjectShowcaseProps) {
  const pathname = usePathname();
  const router = useTransitionRouter();


  const handleImageNavigationTransition = (url) => {
    if (!document.startViewTransition) {
      // router.push(url); // Fallback if View Transition is not supported
      return;
    }

    document.startViewTransition(() => {
      router.push(url);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-16">
      {getAllProjects.map((project, index) => {
        const {
          id,
          title,
          description,
          project_tech_stack,
          project_images,
          project_bullet_points,
        } = project;

        console.log({ project });

        // Sanity-style rich text flattening
        const projectDescription = Array.isArray(description)
          ? description
              .map((block) =>
                block?.children?.map((child) => child?.text || "").join(" ")
              )
              .join(" ")
          : "";

        // Features list
        // Features list
        const features =
          Array.isArray(project_bullet_points) &&
          project_bullet_points.length > 0
            ? project_bullet_points.map((point) =>
                typeof point === "object" && "bullet_point" in point
                  ? point.bullet_point
                  : ""
              )
            : [];

        return (
          <div
            key={id || index}
            id="from"
            className="grid lg:grid-cols-2 gap-8 items-start"
          >
            {/* Image Card */}

            <Link
              id="thumbnail-image"
              href={`${pathname}/${id}`}
              onClick={(e) => {
                e.preventDefault();
                handleImageNavigationTransition(`${pathname}/${id}`);
              }}
              passHref
            >
              <Card  className="relative overflow-hidden p-8 text-white min-h-[350px] flex justify-center items-center">
                <div className="relative z-10 space-y-6 text-center">
                  <div className="relative mt-8 flex justify-center">
                    <div className="w-fit rounded-lg overflow-hidden shadow-2xl ">
                      <Image
                        
                        src={
                          project_images && project_images.length > 0
                            ? project_images[0].thumbnail_url
                            : "/placeholder.svg"
                        }
                        alt={title || "Project mockup"}
                        width={300}
                        height={300}
                        className="h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div  className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-purple-800/90" />
              </Card>
            </Link>

            {/* Project Details */}
            <div className="space-y-8 text-white">
              {/* Title */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5 bg-pink-500" />
                  <h2 className="text-3xl font-bold">{title}</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {projectDescription}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Plus className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-3">
                {project_tech_stack.map((tech, i) => (
                  <Badge
                    key={i}
                    className={`luxury-gradient cursor-pointer px-3 py-2 text-xs font-medium inline-flex items-center justify-center rounded-full border w-fit whitespace-nowrap shrink-0 gap-1 transition-all border-white hover:bg-white/20`}
                  >
                    {tech?.tech_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>

  
  );
}
