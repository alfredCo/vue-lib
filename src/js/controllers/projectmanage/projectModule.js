import projectSrv from './projectSrv';

let projectViewModule = angular.module("projectViewModule", ["projectSrv"]);
projectViewModule.controller("projectCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal","$filter", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "projectSrv",
    function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal,$filter, NgTableParams, alertSrv, checkedSrv, TableCom, projectSrv) {
    var self = $scope;
    
    self.titleName="proManageTable";
    if(sessionStorage["proManageTable"]){
        self.titleData=JSON.parse(sessionStorage["proManageTable"]);
    }else{
        self.titleData=[
            {name:'projectManage.proname',value:true,disable:true,search:"name"},
            {name:'projectManage.cpu',value:true,disable:false,search:""},
            {name:'projectManage.memory',value:true,disable:false,search:""},
            {name:'projectManage.storage',value:true,disable:false,search:""},
            {name:'projectManage.gpu',value:true,disable:false,search:""}
        ];
    };

    function proMangeSearchTearm(obj){
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function(item){
            item.searchTerm="";
            titleData.forEach(function(showTitle){
                    if(showTitle.value){
                        item.searchTerm+=item[showTitle.search]+"\b";
                    }
            });
        });
    }
    self.proMangeSearchTearm = proMangeSearchTearm;
    self.create = function () {
        var $userModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "creatProject.html",
            controller: "createProjectCtrl",
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
    self.editProject = function () {
        var $editUserModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "creatProject.html",
            controller: "editProjectCtrl",
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
    self.delProject = function () {
        let content = {
            msg: $translate.instant("cn.projectManage.delProjectTips"),
            type: "warning",
            func: "checkDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.checkDelete = function () {
            projectSrv.getBindUser(self.checkedItems[0].id).then(function(res){
                if(res&&res.data&&res.data.data){
                    if(res.data.data.length==0){
                        projectSrv.delProject(self.checkedItems[0].id).then(function (data) {
                            self.refresh();
                        })
                    }else{
                        self.nofunc = function(){};
                        let content1 = {
                            msg: $translate.instant("cn.projectManage.canNotdelProjectTips"),
                            type: "warning",
                            func: "nofunc"
                        };
                        self.$emit("ui-tag-alert", content1);
                    }
                }
            })
        };
    };
    self.userManage = function() {
        var $editUserModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "/tmpl/member.html",
            controller: "allocateUserCtrl",
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
    }
    self.refresh = function(){
        self.globalSearchTerm = "";
        getTableData();
    }
    function getTableData() {
        projectSrv.getProjectist().then(function (res) {
            // data.data&&data.data.data?self.loadData = true:"";
            if (res&&res.data&&res.data.data) {
                self.tableData = res.data.data;
                self.tableData.map(function (item) {
                    // item.statusText = $translate.instant("cn.usermanage.statusText." + item.enabled);
                    if(item.quotaUsed &&item.quotaUsed.gpu_hard){
                        item.gpuRatio = item.quotaUsed.gpu_used/item.quotaUsed.gpu_hard
                    }else{
                        item.gpuRatio = 0
                    }
                    if(item.quotaUsed && item.quota.cpu_hard){
                        item.cpuRatio = item.quota.cpu_used/item.quota.cpu_hard
                    }else{
                        item.cpuRatio = 0
                    }
                    if(item.quota && item.quota.memory_hard){
                        item.memoryRatio = item.quota.memory_used/item.quota.memory_hard
                    }else{
                        item.memoryRatio = 0
                    }
                    if(item.quota && item.quota.disk_hard){
                        item.diskRatio = item.quota.disk_used/item.quota.disk_hard
                    }else{
                        item.diskRatio = 0
                    }
                    item.resData = {
                        cpu:{
                            inUsed:item.quota?item.quota.cpu_used:0,
                            total:item.quota?item.quota.cpu_hard:0,
                            added: 0,
                            beAdded: 0,
                            unit:"个"
                        },
                        memory:{
                            inUsed: item.quota?item.quota.memory_used:0,
                            total:item.quota?item.quota.memory_hard:0,
                            added: 0,
                            beAdded: 0,
                            unit:"GB"
                        },
                        storage:{
                            inUsed: item.quota?item.quota.disk_used:0,
                            total:item.quota?item.quota.disk_hard:0,
                            added: 0,
                            beAdded: 0,
                            unit:"GB"
                        },
                        gpu:{
                            inUsed:item.quota?item.quota.gpu_used:0,
                            total:item.quota?item.quota.gpu_hard:0,
                            added: 0,
                            beAdded: 0,
                            unit:"个"
                        },
                    }
                })
                self.proMangeSearchTearm({tableData:self.tableData,titleData:self.titleData});
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
                    self.canManageUser = null;
                    self.canDel = null ;
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
                        self.canManageUser = true;
                        if(self.checkedItems[0].quota.cpu_used||self.checkedItems[0].quota.memory_used||self.checkedItems[0].quota.disk_used||self.checkedItems[0].quota.gpu_used){
                            self.canDel = false
                        }else{
                            self.canDel = true
                        }
                    } else if (self.checkedItems.length == 0) {
                        self.canEdit = false;
                        self.canManageUser = false;
                        self.canDel = false;
                    } else if (self.checkedItems.length > 1) {
                        self.canEdit = false;
                        self.canManageUser = false;
                        self.canDel = false;
                    }
                }, true);
            }
        });
    };
    getTableData()
    self.$on("getDetail", function (event, value) {
        self.detailData = {};
        projectSrv.getProjectDetail(value).then(function (res) {
            let userList = [];
            if(res&&res.data&&res.data.data){
                if(res.data.data.users&&res.data.data.users.length>0){
                    res.data.data.users.forEach(function(item){
                        userList.push(item.username)
                    })
                }
                self.detailData = {
                    projectName: res.data.data.projectName,
                    createTime: res.data.data.createTime?$filter("date")(res.data.data.createTime, "yyyy-MM-dd HH:mm:ss"):"",
                    cpu_hard: res.data.data.quota.cpu_hard,
                    disk_hard: res.data.data.quota.disk_hard,
                    gpu_hard: res.data.data.quota.gpu_hard,
                    memory_hard: res.data.data.quota.memory_hard,
                    userList:userList?userList:[],
                    projectAdmin:res.data.data.projectAdmin?res.data.data.projectAdmin:"",
                }
                
            }
            // console.log(res)
        })
    });
}]);
projectViewModule.controller("createProjectCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal", "refreshTable","projectSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal, refreshTable,projectSrv) {
    var self = $scope;
    self.projectTitle = $translate.instant("cn.projectManage.newproject")
    self.createOrEdit = true;
    self.hadSameName = false;
    self.userFormData = {
        userActive: true
    };
    self.proFormData = {
        proName:"",
        description:""
    }
    self.quota = {
        cpu:"16",
        gpu:"0",
        memory:"32",
        disk:"1024",
    }
    self.confirmPro = function (m) {
        self.canCreate = true;
        if (m.$valid&&!self.hadSameName) {
            var postData = {
                "projectName":self.proFormData.proName,
                "description":self.proFormData.description,
                "cpuQuota":self.quota.cpu,
                "gpuQuota":self.quota.gpu,
                "memQuota":self.quota.memory,
                "diskQuota":self.quota.disk,
            };
            projectSrv.createProjct(postData).then(function (data) {
                closeModal();
                refreshTable();
            })
        } else {
            self.submitValid_ = true;
        }
    };

    function getProjectList(){
        projectSrv.getProjectist().then(function(res){
            if(res&&res.data&&res.data.data){
                self.projectList = res.data.data
            }
        })
    }
    self.changeName = function(){
        self.hadSameName = self.projectList.some(function(item){
            return item.name==self.proFormData.proName
        })
    }
    getProjectList()
    function getResTotal(){
        projectSrv.getProjectQuota().then(function(res){
            if(res && res.data && res.data.data ){
                self.totalResMax = res.data.data;
            }
        })
    }
    self.totalResMin = {
        nodeQuota:{
            cpu:1,
            gpu:0,
            memory:1,
            storage:1,
        }
    }
    getResTotal()
}]);
projectViewModule.controller("editProjectCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal", "tabActive", "editData", "refreshTable", "projectSrv", function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal, tabActive, editData, refreshTable, projectSrv) {
    var self = $scope;
    self.projectTitle = $translate.instant("cn.projectManage.editProject")    
    self.createOrEdit = false;    
    self.proFormData = angular.copy(editData);
    self.proFormDataLimit = angular.copy(editData);    

    function getResTotal(){
        projectSrv.getProjectQuota().then(function(res){
            if(res && res.data && res.data.data ){
                self.allRes = res.data.data;
                self.totalResMax = {
                    nodeQuota:{
                        cpu:self.allRes.nodeQuota.cpu,
                        gpu:self.allRes.nodeQuota.gpu,
                        memory:self.allRes.nodeQuota.memory,
                        storage:self.allRes.nodeQuota.storage,
                    }
                }
                self.totalResMin = {
                    nodeQuota:{
                        cpu:self.proFormDataLimit.quota.cpu_used ==0?1:self.proFormDataLimit.quota.cpu_used,
                        gpu:self.proFormDataLimit.quota.gpu_used,
                        memory:self.proFormDataLimit.quota.memory_used ==0?1:self.proFormDataLimit.quota.memory_used,
                        storage:self.proFormDataLimit.quota.disk_used ==0?1:self.proFormDataLimit.quota.disk_used,
                    }
                }
            }
        })
    }
    getResTotal()
   
    self.quota = {
        cpu:self.proFormData.quota.cpu_hard,
        gpu:self.proFormData.quota.gpu_hard,
        memory:self.proFormData.quota.memory_hard,
        disk:self.proFormData.quota.disk_hard
    }
    self.confirmPro = function (m) {
        if (m.$valid) {
            var postData = {
                "description":self.proFormData.description,
                "cpuQuota":self.quota.cpu*1,
                "gpuQuota":self.quota.gpu*1,
                "memQuota":self.quota.memory*1,
                "diskQuota":self.quota.disk*1,
            };
            projectSrv.editProject(postData,self.proFormData.id).then(function (data) {
                closeModal();                
                refreshTable();
            })
        } else {
            self.submitValid = true;
        }
    };
}]);
projectViewModule.controller("allocateUserCtrl", ["$scope", "$rootScope", "$translate", "$routeParams", "$timeout", "$uibModal", "NgTableParams", "alertSrv", "checkedSrv", "TableCom", "closeModal","projectSrv","refreshTable","editData",function ($scope, $rootScope, $translate, $routeParams, $timeout, $uibModal, NgTableParams, alertSrv, checkedSrv, TableCom, closeModal,projectSrv,refreshTable,editData) {
    var self = $scope;
    self.proFormData = angular.copy(editData);
    self.manager = {
        selected:''
    }
    self.userIds = []
    self.allowPro = {
        userNameList:[]
    }
    self.manageDisabled = false;
    self.flag = 0;
    function getBindUser(){
        projectSrv.getBindUser(self.proFormData.id).then(function(res){
            if(res&&res.data&&res.data.data){
                self.flag+=1;
                self.allowPro.userNameList = res.data.data
                for(let i=0;i<self.allowPro.userNameList.length;i++){
                    if(self.allowPro.userNameList[i].projectRole===3){
                        self.manager.selected = self.allowPro.userNameList[i];
                        //self.manageDisabled = true;
                        self.allowPro.userNameList.splice(i,1);
                    }
                }
            }
        })
        if(self.proFormData.name=="admin"){
            self.manager.selected = {
                name:'admin',
                id:localStorage.userId
            };
            self.manageDisabled = true;
        }
    }   
    getBindUser()
    function getUserList(){
        projectSrv.getUserList(self.proFormData.id).then(function(res){
            if(res&&res.data&&res.data.data){
                self.flag+=1;
                // for (let i = 0;i < res.data.data.length;i++) {
                //     if(res.data.data[i].name=="admin"){
                //         res.data.data.splice(i,1);
                //     }
                // }
                self.userList = [];
                self.sourceList = angular.copy(res.data.data);
                self.managerList = res.data.data.filter(item=>{
                    var isData = 0;
                    for(let i=0;i<item.projectList.length;i++){
                        if(item.projectList[i].projectRole==3&&item.projectList[i].id!=self.proFormData.id){
                            isData = 1;
                            break;
                        }
                    }
                    return isData==0;
                })
                if(self.managerList.length>0){
                    self.managerList.unshift({
                        name:$translate.instant("cn.projectManage.choiceProAdmin"),
                        id:""
                    })
                }
            }
        })
    }
    getUserList()
    self.choiceManager = function(cur){
        self.userList = [];
        self.sourceList.forEach(item=>{
            if(item.id!=cur.id){
                self.userList.push(item);
            }
        })
        for (let i = 0;i < self.allowPro.userNameList.length;i++) {
            if (self.allowPro.userNameList[i].id == cur.id ) {
                self.allowPro.userNameList.splice(i, 1);
                break;
            }
        }
    }
    function filterUser(selected){
        self.sourceList.forEach(item=>{
            if(item.id!=selected.id){
                self.userList.push(item);
            }
        })
    }
    self.$watch(function(){
        return self.flag;
    },function(ne,old){
        if(ne==2){
            filterUser(self.manager.selected);
        }
    })
    self.allocateUserComfirm = function(m){
        if (m.$valid) {
            for(let i=0;i<self.allowPro.userNameList.length;i++){
                self.userIds.push({id:self.allowPro.userNameList[i].id,role:4})
            }
            if(self.manager.selected){
                if(self.manager.selected.id){
                    self.userIds.push({id:self.manager.selected.id,role:self.proFormData.name=="admin"?2:3});
                }
            }
            projectSrv.allowProjct(self.userIds,self.proFormData.id).then(function (data) {
                closeModal();                
                refreshTable();
            })
        } else {
            self.submitValid = true;
        }
    }
}]);
export default projectViewModule.name;