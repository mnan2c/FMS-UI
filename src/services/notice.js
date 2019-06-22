import request from '@/utils/request';

export async function getNotices(pagination) {
  const { current, pageSize } = pagination;
  return request(`/api/notice?page=${current}&size=${pageSize}`);
}

export async function createNotice(item) {
  const option = {
    method: 'POST',
    body: item,
  };
  return request('/api/notice', option);
}

export async function deleteItem(id) {
  return request(`/api/notice/${id}`, { method: 'DELETE' });
}
