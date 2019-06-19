import request from '@/utils/request';

export async function createPlan(item) {
  const option = {
    method: 'POST',
    body: item,
  };
  return request('/api/plans', option);
}

export async function getPlans(pagination) {
  const { current, pageSize } = pagination;
  return request(`/api/plans?page=${current}&size=${pageSize}`);
}

export async function deletePlan(id) {
  return request(`/api/plans/${id}`, { method: 'DELETE' });
}
