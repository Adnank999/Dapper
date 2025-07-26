// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Uppy from "@uppy/core";
// import XHRUpload from "@uppy/xhr-upload";
// import ThumbnailGenerator from "@uppy/thumbnail-generator";
// import { Dashboard } from "@uppy/react";
// import "@uppy/core/dist/style.css";
// import "@uppy/dashboard/dist/style.css";

// interface ImageUploadProps {
//   onUpload: () => void;
// }
// const ImageUploaderUppy = ({ onUploaded }: ImageUploadProps) => {
//   const uppyRef = useRef<Uppy.Uppy | null>(null);
//   const [isReady, setIsReady] = useState(false); // Track when uppy is initialized

//   const folderName = `projects`;

//   useEffect(() => {
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
//     const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET!;

//     const uppy = new Uppy({
//       restrictions: {
//         maxNumberOfFiles: 5,
//         allowedFileTypes: ["image/*"],
//       },
//       autoProceed: true,
//     });

//     uppy.setMeta({
//       upload_preset: uploadPreset,
//       folder: folderName,
//     });

//     const uploadedPairs: { original: string; thumbnail: string }[] = [];

//     uppy.use(ThumbnailGenerator, {
//       thumbnailWidth: 300,
//     });

//     uppy.on("file-added", (file) => {
//       uppy.setFileMeta(file.id, {
//         original_size: file.size,
//         file_type: file.type,
//       });
//     });

//     uppy.use(XHRUpload, {
//       endpoint: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       formData: true,
//       fieldName: "file",
//       method: "POST",
//       allowedMetaFields: ["upload_preset", "folder"],

//       bundle: false,
//     });

//     uppy.on("upload-success", (file, response) => {
//        const originalUrl = response?.body?.secure_url;

//       // Attach to the corresponding object in array
//       const pair = uploadedPairs.find((p) => p.original === "");
//       if (pair) pair.original = originalUrl;
//       else uploadedPairs.push({ original: originalUrl, thumbnail: "" });

//       // Once both original + thumbnail uploaded, emit
//       if (uploadedPairs.every(p => p.original && p.thumbnail)) {
//         onUploaded(uploadedPairs);
//       }
//     });

//     uppy.on("thumbnail:generated", async (file, preview) => {
//       const blob = await fetch(preview).then(res => res.blob());

//       const formData = new FormData();
//       formData.append("file", blob, `thumb-${file.name}`);
//       formData.append("upload_preset", uploadPreset);
//       formData.append("folder", `${folderName}/thumbnails`);

//       const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       const thumbnailUrl = data.secure_url;

//       const pair = uploadedPairs.find((p) => p.thumbnail === "");
//       if (pair) pair.thumbnail = thumbnailUrl;
//       else uploadedPairs.push({ original: "", thumbnail: thumbnailUrl });

//       // Once both original + thumbnail uploaded, emit
//       if (uploadedPairs.every(p => p.original && p.thumbnail)) {
//         onUploaded(uploadedPairs);
//       }
//     });

//     uppyRef.current = uppy;
//     setIsReady(true); // Now safe to render Dashboard

//     return () => {
//       uppy.destroy(); // clean up
//     };
//   }, []);

//   return isReady && uppyRef.current ? (
//     <Dashboard
//       theme="dark"
//       uppy={uppyRef.current}
//       proudlyDisplayPoweredByUppy={false}
//     />
//   ) : null;
// };

// export default ImageUploaderUppy;

"use client";

import React, { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

interface ImageUploadProps {
  onUploaded: (data: { original: string; thumbnail: string }[]) => void;
}

const ImageUploaderUppy = ({ onUploaded }: ImageUploadProps) => {
  const uppyRef = useRef<Uppy.Uppy | null>(null);
  const [isReady, setIsReady] = useState(false);

  const folderName = "projects";
  const uploadMap = useRef<
    Record<
      string, // file.id
      { original?: string; thumbnail?: string }
    >
  >({});
  const uploadedThumbnails = useRef<Set<string>>(new Set());

  useEffect(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET!;

    const uppy = new Uppy({
      restrictions: {
        maxNumberOfFiles: 5,
        allowedFileTypes: ["image/*"],
      },
      autoProceed: true,
    });

    uppy.setMeta({
      upload_preset: uploadPreset,
      folder: folderName,
    });

    uppy.use(ThumbnailGenerator, {
      thumbnailWidth: 300,
    });

    uppy.on("file-added", (file) => {
      uppy.setFileMeta(file.id, {
        original_size: file.size,
        file_type: file.type,
      });
      uploadMap.current[file.id] = {};
    });

    uppy.use(XHRUpload, {
      endpoint: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData: true,
      fieldName: "file",
      method: "POST",
      allowedMetaFields: ["upload_preset", "folder"],
      bundle: false,
    });

    uppy.on("upload-success", (file, response) => {
      const originalUrl = response?.body?.secure_url;
      if (file?.id && originalUrl) {
        uploadMap.current[file.id].original = originalUrl;
        maybeEmitAllUploaded();
      }
    });

    uppy.on("thumbnail:generated", async (file, preview) => {
      if (uploadedThumbnails.current.has(file.id)) {
        // Already uploaded thumbnail for this file, ignore
        return;
      }
      uploadedThumbnails.current.add(file.id);
      try {
        const blob = await fetch(preview).then((res) => res.blob());

        const formData = new FormData();
        formData.append("file", blob, `thumb-${file.id}-${file.name}`);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", `${folderName}/thumbnails`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();

        if (file?.id && data.secure_url) {
          uploadMap.current[file.id].thumbnail = data.secure_url;
          maybeEmitAllUploaded();
        }
      } catch (err) {
        console.error("Thumbnail upload failed:", err);
      }
    });

    function maybeEmitAllUploaded() {
      const allDone = Object.values(uploadMap.current).every(
        (pair) => pair.original && pair.thumbnail
      );

      if (allDone) {
        const result = Object.values(uploadMap.current) as {
          original: string;
          thumbnail: string;
        }[];
        onUploaded(result);
      }
    }

    uppyRef.current = uppy;
    setIsReady(true);

    return () => {
      uppy.close();
    };
  }, []);

  return isReady && uppyRef.current ? (
    <Dashboard
      theme="dark"
      uppy={uppyRef.current}
      proudlyDisplayPoweredByUppy={false}
    />
  ) : null;
};

export default ImageUploaderUppy;
