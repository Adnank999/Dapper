"use server";

import { createClient } from "../server";

export async function createProject(formData: any) {
  const supabase = await createClient();

  // Extracting form data
  const data = {
    title: formData.title,
    description: formData.description,
    seo_title: formData.seo_title,
    seo_description: formData.seo_description,
    tech_name: formData.tech_name, // Assuming this is a string
    bullet_point: formData.bullet_point, // Already an array
    image_url: formData.image_url, // This should match the state
  };

  // Insert project into the database
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .insert([
      {
        title: data.title,
        description: data.description,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
      },
    ])
    .select();

  if (projectError) {
    console.error("Error creating project:", projectError);
    throw new Error("Failed to create project");
  }

  //   // Get the project ID of the newly created project
  const projectId = projectData[0].id;

  const imageInsertPromises = formData.image_url.map(
    async (imagePair: { original: string; thumbnail: string }) => {
      const { error: imageError } = await supabase
        .from("project_images")
        .insert([
          {
            project_id: projectId, // Use the project_id from above
            image_url: imagePair.original,
            thumbnail_url: imagePair.thumbnail,
          },
        ]);

      if (imageError) {
        console.error("Error inserting image URL:", imageError);
      }
    }
  );

  await Promise.all(imageInsertPromises);

  console.log("Project created and images uploaded successfully");

  // Insert bullet points into the project_bullet_points table
  if (data.bullet_point.length > 0) {
    const bulletPointData = data.bullet_point.map((point) => ({
      project_id: projectId,
      bullet_point: point,
    }));

    const { error: bulletPointError } = await supabase
      .from("project_bullet_points")
      .insert(bulletPointData);

    if (bulletPointError) {
      console.error("Error inserting bullet points:", bulletPointError);
      throw new Error("Failed to insert bullet points");
    }
  }

  // Insert tech stack into the project_tech_stack table
  if (data.tech_name) {
    const techStackData = data.tech_name.map((tech: string) => ({
      project_id: projectId,
      tech_name: tech.trim(), // Always good to trim input
    }));
    const { error: techError } = await supabase
      .from("project_tech_stack")
      .insert(techStackData);

    if (techError) {
      console.error("Error inserting tech stack:", techError);
      throw new Error("Failed to insert tech stack");
    }
  }

  return { success: true };
}
