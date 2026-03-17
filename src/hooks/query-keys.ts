export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  steps: {
    all: (projectId: string) => ['projects', projectId, 'steps'] as const,
  },
  items: {
    all: (projectId: string, stepId: string) =>
      ['projects', projectId, 'steps', stepId, 'items'] as const,
  },
};
