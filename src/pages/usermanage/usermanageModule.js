import userManageSrv from './usermanageSrv';

let usermanageViewModule = angular.module("usermanageViewModule", ["userManageSrv"]);
usermanageViewModule.controller("userViewCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal","$filter","NgTableParams", "alertSrv", "checkedSrv", "TableCom", "userManageSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal,$filter,NgTableParams, alertSrv, checkedSrv, TableCom, userManageSrv) {
    var self = $scope;
    self.dataStatusList = [
        {
            name:$translate.instant("cn.usermanage.all"),
            status:"all"
        },
        {
            name:$translate.instant("cn.usermanage.activate"),
            status:"enabled"
        },
        {
            name:$translate.instant("cn.usermanage.onenable"),
            status:"onenable"
        },
    ];
    self.titleName="userManageTable";
        if(sessionStorage["userManageTable"]){
            self.titleData=JSON.parse(sessionStorage["userManageTable"]);
        }else{
            self.titleData=[
                {name:'usermanage.loginName',value:true,disable:true,search:"name"},
                {name:'usermanage.role',value:true,disable:false,search:"role_"},
                {name:'usermanage.email',value:true,disable:false,search:"email"},
                {name:'usermanage.phone',value:true,disable:false,search:"telNum"},
                {name:'usermanage.status',value:true,disable:true,search:"enabled_"},
                {name:'usermanage.createTime',value:true,disable:false,search:"createTime_"},
            ];
    };
    function userMangeSearchTearm(obj){
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function(item){
            item.searchTerm="";
            titleData.forEach(function(showTitle){
                    if(showTitle.value){
                        item.searchTerm+=item[showTitle.search];
                    }
            });
        });
    }
    self.userMangeSearchTearm = userMangeSearchTearm;
    self.option = {dataStatusChose : self.dataStatusList[0]};
    self.choiceDataStatus = function(option){
        self.globalSearchTerm = "";
        var filterData = angular.copy(self.tableData);
        switch (option.status){
            case "all":
            var filterData = angular.copy(self.tableData);
            break;
            case "enabled":
            filterData = filterData.filter(item => item.enabled);
            break;
            case "onenable":
            filterData = filterData.filter(item => !item.enabled);
            break;
        }
        TableCom.init(self, "tableParams", filterData, "id", 10);
    }
    getTableData();
    self.editPsw = function () {
        var $editPsWModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "editPsw.html",
            controller: "editPswCtrl",
            resolve: {
                closeModal: function () {
                    return function () {
                        $editPsWModal.close();
                    };
                },
                editData: function () {
                    return self.checkedItems[0];
                }
            }
        });
    };
    self.create = function () {
        var $userModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createUser.html",
            controller: "createUserCtrl",
            resolve: {
                closeModal: function () {
                    return function () {
                        $userModal.close();
                    };
                },
                refreshTable: function () {
                    return function () {
                        self.refresh();
                    };
                },
            }
        });
    };
    self.edit = function () {
        var $editUserModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "editUser.html",
            controller: "editUserCtrl",
            resolve: {
                closeModal: function () {
                    return function () {
                        $editUserModal.close();
                    };
                },
                refreshTable: function () {
                    return function () {
                        self.refresh();
                    };
                },
                editData: function () {
                    return self.checkedItems[0];
                },
                tabActive: function () {
                    return 1;
                },
            }
        });
    };
    self.deleteUser = function () {
        let content = {
            msg: $translate.instant("cn.usermanage.delUserTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            userManageSrv.delUser(self.checkedItems[0].id).then(function (data) {
                self.refresh();
            })
        };
    };
    // 禁用
    self.forbiddenFnc = function () {
        let content = {
            msg: $translate.instant("cn.usermanage.forbiddenTips"),
            type: "warning",
            func: "forbidden"
        };
        self.$emit("ui-tag-alert", content);
        self.forbidden = function () {
            var postData = {
                enabled: false
            };
            userManageSrv.editUser(self.checkedItems[0].id,postData).then(function (data) {
                self.refresh();
            })
        };
    };
    // 启用
    self.activate = function () {
        var postData = {
            enabled: true
        };
        userManageSrv.editUser(self.checkedItems[0].id, postData).then(function (data) {
            self.refresh();
        })
    }
    self.refresh = function(){
        self.globalSearchTerm = "";
        self.option.dataStatusChose = self.dataStatusList[0];
        getTableData();
    }
    function getTableData() {
        userManageSrv.getUserList().then(function (res) {
            if (res&&res.data&&res.data.data) {
                self.tableData = res.data.data;
                self.tableData.forEach(function(item){
                    item.enabled_ = item.enabled?$translate.instant("cn.usermanage.activate"):$translate.instant("cn.usermanage.onenable");
                    switch (item.role){
                        case 2:
                        item.role_ = $translate.instant("cn.usermanage.admin")
                        break;
                        case 3:
                        item.role_ = $translate.instant("cn.usermanage.proadmin")
                        break;
                        case 4:
                        item.role_ = $translate.instant("cn.usermanage.user")
                        break;
                    }
                    item.createTime_ = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss")
                })
                userMangeSearchTearm({tableData:self.tableData,titleData:self.titleData});
                TableCom.init(self, "tableParams", self.tableData, "id", 10);
                self.applyGlobalSearch = function () {
                    var term = self.globalSearchTerm;
                    self.tableParams.filter({
                        searchTerm: term
                    });
                };
                self.$watch(function () {
                    return self.checkboxes.items;
                }, function (val) {
                    self.checkedItems = [];
                    var arr = [];
                    for (var i in self.checkboxes.items) {
                        arr.push(self.checkboxes.items[i]);
                    }
                    self.canEdit = null;
                    self.canStart = null;
                    self.forbidden = null;
                    self.canDel = null ;
                    self.canEditPsw = null;
                    if (val && arr.length >= 0) {
                        for (var key in val) {
                            if (val[key]) {
                                self.tableParams.data.forEach(item => {
                                    if (item.id == key) {
                                        self.checkedItems.push(item);
                                    }
                                });
                            }
                        }
                    }
                    if (self.checkedItems.length == 1) {
                        self.canEdit = true;
                        self.canDel = true ;
                        if(self.checkedItems[0].enabled){
                            self.forbidden = true;
                            self.canStart = false;
                        }else{
                            self.canStart = true;
                            self.forbidden = false;                            
                        }
                        if(self.checkedItems[0].name=="admin"){
                            self.forbidden = false;
                            self.canDel = false;
                        }
                        self.canEditPsw = true;
                    } else if (self.checkedItems.length == 0) {
                        self.canEdit = false;
                        self.canStart = false;
                        self.forbidden = false;
                        self.canDel = false ;
                        self.canEditPsw = false;
                    } else if (self.checkedItems.length > 1) {
                        self.canEdit = false;
                        self.canStart = false;
                        self.forbidden = false;
                        self.canDel = false ;
                        self.canEditPsw = false;
                    }
                }, true);
            }
        });
    };
    self.$on("getDetail", function (event, value) {
        self.detailData = {};
        userManageSrv.getUserDetail(value).then(function (data) {
            self.detailData = {
                email: data.data.data.userEmail,
                phone: data.data.data.userTelNum,
                userName: data.data.data.userName,
            }
        })
    });
}]);
usermanageViewModule.controller("editPswCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal", "editData", "userManageSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal, editData, userManageSrv) {
    var self = $scope;
    self.formData = {
        name: editData.name
    };
    self.confirm = function (m) {
        if (m.$valid) {
            var postData = {
                password:self.formData.admin_pass,
            };
            userManageSrv.editUser(editData.id,postData).then(function (data) {
                closeModal();
            })
        } else {
            self.submitValid = true;
        }
    };
}]);
usermanageViewModule.controller("createUserCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal", "refreshTable","userManageSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal, refreshTable,userManageSrv) {
    var self = $scope;
    self.hadSameName = false;
    self.roleList =[{name:$translate.instant("cn.usermanage.proadmin"),role:"project_admin"},{name:$translate.instant("cn.usermanage.user"),role:"member"}];
    self.userFormData = {
        projectChoice : {
            projectID:"" 
        },
        roleChose : {
            roleId : ""
        },
        userActive: true
    };
    self.userConfirm = function (m) {
        self.canCreate = true;
        if (m.$valid&&!self.hadSameName) {
            var postData = {
                "name":self.userFormData.name,
                "projectUid":self.userFormData.projectChoice.projectID.id,
                "roleName":self.userFormData.roleChose.roleId.role,
                "password":self.userFormData.cfmPassword,
                "email":self.userFormData.email?self.userFormData.email:"",
                "phone":self.userFormData.phone,
                "enabled":self.userFormData.userActive?"true":"false"
            };
            userManageSrv.createUser(postData).then(function (data) {
                self.canCreate = false;
                closeModal();
                refreshTable();
            })
        } else {
            self.submitValid_ = true;
            self.canCreate = false;
        }
    };
    self.choiceProject = function(res){
        self.userFormData.projectChoice.projectID = res;
        if(res.name=="admin"){
            self.roleList =[{name:$translate.instant("cn.usermanage.user"),role:"member"}]
            if(self.userFormData.roleChose.roleId.role=="project_admin"){
                self.userFormData.roleChose.roleId="";
            }
        }else{
            self.roleList =[{name:$translate.instant("cn.usermanage.proadmin"),role:"project_admin"},{name:$translate.instant("cn.usermanage.user"),role:"member"}];
        }
    }
    self.choiceRole = function(res){
        self.userFormData.roleChose.roleId = res;
        if(res.role=="project_admin"){
            for(let i=0;i<self.projectList.length;i++){
                if(self.projectList[i].name=="admin"){
                    self.projectList.splice(i,1);
                }
            }
            if(self.userFormData.projectChoice.projectID.name=="admin"){
                self.project.projectChoice.projectID="";
            }
        }else{
            self.projectList = angular.copy(self.sourceList)
        }
    }
    function getProjectList(){
        userManageSrv.getProjectList().then(function(res){
            if(res&&res.data&&res.data.data){
                //self.userFormData.projectChoice.projectID = res.data.data[0]
                self.sourceList = angular.copy(res.data.data);
                self.projectList = res.data.data;

            }
        })
    }
    function getUserList(){
        userManageSrv.getUserList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.userList = res.data.data
            }
        })
    }
    self.changeName = function(){
        self.hadSameName = self.userList.some(function(item){
            return item.name==self.userFormData.name
        })
    }
    getUserList()
    getProjectList()
}]);
usermanageViewModule.controller("editUserCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal", "tabActive", "editData", "refreshTable", "userManageSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal, tabActive, editData, refreshTable, userManageSrv) {
    var self = $scope;
    self.tabActive = tabActive;
    self.userFormData = angular.copy(editData);
    self.confirm = function (m) {
        if (m.$valid) {
            var postData = {
                email: self.userFormData.email,
                telNum: self.userFormData.telNum,
            };
            userManageSrv.editUser(self.userFormData.id, postData).then(function (data) {
                closeModal()
                refreshTable();
            })
        } else {
            self.submitValid = true;
        }
    };
}]);
export default usermanageViewModule.name;