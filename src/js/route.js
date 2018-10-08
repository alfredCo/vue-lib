import VueRouter from 'vue-router';
import Vue from 'vue';
import GLOBALDATA from './globalSetting'


Vue.component('side-menu', {
  data: function () {
    return {
      count: 0,
      sideMenu: {
        sideMenuList: GLOBALDATA.ADMIN_MENU, //当前左侧菜单数据
        activeSubMenu: "", //当前左侧菜单打开的二级菜单的位置
        sideMentTitle: "", //当前左侧菜单标题
        subMenuTitle: "", //当前页面在右侧显示的标题
        menuKeyword: ""
      }
    }
  },
  methods:{
    toggle:function(item){
      if(this.sideMenu.activeSubMenu==item.keywords){
        this.sideMenu.activeSubMenu=false;
      }else{
        this.sideMenu.activeSubMenu=item.keywords;
      }
      console.log(this.sideMenu);
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to,from,next);
  },
  template: `<aside>
    <ul class="menu-level-1">
      <li v-for="item in sideMenu.sideMenuList" v-bind:class="{'has-child':item.child.length>0,'level2-active':sideMenu.activeSubMenu==item.keywords}">
        <router-link v-bind:to="item.href" v-if="item.href" exact-active-class="active" exact>
          <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
        </router-link>
        <a v-if="!item.href" v-on:click="toggle(item)">
          <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
          <i class="icon-arrow"></i>
        </a>
        <ul class="menu-level-2" v-if="item.child.length>0">
          <li v-for="subItem in item.child">
            <router-link v-bind:to="subItem.href" exact-active-class="sub-active" exact>
              <span><i class="pointer"></i>{{subItem.text}}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>`
})


const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Test = { template: '<div><side-menu></side-menu><router-view class="main-content"></router-view></div>' }
const Too = { template: '<div>Too</div>' }
const Tar = { 
  template: `<div>{{ao}}</div>`,
  data:function(){
    return{
      ao:"ddd"
    }
  }
}
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    {
      path:"/",
      component:Test,
      children: [
          {
            path: '/user/usermanage',
            component: Tar
          },
          {
            path: '/project/promanage',
            component: Too
          },
          {
            path:'/cluster/clusterview',
            component:Tar
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
