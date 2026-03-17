export type ItemPriority = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface ListProjectsResponse {
  total: number;
  results: ProjectResponse[];
}

export interface StepResponse {
  id: string;
  project_id: string;
  name: string;
  position: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStepRequest {
  name: string;
  position?: number;
}

export interface UpdateStepRequest {
  name?: string;
  position?: number;
  is_completed?: boolean;
}

export interface ListStepsResponse {
  total: number;
  results: StepResponse[];
}

export interface RepositionStepsRequest {
  steps: Array<{ id: string; position: number }>;
}

export interface ItemResponse {
  id: string;
  step_id: string;
  name: string;
  description?: string;
  priority: ItemPriority;
  is_completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  priority?: ItemPriority;
  position?: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  priority?: ItemPriority;
  is_completed?: boolean;
  position?: number;
  step_id?: string;
}

export interface ListItemsResponse {
  total: number;
  results: ItemResponse[];
}

export interface RepositionItemsRequest {
  items: Array<{ id: string; position: number }>;
}
