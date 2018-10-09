import VueRouter from 'vue-router';
import Vue from 'vue';
import axios from 'axios';
import sideMenu from './Side.vue';
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


// Vue.component('side-menu', {
//   data: function () {
//     return {
//       count: 0,
//       sideMenu: {
//         sideMenuList: GLOBALDATA.ADMIN_MENU, //当前左侧菜单数据
//         activeSubMenu: "", //当前左侧菜单打开的二级菜单的位置
//         sideMentTitle: "", //当前左侧菜单标题
//         subMenuTitle: "", //当前页面在右侧显示的标题
//         menuKeyword: ""
//       }
//     }
//   },
//   methods:{
//     toggle:function(item){
//       if(this.sideMenu.activeSubMenu==item.keywords){
//         this.sideMenu.activeSubMenu=false;
//       }else{
//         this.sideMenu.activeSubMenu=item.keywords;
//       }
//       console.log(this.sideMenu);
//     }
//   },
//   beforeRouteEnter (to, from, next) {
//     console.log(to,from,next);
//   },
//   template: `<aside>
//     <ul class="menu-level-1">
//       <li v-for="item in sideMenu.sideMenuList" v-bind:class="{'has-child':item.child.length>0,'level2-active':sideMenu.activeSubMenu==item.keywords}">
//         <router-link v-bind:to="item.href" v-if="item.href" exact-active-class="active" exact>
//           <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
//         </router-link>
//         <a v-if="!item.href" v-on:click="toggle(item)">
//           <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
//           <i class="icon-arrow"></i>
//         </a>
//         <ul class="menu-level-2" v-if="item.child.length>0">
//           <li v-for="subItem in item.child">
//             <router-link v-bind:to="subItem.href" exact-active-class="sub-active" exact>
//               <span><i class="pointer"></i>{{subItem.text}}</span>
//             </router-link>
//           </li>
//         </ul>
//       </li>
//     </ul>
//   </aside>`
// })

console.log(sideMenu)
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Test = { components: { sideMenu },template: '<div><sideMenu></sideMenu><router-view class="main-content"></router-view></div>' }
const Too = { template: '<div>Too</div>' }
const Tar = { 
  template: `<div class="page-inner">
    <div class="table-action">
      <div class="pull-left" ng-show="userSwitchSrv.traincluster">
          <button type="button" data-toggle="modal" class="btn btn-primary" ng-click="createTrain()">
              <i class="icon-aw-add-to2"></i>新建训练</button>
          <button type="button" data-toggle="modal" ng-click="stopTrain(checkedItems)" class="btn btn-warning" ng-disabled="!canStopTrain">
              <i class="icon-aw-time-out"></i>停止训练</button>
          <button type="button" data-toggle="modal" ng-click="retraining(checkedItems)" class="btn btn-info" ng-disabled="!canReTrain">
              <i class="icon-aw-repeat"></i>重新训练</button>
          <button type="button" data-toggle="modal" ng-click="subsequentTraining(checkedItems)" class="btn btn-info" ng-disabled="!canSubsequent">
              <i class="icon-aw-start-up"></i>继续训练</button>
          <div class="dropdown">
              <button type="button" class="btn btn-info dropdown-toggle" ng-disabled="!canMoreOpt" data-toggle="dropdown">更多操作
                  <i class="icon-aw-angle-down-1"></i>
              </button>
              <ul class="dropdown-menu">
                  <li>
                      <button ng-click="checkJupyter(checkedItems)" ng-disabled="!canCheckJupyter">查看Jupyter Notebook</button>
                  </li>
                  <li>
                      <button ng-click="checkTensorboard(checkedItems)" ng-disabled="!canCheckTensor">查看TensorBoard</button>
                  </li>
                  <li>
                      <button ng-click="editTrainParams(checkedItems)" ng-disabled="!canEditHyperparameter">编辑超参数</button>
                  </li>
                  <li>
                      <button ng-click="deleteTraining(checkedItems)" ng-disabled="!canDeleteTraining">删除训练</button>
                  </li>
                  <li>
                      <button ng-click="relaseModel(checkedItems)" ng-disabled="!canRealseModel">发布模型</button>
                  </li>
              </ul>
          </div>
      </div>
    </div>
    <div class="table-content">
      <table class="table">
        <tbody>
          <tr v-for="item in imgList">
            <td>{{item.id}}</td>
            <td>{{item.num}}</td>
            <td>{{item.url}}</td>
            <td>{{item.createTime}}</td>
          </tr>
        </tbody>
      </table> 
    </div>
  </div>`,
  data:function(){
    return{
      ao:"ddd",
      imgList:[]
    }
  },
  methods:{
    getData:function(){
      console.log(1234);
      let _this = this
      axios.get('http://172.16.2.100:30093/ailab-manager/v1/front/getPictureInfos').then(function(res){
        console.log(res);
        _this.imgList = res.data;
      })
    }
  },
  created:function(){
    this.getData();
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
