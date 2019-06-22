import React, { Component } from 'react';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  const urlRegexp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g;
  return urlRegexp.test(path);
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

export function convertStrToUrl(str) {
  const urlRegexp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g;
  const arr = urlRegexp.exec(str);
  const url = arr[0];
  let prefix = '';
  if (str.indexOf(url) > 0) prefix = str.substring(0, str.indexOf(url));
  let suffix = '';
  const prefixAndUrl = prefix + url;
  if (prefixAndUrl.length < str.length) suffix = str.substring(prefixAndUrl.length, str.length);
  return (
    <>
      {prefix}
      <a href={url} target="_blank">
        {url}
      </a>
      {suffix}
    </>
  );
}
