import "./imagemanageSrv";
let imagemanageModule = angular.module("imagemanageModule", ["imagemanageService"]);

imagemanageModule.controller("imagemanageCtrl", ["$scope", "TableCom", "imagemanageSrv", "$translate", "$uibModal", function ($scope, TableCom, imagemanageSrv, $translate, $uibModal) {
    var self = $scope;
    self.dataTitles = {
        "imageName": $translate.instant("cn.imagemanage.dataTitles.imageName"),
        "engine": $translate.instant("cn.imagemanage.dataTitles.engine"),
        "version": $translate.instant("cn.imagemanage.dataTitles.version"),
        "address": $translate.instant("cn.imagemanage.dataTitles.address"),
        "issupportcluster": $translate.instant("cn.imagemanage.dataTitles.issupportcluster"),
        "adaptationcpu": $translate.instant("cn.imagemanage.dataTitles.adaptationcpu"),
        "adaptationgpu": $translate.instant("cn.imagemanage.dataTitles.adaptationgpu")
    };
    self.imageManageName = "imageManageName";
    if (sessionStorage["imageManageName"]) {
        self.imageManageTitleData = JSON.parse(sessionStorage["imageManageName"]);
    } else {
        self.imageManageTitleData = [
            {name: "imagemanage.dataTitles.imageName", value: true, disable: true, search: "imageName"},
            {name: "imagemanage.dataTitles.engine", value: true, disable: false, search: "engine"},
            {name: "imagemanage.dataTitles.version", value: true, disable: false, search: "version"},
            {name: "imagemanage.dataTitles.address", value: true, disable: false, search: "address"},
            {name: "imagemanage.dataTitles.issupportcluster", value: true, disable: false, search: "issupportcluster"},
            {name: "imagemanage.dataTitles.adaptationcpu", value: true, disable: false, search: "adaptationcpu"},
            {name: "imagemanage.dataTitles.adaptationgpu", value: true, disable: false, search: "adaptationgpu"}
        ];
    }
    self.imageManageSearchTerm = imageManageSearchTerm;
    function imagemanageInit() {
        imagemanageSrv.getImageList().then(result => {
            result.data&&result.data.data?self.loadData = true:"";
            if (result && result.data && result.data.data) {
                successFunc(result.data.data);
            }
        });
    }
    function successFunc(data) {
        self.$watch("checkboxes.items", function (val) {
            self.checkedItems = [];
            for (var i in val) {
                if (val[i]) {
                    self.tableParams.data.forEach(item => {
                        if (item.uuid == i) {
                            self.checkedItems.push(item);
                        }
                    });
                }
            }
            if (self.checkedItems.length == 1) {
                self.canDeleteImage = true;
            } else {
                self.canDeleteImage = false;
            }
        },true);
        data.forEach(item => {
            item.issupportcluster_ori = item.issupportcluster == 1 ? "是" : "否";
            //item.searchTerm = [item.name, item.engine, item.version, item.address, item.issupportcluster_ori, item.adaptationcpu, item.adaptationgpu].join("\b");
        });
        self.imageManageListData = angular.copy(data);
        TableCom.init(self, "tableParams", self.imageManageListData, "uuid", 10, "checkboxes");
        self.imageManageSearchTerm({tableData:self.imageManageListData,titleData:self.imageManageTitleData});
    }
    imagemanageInit();
    function imageManageSearchTerm(obj){
        self.globalSearchTerm = "";
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function (item) {
            item.searchTerm = [];
            titleData.forEach(function (value) {
                if (value.value) {
                    item.searchTerm.push(item[value.search]);
                }
            });
            item.searchTerm = item.searchTerm.join("\b");
        });
        self.applyGlobalSearch();
    }
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        self.globalSearchTerm = "";
        imagemanageInit();
    };
    self.createImage = function () {
        self.createImageModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createImage.html",
            controller: "CreateImageCtrl",
            resolve: {
                refresh: function () {
                    return imagemanageInit;
                },
                context: function () {
                    return self;
                }
            }
        })
    }
    self.deleteImage = function () {
        let content = {
            msg: $translate.instant("cn.imagemanage.delImageTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            imagemanageSrv.deleteImage(self.checkedItems[0].uuid).then(function () {
                imagemanageInit();
            });
        };
    }
}]);
imagemanageModule.controller("CreateImageCtrl", ["$scope", "context", "refresh", "imagemanageSrv", function ($scope, context, refresh, imagemanageSrv) {
    var self = $scope;
    self.hadSameName = false
    self.imageNameList = angular.copy(context.imageManageListData)

    self.modelForm = {
        "type": "cpu"
    };
    self.cpuTypeList=[];
    self.gpuTypeList=[];
    self.cpuTypeModel = {
        selected:''
    }
    self.gpuTypeModel = {
        selected:''
    }
    self.frameworkModel = {
        selected:''
    }
    self.versionModel = {
        selected:''
    }

    self.choiceName = function(item){
        self.hadSameName = self.imageNameList.some(function(value){
            return value.name==item
        })
    }
    // self.frameworkList = [
    //     {name: "Tensorflow",value: "tensorflow"},
    //     {name: "Mxnet",value: "mxnet"},
    //     {name: "Caffe",value: "caffe"}
    // ];
    imagemanageSrv.getTypeList().then(function(res){
        if(res&&res.data&&res.data.data){
            res.data.data.forEach(item=>{
                if(item.type=="cpu"){
                    self.cpuTypeList.push(item)
                }else if(item.type=="gpu"){
                    self.gpuTypeList.push(item);

                }
            })
            self.cpuTypeModel.selected = self.cpuTypeList[0];
            self.gpuTypeModel.selected = self.gpuTypeList[0];
        }
        
    })
    imagemanageSrv.getEnginesList().then(function(res){
        if(res&&res.data&&res.data.data){
            self.frameworkList = res.data.data;
            self.frameworkModel.selected = res.data.data[0];
            if(self.frameworkModel.selected){
                imagemanageSrv.getEnginesVersionList(self.frameworkModel.selected.uuid).then(function(re){
                    if(re&&re.data&&re.data.data){
                        self.versionList = re.data.data;
                        self.versionModel.selected = re.data.data[0];
                    }
                })
            }

        }
    })
    self.changeFramework = function(cur){
        self.versionList = [];
        self.versionModel.selected = '';
        imagemanageSrv.getEnginesVersionList(cur.uuid).then(function(re){
            if(re&&re.data&&re.data.data){
                self.versionList = re.data.data;
                self.versionModel.selected = re.data.data[0];
            }
        })
    }
    self.confirmCreate = function (formName) {
        if (formName.$valid&&!self.hadSameName) {
            var option  = {
                "name": self.modelForm.imageName,
                "engine": self.frameworkModel.selected.name,
                "version": self.versionModel.selected.version,
                "address": self.modelForm.path,
                "issupportcluster": self.modelForm.issupportcluster?1:0
            }
            if (self.modelForm.type == "cpu") {
                option.adaptationcpu = self.cpuTypeModel.selected.name;
            } else if (self.modelForm.type == "gpu") {
                option.adaptationgpu = self.gpuTypeModel.selected.name;
            }
            imagemanageSrv.createImage(option).then(function () {
                refresh();
            });
            context.createImageModal.close()
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);

export default imagemanageModule.name;