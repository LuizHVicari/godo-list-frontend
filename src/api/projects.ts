import type {
  CreateProjectRequest,
  ListProjectsResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from '@/types/api';

import { api } from './client';

export function listProjects(): Promise<ListProjectsResponse> {
  return api.get('v1/projects').json<ListProjectsResponse>();
}

export function getProject(id: string): Promise<ProjectResponse> {
  return api.get(`v1/projects/${id}`).json<ProjectResponse>();
}

export async function createProject(data: CreateProjectRequest): Promise<void> {
  await api.post('v1/projects', { json: data });
}

export async function updateProject(id: string, data: UpdateProjectRequest): Promise<void> {
  await api.put(`v1/projects/${id}`, { json: data });
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`v1/projects/${id}`);
}
