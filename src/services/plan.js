import request from '@/utils/request';

export async function savePlan(item, isCreate) {
  const method = isCreate ? 'POST' : 'PUT';
  const option = {
    method,
    body: item,
  };
  return request('/api/plans', option);
}

export async function getPlans(pagination) {
  const { current, pageSize, status } = pagination;
  return request(`/api/plans/page?page=${current}&size=${pageSize}&status=${status}`);
}

export async function deletePlan(id) {
  return request(`/api/plans/${id}`, { method: 'DELETE' });
}

export async function completePlan(id) {
  const option = {
    method: 'PUT',
    body: {},
  };
  return request(`/api/plans/complete/${id}`, option);
}
