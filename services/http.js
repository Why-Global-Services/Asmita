import { API_BASE_URL } from '../utils/constants';

export async function request(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? `?${new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))}`
    : '';

  const res = await fetch(`${API_BASE_URL}${path}${query}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errMessage = `API Error ${res.status}`;
    try {
      const errData = await res.json();
      if (errData && errData.message) errMessage = errData.message;
    } catch {}
    throw new Error(errMessage);
  }

  const json = await res.json();
  return json;
}
