let componentModule = angular.module("componentModule", []);
//下拉控制table栏的指令
componentModule.directive("setting", [function(){
    return {
        restrict: "E",
        scope:{
            titleData:"=",
            siteTitle:"=",
            searchTearm:"&",
            tableData:"="
        },
        template:`<div class='dropdown show-title'>
                    <button type='button' class='btn btn-renovat dropdown-toggle'>
                      <i class='icon-aw-gear'></i>
                    </button>
                    <ul class='dropdown-menu'>
                        <li ng-repeat='title in titleData track by $index' ng-if="!title.isShow">
                          <div class='checkbox'>
                            <label>
                               <input type='checkbox' ng-model='title.value' ng-change='isShowTitle($index,title)' ng-disabled='title.disable'/>
                               <i class='iconfont'></i>
                               <span>{{'cn.'+title.name|translate}}</span>
                            </label>
                          </div>
                        </li>
                    </ul>
                  </div>`,
        link: function(scope,ele){
            $(ele).find(".dropdown-toggle").on("click",function(e){
                $(this).parent().toggleClass("open");
                e.stopPropagation();
                e.preventDefault();
            });
            $(ele).find(".dropdown-menu").on("click",function(e){
                if(e.target.className=="checkbox"||$(e.target).closest(".checkbox").length>0){e.stopPropagation();}
            });
            $("html").on("click",function(e){
                $(ele).find(".dropdown").removeClass("open");
            });
            //第一次进来没有数据
            if(!sessionStorage[scope.siteTitle]&&scope.siteTitle!=undefined){
                sessionStorage.setItem(scope.siteTitle,JSON.stringify(scope.titleData));
            }
            scope.isShowTitle=function(index,title){
                var postData = {
                    tableData:scope.tableData,
                    titleData:scope.titleData
                };
                var currentSession=JSON.parse(sessionStorage[scope.siteTitle]);
                currentSession[index].value=title.value;
                sessionStorage.setItem(scope.siteTitle,JSON.stringify(currentSession));
                if(scope.tableData){
                    scope.searchTearm({obj:postData});
                }
            };
        }
    };
}]);

componentModule.directive("emptyTip", ["$translate",function(translate){
    return {
        restrict: "EA",
        scope:{
            "emptyType":"=",
            "tipId":"="
        },
        link: function(scope, element){
            var p = document.createElement("div");
            p.id = scope.tipId || "tip-msg";
            var ele = element[0].parentNode.getElementsByTagName("tbody")[0];

            var setEmptyTip = function(){
                if(!document.getElementById(p.id)){
                    element[0].parentNode.appendChild(p);
                }
                document.getElementById(p.id).innerHTML = translate.instant("cn.common.empty");
            };

            scope.$watch(function(){
                return ele.getElementsByTagName("tr").length;
            },function(len){
                if(len){
                    if(document.getElementById(p.id)){
                        document.getElementById(p.id).innerHTML= "";
                        $("#"+p.id).addClass("hide");
                    }
                }else{
                    if(scope.emptyType && ele.getElementsByTagName("tr").length==0){
                        setEmptyTip();
                    }
                    $("#"+p.id).removeClass("hide");
                }
            });

            scope.$watch(function(){
                return scope.emptyType;
            },function(val) {
                if(val && ele.getElementsByTagName("tr").length==0){
                    setEmptyTip();
                }
            });
        }
    };
}]);

//用户切换的指令
componentModule.directive("userSwitchSelect", ["$http", "$rootScope", "$route", "globalMenuModule", "userSwitchSrv","$location", function($http, rootScope, $route, globalMenuModule, userSwitchSrv,$location) {
    return {
        restrict: "EA",
        scope: true,
        template: `<div class="user-list" ng-show = "userListShow">
                    <ui-select ng-model="userModel.selected"  ng-change="changeUser(userModel.selected)" ng-disabled="userListDisabled">
                        <ui-select-match placeholder='{{"cn.usermanage.placeholder.selectUser"|translate}}' title="{{$select.selected.userName}}">
                            {{$select.selected.userName}}
                        </ui-select-match>
                        <ui-select-choices repeat="user in userList | filter:{userName:$select.search}">
                            <div ng-bind-html="user.userName | highlight: $select.search" title="{{user.userName}}" class="ui-select-item-ellips"></div>
                        </ui-select-choices>
                    </ui-select>
                  </div>`,
        replace: true,
        link: function(scope, elem, attr) {
            var self = scope;
            self.userListDisabled = false;
            self.userListShow = false;
            function getUserList(){
                self.userModel = {
                    selected: ""
                };
                $http({
                    method: "GET",
                    url: "/user-manager/v1/projects"
                }).then(function(result) {
                    if(result && result.code == "0") {
                        self.userList = result.data.data;
                        self.userList.forEach(item=>{
                            item.userID = item.id;//项目id --> 用户id
                            item.userName = item.name; //项目名称 --> 用户名称
                        })
                        //暂存所有项目列表
                        rootScope.templateUserList = angular.copy(self.userList);
                        self.isAllUsersExist = false;
                        if ($route.current.active == "resourceview") {
                            //如果在资源概况页面，如果项目列表中有全部项目则去掉
                            for (var i = 0;i < self.userList.length;i++) {
                                if (self.userList[i].userID == "allUsers" ) {
                                    self.userList.splice(i, 1);
                                    break;
                                }
                            }
                        } else {
                            //判断是否有全部项目这一项
                            for (var i = 0;i < self.userList.length;i++) {
                                if (self.userList[i].userID == "allUsers" ) {
                                    self.isAllUsersExist = true;
                                    break;
                                }
                            }
                            //如果不在资源概况页面 且是管理员则添加全部项目
                            if (!self.isAllUsersExist&&localStorage.roleName == "admin") {
                                self.userList.unshift({userID: "allUsers", userName: "全部项目"});
                            }
                        }
                        handleProject(self,localStorage,$location,rootScope);
                        userSwitch(self.userModel.selected.userID)
                    }
                });
            }
            function handleProject(self,localStorage,$location,rootScope){
                if (localStorage.selectedUserId) {
                    self.userList.forEach(item=>{
                        if(item.userID == localStorage.selectedUserId){
                            self.userModel.selected = item;
                        }
                    });
                } else {
                    //如果本地没有选中项目，则取第一个为默认值
                    self.userModel.selected = self.userList[0];
                    localStorage.selectedUserId = self.userList[0].userID;
                    localStorage.selectedUserName = self.userList[0].userName;
                    self.userList.forEach((item)=>{
                        //如果是admin用户则选中admin项目
                        if(item.userName == 'admin'){
                            self.userModel.selected = item;
                            localStorage.selectedUserId = item.userID;
                            localStorage.selectedUserName = item.userName;
                        }
                        //如果是普通用户则选中普通用户所在默认项目
                        if(item.userID == localStorage.projectId){
                            self.userModel.selected = item;
                            localStorage.selectedUserId = item.userID;
                            localStorage.selectedUserName = item.userName;
                        }
                    });
                }
            }

            self.changeUser = function(userData) {
                self.userListDisabled = true;
                $http({
                    method: "PUT",
                    //url: "/user-manager/v1/users/" + userData.userID
                    url: "/user-manager/v1/projects/"+userData.userID+"/switch"
                }).then(function(result) {
                    self.userListDisabled = false;
                    userSwitch(userData.userID);
                    localStorage.selectedUserId = userData.userID;
                    localStorage.selectedUserName = userData.userName;
                    $route.reload();
                }).finally(function(){
                    self.userListDisabled = false;
                });
            }
            if ($location.url()!=""&&$location.url()!="/") {
                getUserList();
                self.userListShow = true;
            }
            function userSwitch(userId) {
                var key = $route.current.active;
                if(userId == "allUsers") {
                    userSwitchSrv[key] = false;
                }else {
                    userSwitchSrv[key] = true;
                }
            }
            self.$on('$routeChangeSuccess',function(event, current, prev){
                if (current && current.userSwitch) {
                    self.userListShow = true;
                    //刷新页面或者从没有下拉框切换到有下拉框的页面，重新获取项目列表
                    if((prev && !prev.userSwitch) || !prev) {
                        getUserList();
                    }
                    if(localStorage.isAdmin == "true") {
                        if (prev) {
                            if(current.active == "resourceview") {
                                if (localStorage.selectedUserId == "allUsers") {
                                    self.userList.forEach(item=>{
                                        if(item.userName == "admin"){
                                            self.userModel.selected = item;
                                            localStorage.selectedUserId = item.userID;
                                            localStorage.selectedUserName = item.userName;
                                            $http({
                                                method: "PUT",
                                                //url: "/user-manager/v1/users/" + item.userID
                                                url: "/user-manager/v1/projects/"+item.userID+"/switch"
                                            }).then(function(result) {
                                                self.userListDisabled = false;
                                                userSwitch(item.userID);
                                                rootScope.userListChangeSuccess = true;
                                            });
                                        }
                                    });
                                }
                                self.userList = angular.copy(rootScope.templateUserList);
                            } else {
                                rootScope.userListChangeSuccess = false;
                                self.userList = angular.copy(rootScope.templateUserList);
                                self.userList.unshift({userID: "allUsers", userName: "全部项目"});
                            }
                        }
                        let userId = localStorage.selectedUserId || "allUsers";
                        userSwitch(userId);
                    }else {
                        userSwitch("");
                    }
                } else {
                    self.userListShow = false;
                }
            });
        }
    }
}]);

componentModule.directive("loading", ["$http","APILOADING","$timeout",function($http,APILOADING,$timeout){
    return {
        restrict:"EA",
        template:`<div class="global-loading" ng-class="{'shows':apiLoading}">
            <i class="loading-icon"></i>
            <span>数据加载中</span>
        </div>`,
        scope:{},
        link:function(scope,ele,attr,ctrl){
            var time = null;
            scope.$watch(function() {
                return $http.pendingRequests;
            },function(ne,old) {
                if(ne.length > 0) {
                    if(time){$timeout.cancel(time)};
                    time = $timeout(function() {
                        var pendingLists = angular.copy(ne);
                        var num = 0;
                        pendingLists.forEach(item=> {
                            for(var i=0;i<APILOADING.exclude.length;i++) {
                                var cur = new RegExp(APILOADING.exclude[i]);
                                if(cur.test(item.url)) {
                                    num += 1;
                                    break;
                                }
                            }
                        })
                        if(pendingLists.length>num) {
                            scope.apiLoading = true;
                            let _height = $(window).height();
                            $(ele).find(".global-loading").css('minHeight',_height);
                        }else {
                            scope.apiLoading = false;
                        }
                    },0)
                }else {
                    scope.apiLoading = false;
                }
            },true);
            scope.$on("$routeChangeStart",function() {
                if($http.pendingRequests.length>0) {
                    $http.pendingRequests = [];
                }
            });
        }
    }
}]);

export default componentModule.name;