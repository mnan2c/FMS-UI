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
      { path: '/', redirect: '/plan'},
      {
        path: '/plan',
        name: 'plan',
        icon: 'schedule',
        // authority: ['admin'],
        component: '../pages/Plan/Plan',
      },
      {
        path: '/users',
        name: 'user',
        icon: 'user',
        authority: ['admin'],
        component: '../pages/User',
      },
      {
        path: '/notice',
        name: 'notice',
        icon: 'sound',
        authority: ['admin'],
        component: '../pages/Notice',
      },
      {
        path: '/cee',
        name: 'cee',
        icon: 'form',
        authority: ['admin'],
        component: '../pages/CEE',
      },
    ],
  },
];
