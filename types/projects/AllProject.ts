export type AllProjects = Projects[]

export interface Projects {
  id: number
  created_at: string
  title: string
  description: Description[]
  seo_title: string
  seo_description: SeoDescription[]
  background: string
  project_tech_stack: ProjectTechStack[]
  project_images: ProjectImage[]
  project_bullet_points: ProjectBulletPoint[]
}

export interface Description {
  type: string
  children: Children[]
}

export interface Children {
  bold: boolean
  code: boolean
  text: string
  italic: boolean
  underline: boolean
}

export interface SeoDescription {
  type: string
  children: Children2[]
}

export interface Children2 {
  bold: boolean
  code: boolean
  text: string
  italic: boolean
  underline: boolean
}

export interface ProjectTechStack {
  tech_name: string
  project_id: number
}

export interface ProjectImage {
  image_url: string
  project_id: number
  thumbnail_url: string
}

export interface ProjectBulletPoint {
  project_id: number
  bullet_point: string
}
