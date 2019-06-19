/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

function setCookie(name, value, expires) {
  let cookie = `${name}=${value}`;
  if (expires) {
    cookie += `; expires=${expires}`;
  }
  document.cookie = cookie;
}

function clearCookie(name) {
  setCookie(name, '');
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  const targetCookie = cookies.map(c => c.trim()).find(c => c.indexOf(name) === 0);
  if (targetCookie) {
    return targetCookie.split('=')[1];
  }
  return '';
}

export { setCookie, clearCookie, getCookie };
