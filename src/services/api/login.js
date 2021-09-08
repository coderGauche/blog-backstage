import { request } from 'umi';

export async function getEmail(data, options) {
  console.log('获取传的参数',data);
  return request('/api/user/email', {
    method: 'POST',
    data: { ...data },
    ...(options || {}),
  });
}

export async function login(params, options) {
  return request('/api/login/captcha', {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}