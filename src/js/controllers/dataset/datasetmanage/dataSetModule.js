import dataSetSrvTab from './dataSetSrv';

let dataSetViewModule = angular.module("dataSetViewModule", [dataSetSrvTab])
.controller("dataSetCtrl",["$scope" ,"$rootScope" ,"$translate","$uibModal","$filter","$location","dataSetSrv","TableCom","userSwitchSrv",function(scope,rootScope,$translate,$uibModal,$filter,$location,dataSetSrv,TableCom,userSwitchSrv){
    var self= scope ;
    self.userSwitchSrv = userSwitchSrv;
    self.dataSetList = [];
    self.dataTitles = {
        "name": $translate.instant("cn.dataSetManage.dataTitles.name"),
        "taskAndRoute": $translate.instant("cn.dataSetManage.dataTitles.taskAndRoute"),
        "desc": $translate.instant("cn.dataSetManage.dataTitles.desc"),
        "volumesize": $translate.instant("cn.dataSetManage.dataTitles.volumesize"),
        "permissions": $translate.instant("cn.dataSetManage.dataTitles.permissions"),
        "pvcstatus": $translate.instant("cn.dataSetManage.dataTitles.pvcstatus"),
        "createTime": $translate.instant("cn.dataSetManage.dataTitles.createTime"),
        "createUser": $translate.instant("cn.dataSetManage.dataTitles.createUser"),
    }

    self.titleName="dataSetManageTable";
    if(sessionStorage["dataSetManageTable"]){
        self.titleData=JSON.parse(sessionStorage["dataSetManageTable"]);
    }else{
        self.titleData=[
            {name:'dataSetManage.dataTitles.name',value:true,disable:true,search:"pvcname"},
            {name:'dataSetManage.dataTitles.taskAndRoute',value:true,disable:false,search:"searchMount"},
            {name:'dataSetManage.dataTitles.desc',value:true,disable:false,search:"pvcdescribe"},
            {name:'dataSetManage.dataTitles.volumesize',value:true,disable:false,search:"pvcstorage"},
            {name:'dataSetManage.dataTitles.permissions',value:true,disable:false,search:"permissions"},
            {name:'dataSetManage.dataTitles.pvcstatus',value:true,disable:false,search:"pvcstatus"},
            {name:'dataSetManage.dataTitles.createTime',value:true,disable:false,search:"createtime"},
            {name:'dataSetManage.dataTitles.createUser',value:true,disable:false,search:"pvcowner"}
        ];
    };

    function dataSetSearchTearm(obj){
        self.globalSearchTerm = "";
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function(item){
            item.searchTerm=[];
            titleData.forEach(function(showTitle){
                    if(showTitle.value){
                        item.searchTerm.push(item[showTitle.search]);
                    }
            });
            item.searchTerm.join("\b")
        });
        TableCom.init(self, "tableParams", self.dataSetList, "id", 10,"checkboxes");
    }
    self.dataSetSearchTearm = dataSetSearchTearm;
    function getDataSetList(){
        self.globalSearchTerm = "";
        dataSetSrv.getDataSetList().then(function(res){
            res.data&&res.data.data?self.loadData = true:"";
            if(res&&res.data&&res.data.data){
                self.dataSetList = res.data.data
                self.dataSetList.forEach(function(item,index){
                    item.mountList = []
                    item.searchMount = ""
                    item.id = index
                    item.permissions = !item.access?$translate.instant("cn.dataSetManage.noOne"):item.access == "*"?$translate.instant("cn.dataSetManage.all"):item.access
                    item.createtime = $filter("date")(item.created, "yyyy-MM-dd HH:mm:ss");  
                    if(item.mountNSTask&&item.mountNSTask){
                        for(var i in item.mountNSTask){
                            item.mountList.push(i+":"+item.mountNSTask[i])
                        }
                        for(let i=0;i<item.mountList.length;i++){
                            item.searchMount += item.mountList[i]
                        }
                    }
                })
                dataSetSearchTearm({tableData:self.dataSetList,titleData:self.titleData});   
                                           
            }
        })
    }
    getDataSetList()

    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    
    self.createDataSet = function(){
        self.createItemModel = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createDataSet.html",
            controller: "createDataSetCtrl",
            resolve: {
                refresh : function () {
                    return getDataSetList
                },
                context: function () {
                    return self;
                }
            }
        });
    }
    self.editDataSet = function(checkedItems){
        self.createItemModel = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "editDataSet.html",
            controller: "editDataSetCtrl",
            resolve: {
                refresh : function () {
                    return getDataSetList
                },
                context: function () {
                    return self;
                },
                editData:function() {
                    return checkedItems;
                }
            }
        });
    }
    self.delDataSet = function (checkedItems) {
        self.deleteItemCheckedItems = checkedItems;
        let content = {
            msg: $translate.instant("cn.dataSetManage.delDataSet"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            var option = [];
            self.deleteItemCheckedItems.forEach(element => {
                option.push(element.pvcname);
            });
            dataSetSrv.deleteDataSet({names:option}).then(res => {
                getDataSetList();
            })
        };
    }

    self.openVal = function(checkedItems){
        let loadingPage = '/#/loading/progressbar?name=' + checkedItems[0].pvcname
        window.open(loadingPage)
    }

    self.refresh = function(){
        getDataSetList()
    }

    self.$on("getDetail", function (event, value) {
        self.detailInfo = {
            name:value,
            pvcdescribetxt:""
        }
        self.canEditDecr = true;
        dataSetSrv.getDataSetDetail(value).then(function(res){
            if(res&&res.data&&res.data.data){
                self.detailInfo.pvcdescribetxt = res.data.data.pvcdescribetxt
                if(!(res.data.data.access=="*"&&localStorage.isAdmin!="true")){
                    self.canEditDecr = false;
                }
            }
        })
        self.confirmDesc = function(form){
            if(form.$valid){
                let postData = {
                    "pvcdescribetxt":self.detailInfo.pvcdescribetxt,
                }
                dataSetSrv.editDataSet(value,postData).then(function(res){
                    self.refresh()
                })
            }else{
                self[form.$name + "Valid"] = true;
            }
        }
    });


    self.$watch("checkboxes.items", val => {
        self.checkedItems = [];
        for (var i in val) {
            if (val[i]) {
                self.tableParams.data.forEach(item => {
                    if (item.id == i) {
                        self.checkedItems.push(item);
                    }
                });
            }
        }
        if (self.checkedItems.length == 1) {
            if(self.checkedItems[0].mountList.length>0){
                self.canDeleteItem = false;                
            }else{
                self.canDeleteItem = true;                                
            }
            //公有的数据集,非管理员不能操作
            if(self.checkedItems[0].access=="*"&&localStorage.isAdmin!="true"){
                self.canEditItem = false;
                self.canMoreOpt = false;
                self.canFileManage = false;
                self.canDeleteItem = false;
            }else{
                self.canEditItem = true;
                self.canMoreOpt = true;
                self.canFileManage = true;
            }
        } else if (self.checkedItems.length > 1) {
            let result = self.checkedItems.some(function(item){
                return item.mountList.length>0
            })
            let isAll = self.checkedItems.some(function(item){
                return item.access=='*'
            })
            if(localStorage.isAdmin=="true"){
                if(result){
                    self.canDeleteItem = false;
                    self.canMoreOpt = false;               
                }else{
                    self.canDeleteItem = true;
                    self.canMoreOpt = true;               
                }
            }else{
                if(result||isAll){
                    self.canDeleteItem = false;
                    self.canMoreOpt = false;               
                }else{
                    self.canDeleteItem = true;
                    self.canMoreOpt = true;               
                }
            }
            self.canEditItem = false;
            self.canFileManage = false;
        } else {
            self.canEditItem = false;
            self.canDeleteItem = false;
            self.canMoreOpt = false;
            self.canFileManage = false;
        }
    },true);
}])
.controller("createDataSetCtrl",["$scope" ,"$rootScope" ,"$translate","$uibModalInstance","dataSetSrv","refresh","context","$timeout",function(scope,rootScope,$translate,$uibModalInstance,dataSetSrv,refresh,context,$timeout){
    var self=scope
    self.choiceSchool = false
    self.hadSameName = false
    self.formData = {
        permissions:""
    }
    self.modalTitle=$translate.instant("cn.dataSetManage.btnGroup.createDataSet")
    self.allowList = [
        // {"access":"","name":$translate.instant("cn.dataSetManage.noOne")},
        {"access":"*","name":$translate.instant("cn.dataSetManage.all")}
    ]
    if(localStorage.isAdmin=="true"){
        self.allowList = [
            {"access":"*","name":$translate.instant("cn.dataSetManage.all")}
        ]
    }else{
        self.allowList = [];
    }

    self.changeName = function(value) {
        self.hadSameName = false;
        for (let i = 0; i < context.dataSetList.length; i++) {
            if (context.dataSetList[i].pvcname == value) {
                self.hadSameName = true;
            }
        }
    }

    function getProjectList(){
        dataSetSrv.getProjectList().then(function(res){
            if(res&&res.data&&res.data.data){
                res.data.data.forEach(function(item){
                    self.allowList.push({"access":item.name,"name":item.name})
                })
            }
        })
    }
    getProjectList()

    self.confirmCreate = function(form){
        if(form.$valid){
            let postData = {
                "name":self.formData.name,
                "describe":self.formData.desc,
                "storage":self.formData.volumes,
                "access":self.formData.permissions.access
            }
            $uibModalInstance.close();
            dataSetSrv.createDataSet(postData).then(function(res){
                // $timeout(function(){
                    refresh()
                // },1000)
            })
        }else{
            self[form.$name + "Valid"] = true;
        }
    }
}])
.controller("editDataSetCtrl",["$scope" ,"$rootScope" ,"$translate","$uibModalInstance","dataSetSrv","editData","refresh","$timeout",function(scope,rootScope,$translate,$uibModalInstance,dataSetSrv,editData,refresh,$timeout){
    var self = scope
    self.modalTitle = $translate.instant("cn.dataSetManage.btnGroup.editDataSet")

    self.formData={
        school:"",
        permissions:""
    }

    self.choiceSchool = true
    // self.allowList = [
    //     {"access":"","name":$translate.instant("cn.dataSetManage.noOne")},
    //     {"access":"*","name":$translate.instant("cn.dataSetManage.all")},
    // ]
    if(localStorage.isAdmin=="true"){
        self.allowList = [
            {"access":"*","name":$translate.instant("cn.dataSetManage.all")}
        ]
    }else{
        self.allowList = [];
    }

    function getProjectList(){
        dataSetSrv.getProjectList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.schoolList = res.data.data
                res.data.data.forEach(function(item){
                    self.allowList.push({"access":item.name,"name":item.name})
                })
                initPower(editData[0].access)
                self.formData.name = editData[0].pvcname;
                self.formData.desc = editData[0].pvcdescribe;
                self.formData.volumes = editData[0].pvcstorage; 
            }
        })
    }
    getProjectList()

    function initPower(edit){
        if(!edit){
            self.formData.permissions =  {"access":"","name":$translate.instant("cn.dataSetManage.noOne")}
        }else{
            if(edit == "*"){
                self.formData.permissions =  {"access":"*","name":$translate.instant("cn.dataSetManage.all")}
            }else{
                self.schoolList.forEach(function(item){
                    if(item.name == edit){
                        self.formData.permissions = {"access":item.name,"name":item.name}
                    }
                })
            }
        }
    }

    self.confirmEdit = function(form){
        if(form.$valid){
            let postData = {
                "pvcdescribe":self.formData.desc,
                "access":self.formData.permissions.access
            }
            $uibModalInstance.close();
            dataSetSrv.editDataSet(self.formData.name,postData).then(function(res){
                // $timeout(function(){
                    refresh()
                // },1000)
            })
        }else{
            self[form.$name + "Valid"] = true;
        }
    }
}])

export default dataSetViewModule.name;