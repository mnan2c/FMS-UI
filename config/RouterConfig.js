export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login'},
      {
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/user/login'},
      {
        path: '/plan',
        name: 'plan',
        component: '../pages/Plan/Plan',
      },
      {
        path: '/users',
        name: 'user',
        component: '../pages/User',
      },
      {
        path: '/notice',
        name: 'notice',
        component: '../pages/Notice',
      },
    ],
  },
];
