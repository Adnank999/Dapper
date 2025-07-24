"use client";
import React, { useState } from "react";

import { createProject } from "@/utils/supabase/projects/create";
import { useUser } from "@/app/context/UserContext";
import ImageUpload from "./ImageUpload";
import RichTextModal from "./RichTextModal";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    seo_title: "",
    seo_description: "",
    tech_name: "", // Changed to string
    bullet_point: [""],
    image_url: "",
  });
  const [modalType, setModalType] = useState<"description" | "seo" | null>(
    null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletPointChange = (index, value) => {
    const updatedBulletPoints = [...formData.bullet_point];
    updatedBulletPoints[index] = value;
    setFormData((prev) => ({ ...prev, bullet_point: updatedBulletPoints }));
  };

  const addBulletPoint = () => {
    setFormData((prev) => ({
      ...prev,
      bullet_point: [...prev.bullet_point, ""],
    }));
  };

  const removeBulletPoint = (index) => {
    const updatedBulletPoints = formData.bullet_point.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, bullet_point: updatedBulletPoints }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await createProject(formData); // Ensure createProject handles the formData correctly
    console.log(response);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-background text-white">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Your Project
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Fill in the details below
        </p>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Row 1: Title + SEO Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                SEO Title
              </label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter SEO title"
              />
            </div>
          </div>

          {/* Row 2: Description + SEO Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              {/* <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter description"
              /> */}

              <button
                type="button"
                onClick={() => setModalType("description")}
                className="w-full h-10 px-3 bg-white/10 text-left border border-white/30 rounded-lg text-gray-300 hover:ring-2 hover:ring-red-400 transition"
              >
                {formData.description ? "Edit Description" : "Add Description"}
              </button>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                SEO Description
              </label>
              {/* <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter SEO description"
              /> */}

              <button
                type="button"
                onClick={() => setModalType("seo")}
                className="w-full h-10 px-3 bg-white/10 text-left border border-white/30 rounded-lg text-gray-300 hover:ring-2 hover:ring-red-400 transition"
              >
                {formData.seo_description
                  ? "Edit SEO Description"
                  : "Add SEO Description"}
              </button>
            </div>
          </div>

          {/* Row 3: Tech Name + Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Tech Name
              </label>
              <input
                type="text"
                name="tech_name"
                value={formData.tech_name}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter tech name"
              />
            </div>
            <div>
              <ImageUpload
                setImageUrl={(url) =>
                  setFormData((prev) => ({ ...prev, image_url: url }))
                }
              />
            </div>
          </div>

          {/* Row 4: Bullet Points */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Bullet Points
            </label>
            <div className="space-y-2">
              {formData.bullet_point.map((point, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) =>
                      handleBulletPointChange(index, e.target.value)
                    }
                    className="flex-1 h-10 px-3 bg-white/10 border border-white/30 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    placeholder={`Point ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBulletPoint(index)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBulletPoint}
                className="text-blue-400 hover:text-blue-500 transition"
              >
                + Add Bullet Point
              </button>
            </div>
          </div>

          <RichTextModal
            title={
              modalType === "description"
                ? "Edit Description"
                : "Edit SEO Description"
            }
            open={modalType !== null}
            onClose={() => setModalType(null)}
            initialValue={
              modalType === "description"
                ? formData.description
                : formData.seo_description
            }
            onSave={(value) =>
              setFormData((prev) => ({
                ...prev,
                [modalType === "description"
                  ? "description"
                  : "seo_description"]: value,
              }))
            }
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
