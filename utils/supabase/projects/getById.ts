"use server";

import { cache } from "react";
import { createClient } from "../server";

export async function getById (projectId) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('projects')  // Assuming the table name is 'projects'
         .select(`
        *, 
        project_tech_stack (
          project_id,
          tech_name
        ),
        project_images (
          id,
          project_id,
          image_url,
          thumbnail_url
        ),
        project_bullet_points (
          project_id,
          bullet_point
        )
      `)
      .eq('id', projectId)  // Assuming 'id' is the column name
      .single();         // This will return a single project

    if (error) {
      throw new Error(`Error fetching project with ID ${projectId}: ${error.message}`);
    }

    return data;  // Return the fetched project data
  } catch (error) {
    console.error("Error in getById:", error);
    throw error;
  }
}


