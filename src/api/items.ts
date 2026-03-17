import type {
  CreateItemRequest,
  ItemResponse,
  ListItemsResponse,
  RepositionItemsRequest,
  UpdateItemRequest,
} from '@/types/api';

import { api } from './client';

export function listItems(projectId: string, stepId: string): Promise<ListItemsResponse> {
  return api.get(`v1/projects/${projectId}/steps/${stepId}/items`).json<ListItemsResponse>();
}

export function getItem(projectId: string, stepId: string, id: string): Promise<ItemResponse> {
  return api.get(`v1/projects/${projectId}/steps/${stepId}/items/${id}`).json<ItemResponse>();
}

export function createItem(
  _projectId: string,
  stepId: string,
  data: CreateItemRequest,
): Promise<ItemResponse> {
  return api.post('v1/items', { json: { ...data, step_id: stepId } }).json<ItemResponse>();
}

export async function updateItem(
  _projectId: string,
  _stepId: string,
  id: string,
  data: UpdateItemRequest,
): Promise<void> {
  await api.put(`v1/items/${id}`, { json: data });
}

export async function deleteItem(_projectId: string, _stepId: string, id: string): Promise<void> {
  await api.delete(`v1/items/${id}`);
}

export async function repositionItems(
  _projectId: string,
  stepId: string,
  data: RepositionItemsRequest,
): Promise<void> {
  await api.put('v1/items/reposition', { json: { ...data, step_id: stepId } });
}
