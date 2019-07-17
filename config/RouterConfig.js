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
      { path: '/', redirect: '/plan/signin'},
      {
        path: '/plan',
        name: 'plan',
        icon: 'schedule',
        routes: [{
          path: '/plan/signin',
          name: 'signin',
          component: '../pages/Plan/Signin',
        },{
          path: '/plan/short-term',
          name: 'short-term',
          component: '../pages/Plan/Plan',
        },{
          path: '/plan/long-term',
          name: 'long-term',
          component: '../pages/Plan/Plan',
        }],
        // authority: ['admin'],
      },
      {
        path: '/users',
        name: 'user',
        icon: 'user',
        authority: ['admin'],
        component: '../pages/User',
      },
      // {
      //   path: '/notice',
      //   name: 'notice',
      //   icon: 'sound',
      //   authority: ['admin'],
      //   component: '../pages/Notice',
      // },
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
