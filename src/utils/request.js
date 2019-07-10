/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// import { extend } from 'umi-request';
import { message } from 'antd';
import fetch from 'dva/fetch';
import _ from 'lodash';
import router from 'umi/router';
import { getCookie, clearCookie } from './utils';

// const apiRootUrl = 'http://106.14.215.64:8888';
const apiRootUrl = 'http://localhost:8888';
// process.env.NODE_ENV === 'development'
//   ? process.env.WEBAPP_BACKEND_URL
//   : '@@WEBAPP-BACKEND-URL@@';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// /**
//  * 异常处理程序
//  */
// const errorHandler = error => {
//   const { response = {} } = error;
//   const errortext = codeMessage[response.status] || response.statusText;
//   const { status, url } = response;
//
//   notification.error({
//     message: `请求错误 ${status}: ${url}`,
//     description: errortext,
//   });
// };
//
// /**
//  * 配置request请求时的默认参数
//  */
// const request = extend({
//   errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie
// });
//
// export default request;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option, { redirect404 = false, noPreProcess = false } = {}) {
  if (apiRootUrl) {
    url = apiRootUrl + url;
  }
  const options = {
    // expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  // const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  // const hashcode = hash
  //   .sha256()
  //   .update(fingerprint)
  //   .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  // const accessToken = getCookie('secondary_access_token') || getCookie('access_token');
  // if (accessToken) {
  // newOptions.headers = {
  //   Authorization: includeAuth ? `Bearer ${accessToken}` : '',
  //   ...newOptions.headers,
  // };
  if (!getCookie('access_token')) {
    router.push('/user/login');
  }
  newOptions.headers = {
    Authorization: getCookie('access_token'),
    ...newOptions.headers,
  };
  // }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        // do not add content-type to formdata
        // fetch will handle this automatically
        ...newOptions.headers,
      };
    }
  }

  // const expirys = options.expirys && 60;
  // // options.expirys !== false, return the cache,
  // if (options.expirys !== false) {
  //   const cached = sessionStorage.getItem(hashcode);
  //   const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
  //   if (cached !== null && whenCached !== null) {
  //     const age = (Date.now() - whenCached) / 1000;
  //     if (age < expirys) {
  //       const response = new Response(new Blob([cached]));
  //       return response.json();
  //     }
  //     sessionStorage.removeItem(hashcode);
  //     sessionStorage.removeItem(`${hashcode}:timestamp`);
  //   }
  // }
  return (
    fetch(url, newOptions)
      // .then(checkStatus(suppressError))
      // .then(response => cachedSave(response, hashcode))
      .then(response => {
        const { status } = response;
        if (status === 401) {
          message.error('用户名或密码错误！');
          clearCookie('access_token');
          router.push('/user/login');
        }
        if (noPreProcess) {
          return response;
        }
        const responseType = response.headers.get('content-type');
        if (responseType && responseType.includes('application/json')) {
          return response.json();
        }
        return response.text();
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          router.push('/user/login');
          return;
        }
        // environment should not be used
        if (status === 403) {
          router.push('/exception/403');
          return;
        }
        // if (status <= 504 && status >= 500) {
        //   router.push("/exception/500");
        //   return;
        // }
        if (status >= 405 && status < 422) {
          router.push('/exception/404');
          return;
        }

        // default 404 will only show exception message
        // special param to redirect to 404 page
        if (status === 404 && redirect404) {
          router.push('/404');
          return;
        }
        throw e;
      })
  );
}
