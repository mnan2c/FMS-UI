import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function login(item) {
  const { name, password } = item;
  const option = {
    method: 'POST',
    body: item,
  };
  return request(`/api/user/login?name=${name}&password=${password}`, option);
}

export async function register(item) {
  const { name, password } = item;
  const option = {
    method: 'POST',
    body: item,
  };
  return request(`/api/user/register?name=${name}&password=${password}`, option);
}
