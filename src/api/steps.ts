import type {
  CreateStepRequest,
  ListStepsResponse,
  RepositionStepsRequest,
  StepResponse,
  UpdateStepRequest,
} from '@/types/api';

import { api } from './client';

export function listSteps(projectId: string): Promise<ListStepsResponse> {
  return api.get(`v1/projects/${projectId}/steps`).json<ListStepsResponse>();
}

export function getStep(projectId: string, id: string): Promise<StepResponse> {
  return api.get(`v1/projects/${projectId}/steps/${id}`).json<StepResponse>();
}

export async function createStep(projectId: string, data: CreateStepRequest): Promise<void> {
  await api.post('v1/steps', { json: { ...data, project_id: projectId } });
}

export async function updateStep(
  _projectId: string,
  id: string,
  data: UpdateStepRequest,
): Promise<void> {
  await api.put(`v1/steps/${id}`, { json: data });
}

export async function deleteStep(_projectId: string, id: string): Promise<void> {
  await api.delete(`v1/steps/${id}`);
}

export async function repositionSteps(
  projectId: string,
  data: RepositionStepsRequest,
): Promise<void> {
  await api.put('v1/steps/reposition', { json: { ...data, project_id: projectId } });
}
