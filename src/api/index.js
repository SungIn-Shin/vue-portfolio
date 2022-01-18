import axios from 'axios';
import { setInterceptors } from './common/interceptors';

function createInstance() {
  const baseURL = process.env.VUE_APP_API_URL;
  return axios.create({
    baseURL: baseURL,
  });
}

// 액시오스 초기화 함수
function createInstanceWithAuth(url) {
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_API_URL}${url}`,
  });
  return setInterceptors(instance);
}

export const instance = createInstance();
export const posts = createInstanceWithAuth('posts');

// CREATE - posts
// POST - posts
// PUT - posts {id}
// DELETE - posts {id}
