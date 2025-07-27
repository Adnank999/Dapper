"use server";

import { createClient } from "../server"; // Assuming createClient is already defined

// Define an async function to get all projects
export async function getAllProjects() {
  const supabase = await createClient(); // Initialize Supabase client

  try {
    // Fetch all projects from the 'projects' table, including related data from other tables
    const { data: allProjects, error } = await supabase
      .from("projects") // The main table
      .select(`
        *, 
        project_tech_stack (
          project_id,
          tech_name
        ),
        project_images (
          project_id,
          image_url,
          thumbnail_url
        ),
        project_bullet_points (
          project_id,
          bullet_point
        )
      `);

    if (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }

    return allProjects; // Return the fetched projects
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
