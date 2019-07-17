import request from '@/utils/request';

export async function saveSigninConfig(item) {
  const option = {
    method: 'POST',
    body: item,
  };
  return request('/api/signinconfig', option);
}

export async function getSigninConfigs(pagination) {
  const { current, pageSize } = pagination;
  return request(`/api/signinconfig?page=${current}&size=${pageSize}`);
}

export async function deleteSigninConfig(id) {
  return request(`/api/signinconfig/${id}`, { method: 'DELETE' });
}

export async function signin(signinConfigId) {
  return request(`/api/signinrecord/signin/${signinConfigId}`, { method: 'POST' });
}

export async function getTodaySigninRecords() {
  return request('/api/signinrecord/today');
}

export async function getLastNDaysRate(pagination) {
  const { current, pageSize } = pagination;
  return request(`/api/signinrate?page=${current}&size=${pageSize}`);
}

export async function getLastSigninRate() {
  return request('/api/signinrate/last');
}
