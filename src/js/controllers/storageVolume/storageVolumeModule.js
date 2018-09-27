import "./storageVolumeSrv";
let storageVolumeViewModule = angular.module("storageVolumeViewModule", ["storageVolumeService"]);
storageVolumeViewModule.controller("storageVolemeCtrl",["$scope", "$translate", "$uibModal", "TableCom", "storageVolumeSrv", "$filter", "userSwitchSrv","$location", function($scope, $translate, $uibModal, TableCom, storageVolumeSrv, $filter, userSwitchSrv, $location){
    var self = $scope ;
    self.userSwitchSrv = userSwitchSrv;
    self.storageVolumeName = "storageVolumeName";
    if (sessionStorage["storageVolumeName"]) {
        self.storageVolumeTitleData = JSON.parse(sessionStorage["storageVolumeName"]);
        if (self.userSwitchSrv.storagevolume) {
            self.storageVolumeTitleData[1].disable = true;
            self.storageVolumeTitleData.forEach(item => {
                item.value = true;
            });
        } else {
            self.storageVolumeTitleData[1].disable = false;
        }
    } else {
        self.storageVolumeTitleData = [
            {name: "storageVolume.storageVolumeName", value: true, disable: true, search: "volumename"},
            {name: "traincluster.dataTitles.namespace", value: true, disable: false, search: "namespace"},
            {name: "storageVolume.size", value: true, disable: false, search: "volumesize"},
            {name: "storageVolume.type", value: true, disable: false, search: "type"},
            {name: "storageVolume.trainingCluster", value: true, disable: false, search: "relatedtask"},
            {name: "storageVolume.depositModel", value: true, disable: false, search: "relatedmodel"},
            {name: "storageVolume.createTime", value: true, disable: false, search: "createTime_ori"}
        ];
    }
    getTableData();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.$watch("checkboxes.items", function(val) {
        self.checkedItems = [];
        var arr=[];
        for(var i in val){
            arr.push(val[i]);
        }
        self.canEdit = null;
        self.canDel = null;
        self.canOpen = null;
        if(val && arr.length>=0){
            for(var key in val){
                if(val[key]){
                    self.tableParams.data.forEach(item=>{
                        if(item.id==key){
                            self.checkedItems.push(item);
                        }
                    });
                }
            }
        }
        if(self.checkedItems.length==1){
            self.canEdit=true;
            self.canDel= true;
            self.canOpen = true;
        }else if(self.checkedItems.length==0){
            self.canEdit=false;
            self.canDel= false;
            self.canOpen= false;
        }else if(self.checkedItems.length>1){
            self.canEdit=false;
            self.canDel= true;
            self.canOpen= false;
        }
    },true);
    self.create = function(){
        var $userModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createStorageVolume.html",
            controller:  "createStorageVolumeCtrl",
            resolve: {
                closeModal:function(){
                    return function(){
                        $userModal.close();
                    };
                },
                refresh: function () {
                    return getTableData;
                }, 
                context: function () {
                    return self;
                }
            }
        });
    };
    self.refresh = function () {
        getTableData();
    };
    self.delete = function () {
        let content = {
            msg: $translate.instant("cn.storageVolume.delTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            var option = [];
            self.checkedItems.forEach(item => {
                option.push("pvcNames=" + item.volumename);
            });
            option = option.join("&");
            storageVolumeSrv.deleteVolume(option).then(() => {
                getTableData();
            });
        };
    };
    function getTableData(){
        storageVolumeSrv.getVolumeList().then(result => {
            result.data&&result.data.data?self.loadData = true:"";
            if (result && result.data && result.data.data) {
                self.storageVolumeListData = result.data.data;
                self.storageVolumeListData.forEach((item, index) => {
                    item.id = index;
                    if (item.createtime) {
                        item.createTime_ori = $filter("date")(item.createtime, "yyyy-MM-dd HH:mm:ss");
                    } else {
                        item.createTime_ori = "";
                    }
                   item.searchTerm = [item.volumename, item.volumesize,item.type, item.relatedtask, item.relatedmodel, item.createTime_ori].join("\b");
                });
                TableCom.init(self,"tableParams",self.storageVolumeListData,"id",10);
                storageVolumeSearchTerm({tableData:self.storageVolumeListData,titleData:self.storageVolumeTitleData})
            }
        });
    };
    function storageVolumeSearchTerm(obj){
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
    self.openVal = function(){
        let loadingPage = '/#/loadsing/progressbar?name=' + self.checkedItems[0].volumename
        window.open(loadingPage)
    }
    self.storageVolumeSearchTerm = storageVolumeSearchTerm;
    self.$on("getDetail", function (event, value) {
        self.DetailInfo = {
            "name": $location.search().name,
            "namespace": $location.search().namespace
        }
        self.params={
            last:"1h",     // 最近时间范围
            interval:"300"    // 间隔时间
        }
        self.volActiveFlag = "1h";
        self.volIntervalTime = 300;
        //获取存储卷监控数据
        function getVolMonitorData(monitorType,timeType) {
            switch (monitorType) {
                case "volume":
                    storageVolumeSrv.getMonitorVolume(self.DetailInfo.namespace, self.DetailInfo.name, self.params).then(function(res){
                        if(res&&res.data&&res.data.data){
                            let getMonitorVolData = {
                                stamp:res.data.data.stamp?res.data.data.stamp:[],
                                used:res.data.data.used?res.data.data.used:[],
                                alloc:res.data.data.alloc?res.data.data.alloc:[]                   
                            }
                            initData(getMonitorVolData,"clusterVolData",timeType);
                            getVolClusterData();
                        }
                    });
                    break;
                default:
                    break;
            }
        }
        function getVolClusterData() {
            return self.volInfo = [
                {
                    title:"存储卷(GB)",
                    // showNoData:self.clusterVolData&&self.clusterVolData.total&&self.clusterVolData.total.length>0&&self.clusterVolData.total.some(function(item){return item!=null})?true:false,
                    showNoData:self.clusterVolData&&self.clusterVolData.used.some(isDataUseable)&&self.clusterVolData.alloc.some(isDataUseable)?true:false,
                    data:{
                        x_data:["分配存储卷大小", "实际使用存储卷大小"],
                        series: [
                            {
                                name:'分配存储卷大小',
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterVolData?self.clusterVolData.alloc:[],
                                time:self.clusterVolData?self.clusterVolData.time:[],
                                yAxisIndex:0
                            },
                            {
                                name:'实际使用存储卷大小',
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterVolData?self.clusterVolData.used:[],
                                time:self.clusterVolData?self.clusterVolData.time:[],
                                yAxisIndex:0
                            }
                        ]
                    }
                }
            ];
        }
        function isDataUseable(item) {
            if (item != null) {
                return true;
            } else {
                return false;
            }
        }
        getVolMonitorData("volume","time");
        self.changeVolInfo = function(data,time){
            switch(data){
                case "1h":
                    self.timeType = "time"
                break;
                case "12h":
                    self.timeType = "time"
                break;
                case "1d":
                    self.timeType = "day"
                break;
                case "7d":
                    self.timeType = "day"
                break;
            }
            self.params = {
                last:data,
                interval:time
            }
            resetChartData(self,['clusterVolData']);       
            getVolMonitorData("volume",self.timeType);
            self.volIntervalTime = time;
            self.volActiveFlag = data;
        }
        // 数据处理
        function initData(data,type,timeType){
            self[type] = {
                used : [],
                time : [],
                alloc : []
            }
            data.alloc.forEach(ele => {
                self[type].alloc.push(ele)
            });
            data.used.forEach(ele => {
                self[type].used.push(ele)
            });
            if(timeType == "day"){
                data.stamp.forEach(ele => {
                    self[type].time.push(moment(ele*1000).format("YYYY-MM-DD HH:mm:ss"))
                });
            }else if(timeType == "time"){
                data.stamp.forEach(ele => {
                    self[type].time.push(moment(ele*1000).format("HH:mm:ss"))
                });
            }
        }
        function resetChartData(self,arg){
            for(let i=0;i<arg.length;i++){
                self[arg[i]] = {};
            }
        }
        
    });
}]);
storageVolumeViewModule.controller("createStorageVolumeCtrl",["$scope", "$translate", "closeModal", "storageVolumeSrv", "refresh","context", function($scope, $translate, closeModal, storageVolumeSrv, refresh,context){
    var self = $scope ;
    self.hadSameName = false
    self.formData = {
        "size" : "",
        "name" : "",
        "type" : "glusterfs"
    };
    self.storageVolumeNameList = angular.copy(context.storageVolumeListData)
    self.canUse_data ={
        title:$translate.instant("cn.storageVolume.totalSize"),
        inUsed:0,
        total:100,
        added:0,
        beAdded:0
    };

    self.choiceName = function(item){
        self.hadSameName = self.storageVolumeNameList.some(function(value){
            return value.volumename==item
        })
    }

    self.$watch("formData.size", val => {
        if (val) {
            self.canUse_data.beAdded = val*1;
            if (self.canUse_data.beAdded > self.canUse_data.total - self.canUse_data.inUsed) {
                self.overQuota = true;
            } else {
                self.overQuota = false;
            }
        } else {
            self.overQuota = false;
            self.canUse_data.beAdded = 0;
        }
    });
    storageVolumeSrv.getVolumeQuota(localStorage.userId).then((res) => {
        if (res && res.data && res.data.data) {
            self.canUse_data.total = res.data.data.disk_hard;
            self.canUse_data.inUsed = res.data.data.disk_used;
        }
    });
    self.confirm = function(formName){
        if (formName.$valid&&!self.hadSameName) {
            if (!self.overQuota) {
                var option = {
                    "name" : self.formData.name,
                    "storage" : self.formData.size + "Gi",
                    "type" : self.formData.type
                };
                for(let i=0;i<30;i++){
                    (function(i){
                        var opt = angular.copy(option);
                        opt.name = opt.name+i+"teste";
                        storageVolumeSrv.createVolume(opt).then(() => {
                            if(i==29){
                                refresh();
                            }
                        });
                    })(i)
                }
                // storageVolumeSrv.createVolume(option).then(() => {
                //     refresh();
                // });
                closeModal();
            }
        } else {
            self.submitValid = true;
        }
    };
}]);
storageVolumeViewModule.controller("storageLoadingCtrl",["$scope","$routeParams","storageVolumeSrv","$http",function(scope,$routeParams,storageVolumeSrv,$http){
    var self = scope;
    if(!$routeParams.name){
        return;
    }

    var name = $routeParams.name;
    storageVolumeSrv.getstorageLoadStatus(name).then(function(res){
        
    })
    
}])
export default storageVolumeViewModule.name;