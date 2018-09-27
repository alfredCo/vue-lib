import VueRouter from 'vue-router';

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Test = { template: '<div><div><router-link to="/profile">Go to Foo</router-link><router-link to="/posts">Go to Bar</router-link></div><router-view></router-view></div>' }
const Too = { template: '<div>Too</div>' }
const Tar = { template: '<div>Tar</div>' }
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    {
        path:"/",
        component:Test,
        children: [
            {
              // 当 /user/:id/profile 匹配成功，
              // UserProfile 会被渲染在 User 的 <router-view> 中
              path: 'profile',
              component: Too
            },
            {
              // 当 /user/:id/posts 匹配成功
              // UserPosts 会被渲染在 User 的 <router-view> 中
              path: 'posts',
              component: Tar
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
