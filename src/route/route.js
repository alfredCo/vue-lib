import VueRouter from 'vue-router';
import Vue from 'vue';
import axios from 'axios';
import sideMenu from '../component/side.vue';
import userManage from '../page/usermanage/usermanage.vue';
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Test = { components: { sideMenu },template: '<div><sideMenu></sideMenu><router-view class="main-content"></router-view></div>' }
const Too = { template: '<div>Too</div>' }
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    {
      path:"/",
      component:Test,
      children: [
          {
            path: '/user/usermanage',
            component: userManage
          },
          {
            path: '/project/promanage',
            component: Too
          },
          {
            path:'/cluster/clusterview',
            component:userManage
          }
      ]
    }
  ]
  
  // 3. 创建 router 实例，然后传 `routes` 配置
  // 你还可以传别的配置参数, 不过先这么简单着吧。
  const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
  })
  export {router}
