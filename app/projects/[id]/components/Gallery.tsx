"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ProjectImage {
  id: string;
  image_url: string;
  label: string;
}

interface Props {
  projectDetails: {
    project_images: ProjectImage[];
  };
}

export default function Gallery({ projectDetails }: Props) {
  const projectImages = projectDetails.project_images;
 
  // useEffect(() => {

  //   const radios =
  //     document.querySelectorAll<HTMLInputElement>("#gallery input");

  //   radios.forEach((radio) => {
  //     radio.onclick = (e) => {
  //       if (!document.startViewTransition ) return;

  //       e.preventDefault();

  //       const target = e.currentTarget as HTMLInputElement;

  //       const mutate = () => {
  //         target.checked = true;
  //         target.parentElement!.style.zIndex = "";

  //       };

  //       target.parentElement!.style.zIndex = "2";

  //       document.startViewTransition(() => mutate());
  //     };
  //   });

  //   const flipGallery = () => {
  //     const vertical = window.innerWidth <= 768;
  //     const gallery = document.getElementById("gallery");
  //     if (!gallery) return;

  //     const mutate = () => {
  //       vertical
  //         ? gallery.classList.add(styles.portrait)
  //         : gallery.classList.remove(styles.portrait);
  //     };

  //     document.startViewTransition
  //       ? document.startViewTransition(() => mutate())
  //       : mutate();
  //   };

  //   const handleResize = () => {
  //     clearTimeout((window as any).resizeEndTimer);
  //     (window as any).resizeEndTimer = setTimeout(flipGallery, 100);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   flipGallery();

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const handleRadioClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!document.startViewTransition) return;

    e.preventDefault();

    const target = e.currentTarget;
    const mutate = () => {
      target.checked = true;
      target.parentElement!.style.zIndex = "";
    };

    target.parentElement!.style.zIndex = "2";
    document.startViewTransition(() => mutate());
  };

  const handleResizeFlip = () => {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    const vertical = window.innerWidth <= 768;

    const mutate = () => {
      vertical
        ? gallery.classList.add(styles.portrait)
        : gallery.classList.remove(styles.portrait);
    };

    document.startViewTransition
      ? document.startViewTransition(() => mutate())
      : mutate();
  };

  // Optional: Flip layout on every render (or trigger manually elsewhere)
  if (typeof window !== "undefined") {
    setTimeout(handleResizeFlip, 0);
  }
  return (
    <div>
      <fieldset id="gallery" className="hub">
        {projectImages.map((img, index) => (
          <div
            key={img.id}
            style={{ viewTransitionName: `gallery-item-${index + 1}` }}
          >
            <input
              type="radio"
              id={img.id}
              name="gallery"
              value={img.id}
              defaultChecked={index === 0}
              className="hidden"
              onClick={handleRadioClick}
            />

            <img src={img.image_url} alt={img.label || "Project image"} />

            <label htmlFor={img.id}>{img.label || `Image ${index + 1}`}</label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
