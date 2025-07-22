"use client";
import React, { useState } from "react";

import { createProject } from "@/utils/supabase/projects/create";
import { useUser } from "@/app/context/UserContext";
import ImageUpload from "./ImageUpload";

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
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="relative w-full max-w-md p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-center text-white">
          Create Your Project
        </h2>
        <p className="text-center text-gray-200/80 mb-4">
          Fill in the details below
        </p>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label
              className="block text-white/90 text-sm font-medium"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full h-10 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label
              className="block text-white/90 text-sm font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full h-24 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label
              className="block text-white/90 text-sm font-medium"
              htmlFor="seo_title"
            >
              SEO Title
            </label>
            <input
              type="text"
              name="seo_title"
              id="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              className="w-full h-10 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
              placeholder="Enter SEO title"
            />
          </div>

          <div>
            <label
              className="block text-white/90 text-sm font-medium"
              htmlFor="seo_description"
            >
              SEO Description
            </label>
            <textarea
              name="seo_description"
              id="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
              className="w-full h-24 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
              placeholder="Enter SEO description"
            />
          </div>

          <ImageUpload
            setImageUrl={(url) =>
              setFormData((prev) => ({ ...prev, image_url: url }))
            }
          />

          <div>
            <label
              className="block text-white/90 text-sm font-medium"
              htmlFor="tech_name"
            >
              Tech Name
            </label>
            <input
              type="text"
              name="tech_name"
              id="tech_name"
              value={formData.tech_name}
              onChange={handleChange}
              className="w-full h-10 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
              placeholder="Enter technology name"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium">
              Bullet Points
            </label>
            {formData.bullet_point.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) =>
                    handleBulletPointChange(index, e.target.value)
                  }
                  className="flex-1 h-10 px-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300/60 focus:bg-white/30 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 rounded"
                  placeholder={`Bullet Point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeBulletPoint(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBulletPoint}
              className="mt-2 text-blue-400"
            >
              Add Bullet Point
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
