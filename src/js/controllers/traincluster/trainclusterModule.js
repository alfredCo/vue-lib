import "./trainclusterSrv";
let trainclusterModule = angular.module("trainclusterModule", ["trainmanageService"]);

trainclusterModule.controller("trainclusterCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "$sce", "trainmanageSrv", "$window", "$timeout", "userSwitchSrv", "$filter","logSrv", function ($scope, TableCom, $uibModal, $translate, $sce, trainmanageSrv, $window, $timeout, userSwitchSrv, $filter,logSrv) {
    var self = $scope;
    self.userSwitchSrv = userSwitchSrv;
    self.dataTitles = {
        "name": $translate.instant("cn.traincluster.dataTitles.name"),
        "status": $translate.instant("cn.traincluster.dataTitles.status"),
        "engine": $translate.instant("cn.traincluster.dataTitles.engine"),
        "runningTime": $translate.instant("cn.traincluster.dataTitles.runningTime"),
        "trainingTime": $translate.instant("cn.traincluster.dataTitles.trainingTime"),
        "namespace": $translate.instant("cn.traincluster.dataTitles.namespace")
    };
    self.trainStatusList = [
        {name: "全部",status:"all"},
        {name: "创建中",status:"0"},
        {name: "创建失败",status:"1"},
        {name: "运行中",status:"2"},
        {name: "调度中",status:"5"},
        {name: "终止中",status:"6"},
        {name: "已终止",status:"7"},
        {name: "终止失败",status:"8"},
        {name: "重新训练失败",status:"9"},
        {name: "继续训练失败",status:"10"},
        {name: "到时限自动终止",status:"11"},
        {name: "删除中",status:"12"},
        {name: "删除失败",status:"13"}
    ];
    self.trainName = "trainName";
    if (sessionStorage["trainName"]) {
        self.trainTitleData = JSON.parse(sessionStorage["trainName"]);
        if (self.userSwitchSrv.traincluster) {
            self.trainTitleData[1].disable = true;
            self.trainTitleData.forEach(item => {
                item.value = true;
            });
        } else {
            self.trainTitleData[1].disable = false;
        }
    } else {
        self.trainTitleData = [
            {name: "traincluster.dataTitles.name", value: true, disable: true, search: "taskname"},
            {name: "traincluster.dataTitles.namespace", value: true, disable: false, search: "namespace"},
            {name: "traincluster.dataTitles.status", value: true, disable: true, search: "taskrunstatus_ori"},
            {name: "traincluster.dataTitles.engine", value: true, disable: false, search: "taskengine"},
            {name: "traincluster.dataTitles.runningTime", value: true, disable: false, search: "taskruntime"},
            {name: "traincluster.dataTitles.trainingTime", value: true, disable: false, search: "tasktrainlimittime"}
        ];
    }
    self.trainDetailName = "trainDetailName";
    if (sessionStorage["trainDetailName"]) {
        self.trainDetailTitleData = JSON.parse(sessionStorage["trainDetailName"]);
    } else {
        self.trainDetailTitleData = [
            {name: "traincluster.detailDataTitles.name", value: true, disable: true, search: "name"},
            {name: "traincluster.detailDataTitles.status", value: true, disable: true, search: "status_ori"},
            {name: "traincluster.detailDataTitles.podIP", value: true, disable: false, search: "podIP"},
            {name: "traincluster.detailDataTitles.hostIP", value: true, disable: false, search: "hostIP"},
            {name: "traincluster.detailDataTitles.sshport", value: true, disable: false, search: "sshport"},
            {name: "traincluster.detailDataTitles.startTime", value: true, disable: false, search: "startTime_ori"}
        ];
    }
    self.systemStatusForm = {};
    self.resizeNum = {};
    self.taskListData = [];
    function trainListInit() {
        self.globalSearchTerm = "";
        self.systemStatusForm.name = {name: "全部",status:"all"};
        trainmanageSrv.getTaskListData().then(res => {
            res.data&&res.data.data?self.loadData = true:"";
            if (res && res.data && res.data.data) {
                successFunc(res.data.data);
                tableStart(res.data.data);
            }
        });
    }
    function successFunc(data) {
        self.taskListData = data;
        self.taskListData.map(item => {
            if (item.taskrunstatus == "0") {
                item.taskrunstatus_ori = "创建中";
            } else if (item.taskrunstatus == "1") {
                item.taskrunstatus_ori = "创建失败";
            } else if (item.taskrunstatus == "2") {
                item.taskrunstatus_ori = "运行中";
            } else if (item.taskrunstatus == "5") {
                item.taskrunstatus_ori = "调度中";
            } else if (item.taskrunstatus == "6") {
                item.taskrunstatus_ori = "终止中";
            } else if (item.taskrunstatus == "7") {
                item.taskrunstatus_ori = "已终止";
            } else if (item.taskrunstatus == "8") {
                item.taskrunstatus_ori = "终止失败";
            } else if (item.taskrunstatus == "9") {
                item.taskrunstatus_ori = "重新训练失败";
            } else if (item.taskrunstatus == "10") {
                item.taskrunstatus_ori = "继续训练失败";
            } else if (item.taskrunstatus == "11") {
                item.taskrunstatus_ori = "到时限自动终止";
            } else if (item.taskrunstatus == "12") {
                item.taskrunstatus_ori = "删除中";
            } else if (item.taskrunstatus == "13") {
                item.taskrunstatus_ori = "删除失败";
            }
            item.searchTerm = [item.taskname, item.taskengine, item.taskruntime, item.tasktrainlimittime, item.taskrunstatus_ori];
        });
        TableCom.init(self, "tableParams", self.taskListData, "uuid", 10, "checkboxes");
        trainSearchTerm({tableData:self.taskListData,titleData:self.trainTitleData});
    }
    function trainSearchTerm(obj){
        self.globalSearchTerm = "";
        self.applyGlobalSearch();
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function (item) {
            item.searchTerm = [];
            titleData.forEach(function (value) {
                if (value.value) {
                    if (!(self.userSwitchSrv.traincluster && value.search == "namespace")) {
                        item.searchTerm.push(item[value.search]);
                    }
                }
            });
            item.searchTerm = item.searchTerm.join("\b");
        });
    }
    self.trainSearchTerm = trainSearchTerm;
    trainListInit();
    self.choiceDataStatus = function (item) {
        self.globalSearchTerm = "";
        self.filterTableData = self.taskListData.filter(value => {
            if (item.status == "all") {
                return true;
            } else {
                if (item.status == value.taskrunstatus) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        TableCom.init(self, "tableParams", self.filterTableData, "uuid", 10, "checkboxes");
    };
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    //添加监听
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
        //判断各个按钮的状态
        if (self.checkedItems.length == 1) {
            self.canMoreOpt = true;
            if (self.checkedItems[0].taskrunstatus == 2) {
                self.canStopTrain = true;
                self.canReTrain = false;
                self.canSubsequent = false;
                self.canCheckJupyter = true;
                self.canCheckTensor = true;
                self.canEditHyperparameter = true;
                self.canDeleteTraining = true;
            } else if (self.checkedItems[0].taskrunstatus == 5) {
                self.canStopTrain = false;
                self.canReTrain = false;
                self.canSubsequent = false;
                self.canCheckJupyter = false;
                self.canCheckTensor = false;
                self.canEditHyperparameter = false;
                self.canDeleteTraining = true;
            } else if (self.checkedItems[0].taskrunstatus == 7 || self.checkedItems[0].taskrunstatus == 11) {
                self.canStopTrain = false;
                self.canReTrain = true;
                self.canSubsequent = true;
                self.canCheckJupyter = false;
                self.canCheckTensor = true;
                self.canEditHyperparameter = true;
                self.canDeleteTraining = true;
            } else if (self.checkedItems[0].taskrunstatus == 1 || self.checkedItems[0].taskrunstatus == 9 || self.checkedItems[0].taskrunstatus == 10 || self.checkedItems[0].taskrunstatus == 13) {
                self.canStopTrain = false;
                self.canReTrain = false;
                self.canSubsequent = false;
                self.canCheckJupyter = false;
                self.canCheckTensor = false;
                self.canEditHyperparameter = false;
                self.canDeleteTraining = true;
            } else {
                self.canStopTrain = false;
                self.canReTrain = false;
                self.canSubsequent = false;
                self.canCheckJupyter = false;
                self.canCheckTensor = false;
                self.canEditHyperparameter = false;
                self.canDeleteTraining = true;
            }
            if (self.checkedItems[0].taskengine.toLowerCase() != "tensorflow") {
                self.canCheckTensor = false;
            }
            if (self.checkedItems[0].taskrunstatus == 12) {
                self.canDeleteTraining = false;
                self.canMoreOpt = false;
            }
            if (self.checkedItems[0].taskname == "tf-mnist-cnn-cpu" || self.checkedItems[0].taskname == "tf-lstm-wordpredict" || self.checkedItems[0].taskname == "tensorflow-flower") {
                self.canRealseModel = true;
            } else {
                self.canRealseModel = false;
            }
        } else {
            self.canStopTrain = false;
            self.canReTrain = false;
            self.canSubsequent = false;
            self.canMoreOpt = true;
            self.canDeleteTraining = true;
        }
    }, true);
    //轮询
    function tableStart(data) {
        //需要轮询的数组
        self.resizing = [];
        var compareData = {};
        data.map(x => {
            if (x.taskrunstatus == 2 || x.taskrunstatus == 5 || x.taskrunstatus == 6 || x.taskrunstatus == 12) {
                self.resizing.push(x.uuid);
                compareData[x.uuid] = x.taskrunstatus;
            }
        });
        if (self.resizing.length > 0) {
            //时间重置
            if (JSON.stringify(self.resizeNum) == "{}") {
                self.resizing.map(id => { self.resizeNum[id] = 1; });
            }
            if (!$window.resizeTimer) {
                var options = {
                    uuid: self.resizing.join(",")
                };
                $window.trainTaskResize(options, compareData);
            }
        }
    }
    $window.trainTaskResize = function (options, compareData) {
        var timer = $timeout(function () {
            $window.resizeTimer = true;
            trainmanageSrv.getListStatus(options).then(function (res) {
                if (res && res.data && res.data.data) {
                    for (var i in res.data.data) {
                        var status = res.data.data[i];
                        if (status == null) {
                            if (self.resizing.indexOf(i) > -1) {
                                self.resizing.splice(self.resizing.indexOf(i), 1);
                            }
                            self.taskListData.map(function (obj) {
                                if (obj.uuid == i) {
                                    if (self.taskListData.indexOf(obj) > -1) {
                                        self.taskListData.splice(self.taskListData.indexOf(obj), 1);
                                    }
                                }
                            });
                            successFunc(self.taskListData);
                        } else if (compareData[i] != status) {
                            if (!(status == 0 || status == 2 || status == 5 || status == 6 || status == 12)) {
                                if (self.resizing.indexOf(i) > -1) {
                                    self.resizing.splice(self.resizing.indexOf(i), 1);
                                }
                                delete compareData[i];
                            } else {
                                compareData[i] = status;
                            }
                            self.taskListData.map(function (obj) {
                                if (obj.uuid == i) {
                                    obj.taskrunstatus = status;
                                    self.checkboxes = {
                                        checked: false,
                                        items: {}
                                    };
                                    if (obj.taskrunstatus == 0) {
                                        obj.taskrunstatus_ori = "创建中";
                                    } else if (obj.taskrunstatus == 1) {
                                        obj.taskrunstatus_ori = "创建失败";
                                    } else if (obj.taskrunstatus == 2) {
                                        obj.taskrunstatus_ori = "运行中";
                                    } else if (obj.taskrunstatus == 5) {
                                        obj.taskrunstatus_ori = "调度中";
                                    } else if (obj.taskrunstatus == 6) {
                                        obj.taskrunstatus_ori = "终止中";
                                    } else if (obj.taskrunstatus == 7) {
                                        obj.taskrunstatus_ori = "已终止";
                                    } else if (obj.taskrunstatus == 8) {
                                        obj.taskrunstatus_ori = "终止失败";
                                    } else if (obj.taskrunstatus == 9) {
                                        obj.taskrunstatus_ori = "重新训练失败";
                                    } else if (obj.taskrunstatus == 10) {
                                        obj.taskrunstatus_ori = "继续训练失败";
                                    } else if (obj.taskrunstatus == 11) {
                                        obj.taskrunstatus_ori = "到时限自动终止";
                                    } else if (obj.taskrunstatus == 12) {
                                        obj.taskrunstatus_ori = "删除中";
                                    } else if (obj.taskrunstatus == 13) {
                                        obj.taskrunstatus_ori = "删除失败";
                                    }
                                }
                            });
                        }

                        //轮询一次记录时间的更改。
                        if (self.resizeNum[i]) {
                            self.resizeNum[i] = self.resizeNum[i] + 1;
                        } else {
                            self.resizeNum[i] = 1;
                        }

                        if (self.resizeNum[i] > 151) {
                            if (self.resizing.indexOf(i) > -1) {
                                self.resizing.splice(self.resizing.indexOf(i), 1);
                            }
                        }
                    }
                }
            }).finally(function () {
                if (self.resizing.length > 0 && $window.location.hash.split("/")[2] == "traincluster") {
                    var options = {
                        "uuid": self.resizing.join(",")
                    };
                    $window.trainTaskResize(options, compareData);
                } else {
                    $window.resizeTimer = false;
                    $timeout.cancel(timer);
                }
            });
        }, 10000);
    };
    //详情弹出层动画
    self.$on("getDetail", function (event, value) {
        self.detailTabValue = "0";
        detailInit(value);
        self.detailTabChange = function (tab) {
            if (tab == "basicinfo") {
                self.detailTabValue = "0";
                detailInit(value);
            } else {
                self.detailTabValue = "1";
                podDetailInit(value)
            }
            switch(tab){
                case 'basicinfo':
                    self.detailTabValue = "0";
                    detailInit(value);
                    break;
                case 'example':
                    self.detailTabValue = "1";
                    self.showModel = true;
                    self.showWebshell = false;
                    self.showMinoterCanvas = false;
                    podDetailInit(value);
                    break;
                case 'log':
                    self.detailTabValue = "2";
                    self.getLogLists();
                    self.num = 0;
                    self.showLogBtn = false;
                    break;
            }
        };
        self.checkLog = function (podName, containerName, modelstatus, podstatus) {
            if (containerName&&containerName.length>0) {
                self.detailTabValue = "2";
                self.detailLogContainers = containerName;
                self.detailLogPodName = podName;
                self.logForm = {
                    "container": self.detailLogContainers[0]
                }
                trainmanageSrv.checkLog(podName, containerName[0]).then(res => {
                    if (res && res.data && res.data.data) {
                        self.detailLogInfo = res.data.data;
                    }
                });
            }
        }
        self.logChange = function (podName, containerName) {
            trainmanageSrv.checkLog(podName, containerName).then(res => {
                if (res && res.data && res.data.data) {
                    self.detailLogInfo = res.data.data;
                }
            });
        }
        self.logReturn = function () {
            self.showWebshell = false;
            self.showModel = true;
            self.showMinoterCanvas = false;
        }
        self.podRefresh = function () {
            podDetailInit(value);
        }
        self.watchConsol = function(podName,containerName){
            if (containerName&&containerName.length>0) {
                self.showWebshell = true;
                self.showModel = false;
                self.showMinoterCanvas = false;
                //self.namespace = self.taskDetailData.namespace;
                self.detailLogContainers = containerName;
                self.detailLogPodName = podName;
                self.logForm = {
                    "container": self.detailLogContainers[0]
                }
                self.someUrl = $sce.trustAsResourceUrl(window.GLOBALCONFIG.APIHOST.GATEONE + "?ns=" + self.namespace + "&pid=" + podName + "&cid=" + containerName[0])
            }
            self.logChange = function (podName, containerName) {
                self.someUrl = $sce.trustAsResourceUrl(window.GLOBALCONFIG.APIHOST.GATEONE +"?ns=" + self.namespace + "&pid=" + podName + "&cid=" + containerName)
            }
        }
        self.getLogLists = function(){
            let option = {
                "namespace":self.taskDetailData.namespace,
                "host":"",
                "uuid":self.taskDetailData.uuid,
                "log":"",
                "starttime":"",
                "endtime":"",
                "from":0,
                "size":500
            }
            self.logLists = [];
            logSrv.getLogList(option).then(res=>{
                if(res&&res.data&&res.data.data){
                    self.logLists = res.data.data
                    if(self.logLists.length>=500){
                        self.showLogBtn = true;
                    }
                }
            }).finally(function(){
                self.canGetLog = false;
            })
        }
        self.getMoreLog = function(){
            self.canGetLog = true;
            self.num++;
            let option = {
                "namespace":self.taskDetailData.namespace,
                "host":"",
                "uuid":self.taskDetailData.uuid,
                "log":"",
                "starttime":"",
                "endtime":"",
                "from":self.num,
                "size":500
            }
            logSrv.getLogList(option).then(res=>{
                if(res&&res.data&&res.data.data){
                    if(self.logLists.length>0){
                        self.showLogBtn = true;
                    }else{
                        self.showLogBtn = false;
                    }
                    self.logLists.push(...res.data.data);
                }
            }).finally(function(){
                self.canGetLog = false;
            })
        }
    });
    //训练任务状态：创建中:0,创建失败:1,运行中:2,调度中:5,终止中:6,已终止:7,终止失败:8,重新训练失败:9,继续训练失败:10,到时限自动终止:11,删除中:12,删除失败:13
    function detailInit(val) {
        trainmanageSrv.getTaskDetailData(val).then(function (res) {
            if (res && res.data && res.data.data &&  res.data.data.task) {
                self.taskDetailData = res.data.data.task;
                var taskDetailStatus = self.taskDetailData.taskrunstatus;
                if (taskDetailStatus == 0) {
                    self.taskDetailData.statusTranslate = "创建中";
                } else if (taskDetailStatus == 1) {
                    self.taskDetailData.statusTranslate = "创建失败";
                } else if (taskDetailStatus == 2) {
                    self.taskDetailData.statusTranslate = "运行中";
                } else if (taskDetailStatus == 5) {
                    self.taskDetailData.statusTranslate = "调度中";
                } else if (taskDetailStatus == 6) {
                    self.taskDetailData.statusTranslate = "终止中";
                } else if (taskDetailStatus == 7) {
                    self.taskDetailData.statusTranslate = "已终止";
                } else if (taskDetailStatus == 8) {
                    self.taskDetailData.statusTranslate = "终止失败";
                } else if (taskDetailStatus == 9) {
                    self.taskDetailData.statusTranslate = "重新训练失败";
                } else if (taskDetailStatus == 10) {
                    self.taskDetailData.statusTranslate = "继续训练失败";
                } else if (taskDetailStatus == 11) {
                    self.taskDetailData.statusTranslate = "到时限自动终止";
                } else if (taskDetailStatus == 12) {
                    self.taskDetailData.statusTranslate = "删除中";
                } else if (taskDetailStatus == 13) {
                    self.taskDetailData.statusTranslate = "删除失败";
                }
                self.taskDetailData.taskmetadata = JSON.parse(self.taskDetailData.taskmetadata);
                _.forEach(self.taskDetailData.taskmetadata.resource_groups, function (item) {
                    if (item.cputype) {
                        item.details = "数量：" + item.replica + "，CPU：" + item.cpu + "核，内存：" + item.memory + "G，标签：" + item.name + "，";
                        if (item.pooltype == "shared") {
                            item.details = item.details + "共享";
                        } else {
                            item.details = item.details + "不共享";
                        }
                    } else if (item.gputype) {
                        item.details = "数量：" + item.replica + "，GPU：" + item.nvidiagpu + "核，内存：" + item.memory + "G，标签：" + item.name + "，";
                        if (item.pooltype == "shared") {
                            item.details = item.details + "共享";
                        } else {
                            item.details = item.details + "不共享";
                        }
                    }
                });
                self.paramsData = [];
                if (self.taskDetailData.taskmetadata.params.length) {
                    self.taskDetailData.taskmetadata.params.forEach((item, index) => {
                        var paramsItem = {};
                        if (index != 0 && index%2 == 1) {
                            paramsItem = {
                                "left" : self.taskDetailData.taskmetadata.params[index-1],
                                "right" : self.taskDetailData.taskmetadata.params[index]
                            }
                            self.paramsData.push(paramsItem);
                        }
                    });
                    if  (self.taskDetailData.taskmetadata.params.length % 2 != 0) {
                        var paramsItem = {
                            "left" : self.taskDetailData.taskmetadata.params[self.taskDetailData.taskmetadata.params.length - 1]
                        };
                        self.paramsData.push(paramsItem);
                    }
                }
                self.detailResourceData = [];
                if (self.taskDetailData.taskmetadata.resource_groups.length) {
                    self.taskDetailData.taskmetadata.resource_groups.forEach((item, index) => {
                        var resourceItem = {};
                        if (index != 0 && index%2 == 1) {
                            resourceItem = {
                                "left" : self.taskDetailData.taskmetadata.resource_groups[index-1],
                                "right" : self.taskDetailData.taskmetadata.resource_groups[index]
                            }
                            self.detailResourceData.push(resourceItem);
                        }
                    });
                    if  (self.taskDetailData.taskmetadata.resource_groups.length % 2 != 0) {
                        var resourceItem = {
                            "left" : self.taskDetailData.taskmetadata.resource_groups[self.taskDetailData.taskmetadata.resource_groups.length - 1]
                        };
                        self.detailResourceData.push(resourceItem);
                    }
                }
                self.detailVolumeData = [];
                if (self.taskDetailData.taskmetadata.volume_groups.length) {
                    self.taskDetailData.taskmetadata.volume_groups.forEach((item, index) => {
                        var volumeItem = {};
                        if (index != 0 && index%2 == 1) {
                            volumeItem = {
                                "left" : self.taskDetailData.taskmetadata.volume_groups[index-1],
                                "right" : self.taskDetailData.taskmetadata.volume_groups[index]
                            }
                            self.detailVolumeData.push(volumeItem);
                        }
                    });
                    if  (self.taskDetailData.taskmetadata.volume_groups.length % 2 != 0) {
                        var volumeItem = {
                            "left" : self.taskDetailData.taskmetadata.volume_groups[self.taskDetailData.taskmetadata.volume_groups.length - 1]
                        };
                        self.detailVolumeData.push(volumeItem);
                    }
                }
                self.dataSetList = []
                if(self.taskDetailData.taskmetadata&&self.taskDetailData.taskmetadata.datasets){
                    for(let i in self.taskDetailData.taskmetadata.datasets){
                        let str = ""
                        str += i +":"+ self.taskDetailData.taskmetadata.datasets[i]
                        self.dataSetList.push(str)
                    }
                    self.dataSetListStr = self.dataSetList.join(" "+";"+" ")
                }
            }
        });
    }
    function podDetailInit(val) {
        self.showMinoterCanvas = false;
        self.trainDetailStatusList = [
            {name: "全部",status:"all"},
            {name: "运行",status:"0"},
            {name: "未运行",status:"1"}
        ];
        self.detailDataTitles = {
            "name": "实例名称",
            "status": "运行状态",
            "pod": "Pod IP",
            "host": "主机IP",
            "sshport": "SSH端口",
            "createdtime": "创建时间",
            "option": "操作"
        }
        self.searchOption = {
            "trainDetailGlobalSearchTerm" : ""
        }
        trainmanageSrv.getTaskDetailData(val).then(res => {
            self.detailLoadData = true;
            if (res && res.data && res.data.data && res.data.data.pod) {
                self.detailTableData = res.data.data.pod;
                self.namespace = res.data.data.task.namespace
                self.detailTableData.forEach((item, index) => {
                    item.uuid = index;
                    if (item.startTime) {
                        item.startTime = item.startTime+1000*3600*8;
                        item.startTime_ori = $filter("date")(item.startTime, "yyyy-MM-dd HH:mm:ss");
                    } else {
                        item.startTime_ori = "";
                    }
                    switch (item.status) {
                        case "0":
                            item.status_ori = "运行"
                            break;
                        case "1":
                            item.status_ori = "未运行"
                            break;
                    }
                    item.searchTerm = [item.name, item.status_ori, item.podIP, item.hostIP, item.sshport, item.startTime_ori].join("\b");
                });
                TableCom.init(self, "detailTable", self.detailTableData, "uuid", 10, "");
                trainDetailSearchTerm({tableData:self.detailTableData,titleData:self.trainDetailTitleData});
            }
        });
        self.trainDetailApplyGlobalSearch = function () {
            var term = self.searchOption.trainDetailGlobalSearchTerm;
            self.detailTable.filter({ searchTerm: term });
        }
        self.detailChoiceDataStatus = function (item) {
            self.searchOption.trainDetailGlobalSearchTerm = "";
            self.detailFilterTableData = self.detailTableData.filter(value => {
                if (item.status == "all") {
                    return true;
                } else {
                    if (item.status == value.status) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            TableCom.init(self, "detailTable", self.detailFilterTableData, "uuid", 10, "");
            trainDetailSearchTerm({tableData:self.detailTableData,titleData:self.trainDetailTitleData});
        };
        function trainDetailSearchTerm(obj){
            self.searchOption.trainDetailGlobalSearchTerm = "";
            self.trainDetailApplyGlobalSearch();
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
        }
        self.trainDetailSearchTerm = trainDetailSearchTerm;
    }
    self.refresh = function () {
        trainListInit();
    };
    self.createTrain = function () {
        self.createTrainModel = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "createTrain.html",
            controller: "createTrainCtrl",
            resolve: {
                refresh : function () {
                    return trainListInit;
                },
                context: function () {
                    return self;
                }
            }
        });
    };
    self.stopTrain = function (checkedItems) {
        self.stopTrainCheckedItems = checkedItems;
        let content = {
            msg: "确定要停止所选训练吗？",
            type: "warning",
            func: "confirmStopTrain"
        };
        self.$emit("ui-tag-alert", content);
    };
    self.confirmStopTrain = function () {
        trainmanageSrv.stopTaskData(self.stopTrainCheckedItems[0].uuid).then(() => {
            trainListInit();
        });
    };
    self.retraining = function (checkedItems) {
        self.retrainingCheckedItems = checkedItems;
        let content = {
            msg: "确定要重新训练所选训练吗？",
            type: "warning",
            func: "confirmRetraining"
        };
        self.$emit("ui-tag-alert", content);
    };
    self.confirmRetraining = function () {
        trainmanageSrv.reTrainTaskData(self.retrainingCheckedItems[0].uuid).then(() => {
            trainListInit();
        });
    };
    self.subsequentTraining = function (checkedItems) {
        self.subsequentCheckedItems = checkedItems;
        let content = {
            msg: "确定要继续训练所选训练吗？",
            type: "warning",
            func: "confirmSubsequent"
        };
        self.$emit("ui-tag-alert", content);
    };
    self.confirmSubsequent = function () {
        trainmanageSrv.subsequentTaskData(self.subsequentCheckedItems[0].uuid).then(() => {
            trainListInit();
        });
    };
    //查看Jupyter Notebook
    self.checkJupyter = function (checkedItems) {
        trainmanageSrv.checkJupyterNotebook(checkedItems[0].uuid).then(function (res) {
            if (res && res.data && res.data.data) {
                res.data.data = res.data.data.replace(/https/, "http");
                var taskname = checkedItems[0].taskname + "/?";
                res.data.data = res.data.data.replace(/\?/, taskname);
                window.open(res.data.data, "Jupyter Notebook", "", false);
            }
        });
    };
    //查看tensorboard
    self.checkTensorboard = function (checkedItems) {
        trainmanageSrv.checkTensorboard(checkedItems[0].uuid).then(function (res) {
            if (res && res.data && res.data.data) {
                var ip = res.data.data.split("/")[2];
                var taskname = ip + "/" + checkedItems[0].taskname;
                res.data.data = res.data.data.replace(ip, taskname);
                window.open(res.data.data, "TensorBoard", "");
            }
        });
    };
    //编辑超参数
    self.editTrainParams = function (checkedItems) {
        switch (checkedItems[0].taskname) {
            case "tf-mnist-cnn-cpu":
            case "tf-lstm-wordpredict":
            case "tensorflow-flower":
                self.editTempTrainParamsModel = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    backdrop: "static",
                    templateUrl: "editTempTrainModel.html",
                    controller: "editTempTrainCtrl",
                    resolve: {
                        checkedItems: function () {
                            return checkedItems;
                        },
                        context: function () {
                            return self;
                        }
                    }
            });
                break;
            default:
                self.editTrainParamsModel = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    backdrop: "static",
                    templateUrl: "editTrainModel.html",
                    controller: "editTrainCtrl",
                    resolve: {
                        checkedItems: function () {
                            return checkedItems;
                        },
                        context: function () {
                            return self;
                        }
                    }
                });
                break;
        }
    };
    //删除训练
    self.deleteTraining = function (checkedItems) {
        self.deleteTrainCheckedItems = checkedItems;
        let content = {
            msg: "您确定删除所选的训练吗？",
            type: "warning",
            func: "confirmDeleteTrain"
        };
        self.$emit("ui-tag-alert", content);
    };
    self.confirmDeleteTrain = function () {

        // trainmanageSrv.deleteTraining(self.deleteTrainCheckedItems[0].uuid).then(() => {
        //     trainListInit();
        // });
        for(let i=0;i<self.deleteTrainCheckedItems.length;i++){
            (function(i){
                trainmanageSrv.deleteTraining(self.deleteTrainCheckedItems[i].uuid).then(() => {
                    //trainListInit();
                });
            })(i)
        }
    };

    //发布模型
    self.relaseModel = function (checkedItems) {
        self.relaseModelModel = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "relaseModel.html",
            controller: "relaseModelCtrl",
            resolve: {
                refresh : function () {
                    return trainListInit;
                },
                context: function () {
                    return self;
                },
                checkedItems: function () {
                    return checkedItems;
                }
            }
        });
    };

    self.showMinoterCanvas = false
    self.activeFlag = "1h";
    // 查看监控
    self.params={
        last:"1h",     // 最近时间范围
        interval:"300"    // 间隔时间
    }
    
    self.backToDetails=function(){
        self.showWebshell = false;
        self.showModel = true;
        self.showMinoterCanvas = false;
    }
    // 获取数据
    self.gpuCount = [];
    function getPodMonitorData(podName,params,timeType){
        self.gpuCount = [];
        trainmanageSrv.getPodMonitorMemory(podName,params).then(function(res){
            if(res&&res.data&&res.data.data){
                initData(res.data.data,"podMonitorMemory",timeType)
                getModuleMonitorData()
            }
        })
        trainmanageSrv.getPodMonitorCpu(podName,params).then(function(res){
            if(res&&res.data&&res.data.data){
                initData(res.data.data,"podMonitorCpu",timeType)
                getModuleMonitorData()
            }
        })
        trainmanageSrv.getPodMonitorGpu(podName,params).then(function(res){
            if(res&&res.data&&res.data.data&&res.data.data.length>0){
                for(let i=0;i<res.data.data.length;i++){
                    self.gpuCount[i] = {
                        total:res.data.data[i].memory?res.data.data[i].memory:[],
                        stamp:res.data.data[i].stamp?res.data.data[i].stamp:[],
                        used:res.data.data[i].used?res.data.data[i].used:[],
                        alloc:res.data.data[i].load?res.data.data[i].load:[],                      
                    }
                    initData(self.gpuCount[i],"podMonitorCpu"+i,timeType)
                    getModuleMonitorData()
                }
            }
        })
    }
    function getModuleMonitorData(){
        self.resInfo = []
        self.resInfo.push({
            title:"CPU核数使用状态(个)",   
            showNoData :self.podMonitorCpu&&self.podMonitorCpu.alloc&&self.podMonitorCpu.alloc.length>0?true:false,                
            data:{
                x_data:['分配CPU核数','实际使用CPU核数','总CPU核数'],
                series: [
                    {
                        name:'分配CPU核数',
                        type:'line',
                        color:"rgba(81, 163, 255, 1)",
                        data:self.podMonitorCpu?self.podMonitorCpu.alloc:[],
                        time:self.podMonitorCpu?self.podMonitorCpu.time:[],
                        yAxisIndex:0,
                    },
                    {
                        name:'实际使用CPU核数',
                        type:'line',
                        color:"rgba(243, 156, 18, 1)",
                        data:self.podMonitorCpu?self.podMonitorCpu.used:[],
                        time:self.podMonitorCpu?self.podMonitorCpu.time:[],
                        yAxisIndex:0,
                    },
                ]
            }
        },
        {
            title:"内存使用状态(GB)",
            showNoData :self.podMonitorMemory&&self.podMonitorMemory.alloc&&self.podMonitorMemory.alloc.length>0?true:false,                                
            data:{
                x_data:['分配内存数','实际使用内存数','总内存数'],
                series: [
                    {   
                        name:'分配内存数',
                        type:'line',
                        color:"rgba(81, 163, 255, 1)",
                        data:self.podMonitorMemory?self.podMonitorMemory.alloc:[],
                        time:self.podMonitorMemory?self.podMonitorMemory.time:[],
                        yAxisIndex:0,
                    },
                    {
                        name:'实际使用内存数',
                        type:'line',
                        color:"rgba(243, 156, 18, 1)",
                        data:self.podMonitorMemory?self.podMonitorMemory.used:[],
                        time:self.podMonitorMemory?self.podMonitorMemory.time:[],
                        yAxisIndex:0,
                    }
                ]
            }
        })
        if(self.gpuCount.length>0){
            for(let i=0;i<self.gpuCount.length;i++){
                self.resInfo.push(
                    {
                        title:"GPU_"+i+"使用量(GB)",   
                        showNoData :self["podMonitorCpu"+i]&&self["podMonitorCpu"+i].used&&self["podMonitorCpu"+i].used.length>0?true:false,                
                        data:{
                            x_data:['GPU显存使用量','GPU负载（%）','GPU显存总量'],
                            series: [
                                {
                                    name:'GPU显存使用量',
                                    type:'line',
                                    color:"rgba(81, 163, 255, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].used:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:0,
                                },
                                {
                                    name:'GPU负载（%）',
                                    type:'line',
                                    color:"rgba(243, 156, 18, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].alloc:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:1,
                                },
                                {
                                    name:'GPU显存总量',
                                    type:'line',
                                    color:"rgba(22, 160, 133, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].total:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:0,
                                },
                            ]
                        }
                    }
                )
            }
        }
        return self.resInfo
    }

    // 数据处理
    function initData(data,type,timeType){
        self[type] = {
            used : [],
            total : [],
            time : [],
            alloc : []
        }
        if(data&&data.total&&angular.isArray(data.total)){
            data.total.forEach(ele => {
                self[type].total.push(ele)
            });
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

    self.watchMinoter = function(item){
        self.showMinoterCanvas = true;
        self.showWebshell = false;
        self.showModel = false;
        self.podName = item;
        getPodMonitorData(self.podName,self.params,"time")
    } 

    function resetChartData(self,arg){
        for(let i=0;i<arg.length;i++){
            self[arg[i]] = {};
        }
    }

    self.changeDataByTime = function(data,time){
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
        for(let i=0;i<self.gpuCount.length;i++){
            resetChartData(self,['podMonitorMemory','podMonitorCpu',"podMonitorCpu"+i]);
        }
        getPodMonitorData(self.podName,self.params,self.timeType)
        self.activeFlag = data;
    }
}]);
trainclusterModule.controller("createTrainCtrl", ["$scope", "context", "refresh", "trainmanageSrv", function ($scope, context, refresh, trainmanageSrv) {
    var self = $scope;
    self.TaskengineData = [];
    self.versionListData = [];
    self.typeData = [];
    self.caffeTypeData = [];
    self.allTypeData = [];
    self.volumeData = [];
    self.addVolumes = [];
    self.sshKeyList = [];
    self.dataSetList = [];
    self.dataSetNameList = [];
    self.sshoption = {};
    self.verifyTableData = context.taskListData;
    self.keyname = "taskname";
    self.firstStepQuota = false;
    self.trainForm = {
        "session_cpu_num": 1,
        "session_memory_num": 1,
        "session_nvidiagpu_num": 1,
        "trainType": "single",
        "session_pooltype": true,
        "resource_groups": [],
        "volume_groups": [],
        "tasktime": 1000,
        "session_train_trigger_method": "default",
        "session_train_trigger_command": "",
        "log_dir": "",
        "data_dir": "",
        "model_dir": "",
        "params": [{ "pattern": "[\^\"]{0,}", "paramsDesc": "不能输入英文的双引号" }],
        "configOPtion": {
            "method": "defaultConfig",
            "typeFlavor": ""
        }
    };
    self.inStep = 1;
    self.trainFormInfo = {
        cpuPattern: "[1-9]\\d*",
        cpuName: "sessionCpuName",
        cpuDesc: "只能输入正整数",
        memoryPattern: "[1-9]\\d*",
        memoryName: "sessionMemoryName",
        memoryDesc: "只能输入正整数",
        gpuName: "sessionGpuName",
        addNumber: 1,
        memoryAddNumber: 1,
        tasktimeName: "tasktimeName"
    };
    self.showSessionGpu = false;
    self.configOPtion = {
        "method": "defaultConfig",
        "typeFlavor": ""
    }

    self.addDataSetTitle = function(){
        self.dataSetList.push({
            name:"",
            mountCatalog:""
        })
    }
    self.deleDataSet = function(num){
        self.dataSetList.splice(num,1)
    }

    function getDataSetList(){
        trainmanageSrv.getDataSetList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.dataSetNameList = res.data.data
            }
        })
    }
    getDataSetList();


    function createTrainInit() {
        trainmanageSrv.getVolumesData().then(function (res) {
            if (res && res.data && res.data.data) {
                self.volumeModelData = res.data.data;
                self.volumeData[0] = [];
                _.forEach(self.volumeModelData, function (item) {
                    var obj = {};
                    obj.pvc = item.volumename;
                    self.volumeData[0].push(obj);
                });
                self.allVolumeData = angular.copy(self.volumeData[0]);
            }
        });
        trainmanageSrv.getEngineListData().then(function (res) {
            if (res && res.data && res.data.data) {
                self.TaskengineData = res.data.data;
                self.trainForm.session_train_engine = self.TaskengineData[0];
                trainmanageSrv.getVersionListData(self.TaskengineData[0].uuid).then(function (result) {
                    if (result && result.data && result.data) {
                        self.versionListData = result.data.data;
                        self.trainForm.session_train_engine_version = self.versionListData[0];
                    }
                });
                trainmanageSrv.getNodeTypeData().then(function (res) {
                    if (res && res.data && res.data.data) {
                        _.forEach(res.data.data, function (item) {
                            var obj = {};
                            obj.name = item.name;
                            obj.type = item.type;
                            obj.option = item.name;
                            self.typeData.push(obj);
                            if (obj.type != "gpu") {
                                self.caffeTypeData.push(obj);
                            }
                        });
                        self.allTypeData = angular.copy(self.typeData);
                        self.trainForm.session_cputype = self.allTypeData[0];
                        trainmanageSrv.getFlavorList().then(res => {
                            if (res && res.data && res.data.data) {
                                self.allFlavorList = res.data.data;
                                self.cpuFlavorList = self.allFlavorList.filter(item => {
                                    if (item.gpu == 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                self.gpuFlavorList = self.allFlavorList.filter(item => {
                                    if (item.gpu != 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                            }
                            self.seessionTypeChange = function () {
                                if (self.trainForm.session_cputype.type == "gpu") {
                                    self.showSessionGpu = true;
                                    self.flavorList = self.gpuFlavorList;
                                    self.trainForm.configOPtion.typeFlavor = self.flavorList[0];
                                    self.typeData = self.allTypeData;
                                    if (self.trainForm.session_train_engine.name == "caffe") {
                                        self.canAddResourceGroups = true;
                                    }
                                } else {
                                    self.showSessionGpu = false;
                                    self.flavorList = self.cpuFlavorList;
                                    self.trainForm.configOPtion.typeFlavor = self.flavorList[0];
                                    self.typeData = self.allTypeData;
                                    if (self.trainForm.session_train_engine.name == "caffe") {
                                        self.canAddResourceGroups = false;
                                        self.typeData = self.caffeTypeData;
                                    }
                                }
                            };
                            self.seessionTypeChange();
                        });
                        
                    }
                });
            }
        });
        trainmanageSrv.getSSHkeyList().then(res => {
            if (res && res.data && res.data.data) {
                self.sshKeyList = res.data.data;
            }
        });
        trainmanageSrv.getUsersQuota(localStorage.userId).then((res) => {
            if (res && res.data && res.data.data) {
                self.quotaInfo = res.data.data;
            }
        });
    }
    createTrainInit();
    //获取引擎对应的版本
    self.getVersionData = function (id) {
        self.versionListData = [];
        self.trainForm.resource_groups = [];
        if (self.trainForm.trainType == "single") {
            self.trainForm.resource_groups = [];
        } else if (self.trainForm.trainType == "distributed") {
            if (self.trainForm.session_train_engine.name.toLowerCase() == "tensorflow") {
                addTensorflowModel();
                addTensorflowModel();
                self.trainForm.resource_groups[0].name = "ps";
                self.trainForm.resource_groups[0].typeData = angular.copy(self.caffeTypeData);
                self.trainForm.resource_groups[0].cputype = self.trainForm.resource_groups[0].typeData[0];
                self.modelChange(self.trainForm.resource_groups[0]);
                self.trainForm.resource_groups[1].name = "worker";
                self.trainForm.resource_groups[1].typeData = angular.copy(self.allTypeData);
                self.trainForm.resource_groups[1].cputype = self.trainForm.resource_groups[1].typeData[0];
                self.modelChange(self.trainForm.resource_groups[1]);
            } else {
                addTensorflowModel();
                self.trainForm.resource_groups[0].typeData = angular.copy(self.allTypeData);
                self.trainForm.resource_groups[0].cputype = self.trainForm.resource_groups[0].typeData[0];
                self.trainForm.resource_groups[0].name = "worker";
                self.modelChange(self.trainForm.resource_groups[0]);
            }
        }
        trainmanageSrv.getVersionListData(id).then(function (res) {
            if (res && res.data && res.data.data) {
                self.versionListData = res.data.data;
                self.trainForm.session_train_engine_version = self.versionListData[0];
            }
        });
        //session中引擎选择caffe且机型选择gpu机型时隐藏资源组,引擎选择caffe且机型选择cpu机型时资源组中的机型只能选择cpu
        if (self.trainForm.session_cputype) {
            self.canAddResourceGroups = false;
            if (self.trainForm.session_cputype.type == "gpu") {
                self.typeData = self.allTypeData;
                if (self.trainForm.session_train_engine.name == "caffe") {
                    self.canAddResourceGroups = true;
                }
            } else {
                self.typeData = self.allTypeData;
                self.canAddResourceGroups = false;
                if (self.trainForm.session_train_engine.name == "caffe") {
                    self.canAddResourceGroups = false;
                    self.typeData = self.caffeTypeData;
                }
            }
        }
    };
    self.trainTypeChange = function () {
        if (self.trainForm.trainType == "single") {
            self.trainForm.resource_groups = [];
        } else if (self.trainForm.trainType == "distributed") {
            if (self.trainForm.session_train_engine.name.toLowerCase() == "tensorflow") {
                addTensorflowModel();
                addTensorflowModel();
                self.trainForm.resource_groups[0].name = "ps";
                self.trainForm.resource_groups[0].typeData = angular.copy(self.caffeTypeData);
                self.trainForm.resource_groups[0].cputype = self.trainForm.resource_groups[0].typeData[0];
                self.modelChange(self.trainForm.resource_groups[0]);
                self.trainForm.resource_groups[1].name = "worker";
                self.trainForm.resource_groups[1].typeData = angular.copy(self.allTypeData);
                self.trainForm.resource_groups[1].cputype = self.trainForm.resource_groups[1].typeData[0];
                self.modelChange(self.trainForm.resource_groups[1]);
            } else {
                addTensorflowModel();
                self.trainForm.resource_groups[0].typeData = angular.copy(self.allTypeData);
                self.trainForm.resource_groups[0].cputype = self.trainForm.resource_groups[0].typeData[0];
                self.trainForm.resource_groups[0].name = "worker";
                self.modelChange(self.trainForm.resource_groups[0]);
            }
        }
    }
    
    //下一步
    self.stepTo = function (formName) {
        self.resourceNameRepeat = false;
        self.confirmParamsName = false;
        self.createQuota = {
            "cpu_create_used" : 0,
            "disk_create_used" : 0,
            "gpu_create_used" : 0,
            "memory_create_used" : 0,
            "cpuOverQuota": false,
            "gpuOverQuota": false,
            "memoryOverQuota": false,
            "sameCataLog":false,
        }
        if (self.inStep == 1) {
            self.firstStepQuota = false;
            if (formName.$valid) {
                var resourceMap = {};
                for (var i = 0; i < self.trainForm.resource_groups.length; i++) {
                    if (!resourceMap[self.trainForm.resource_groups[i].name]) {
                        resourceMap[self.trainForm.resource_groups[i].name] = true;
                    } else {
                        self.resourceNameRepeat = true;
                        return false;
                    }
                }
                
                for(let i = 0; i < self.dataSetList.length; i++){
                    for(let j = i+1; j < self.dataSetList.length; j++){
                        if(self.dataSetList[i].mountCatalog == self.dataSetList[j].mountCatalog){
                            self.createQuota.sameCataLog = true;
                            break;
                        }
                    }
                }            
                if (self.trainForm.configOPtion.method == "defaultConfig") {
                    self.trainForm.session_cpu_num = self.trainForm.configOPtion.typeFlavor.cpu;
                    self.trainForm.session_nvidiagpu_num = self.trainForm.configOPtion.typeFlavor.gpu;
                    self.trainForm.session_memory_num = self.trainForm.configOPtion.typeFlavor.memory;
                }
                self.trainForm.resource_groups.forEach(element => {
                    if (element.configOPtion.method == "defaultConfig") {
                        element.cpu = element.configOPtion.typeFlavor.cpu;
                        element.memory = element.configOPtion.typeFlavor.memory;
                        element.nvidiagpu = element.configOPtion.typeFlavor.gpu;
                    }
                });
                if (self.trainForm.session_train_engine.name.toLowerCase() == "tensorflow") {
                    self.trainForm.resource_groups.forEach(item => {
                        if (item.configOPtion.method == "defaultConfig") {
                            self.createQuota.cpu_create_used += item.cpu * item.replica;
                            self.createQuota.gpu_create_used += item.nvidiagpu * item.replica;
                        } else {
                            if (item.cputype.type == "cpu") {
                                self.createQuota.cpu_create_used += item.cpu * item.replica;
                            } else if (item.cputype.type == "gpu") {
                                self.createQuota.cpu_create_used += item.cpu * item.replica;
                                //0720
                                self.createQuota.gpu_create_used += item.nvidiagpu * item.replica;
                            }
                        }
                        self.createQuota.memory_create_used += item.memory * item.replica;
                    });
                    self.createQuota.cpu_create_used += self.trainForm.session_cpu_num*1 + 2;
                    self.createQuota.memory_create_used += self.trainForm.session_memory_num*1 + 2;
                    if (self.trainForm.session_cputype.type == "gpu") {
                        self.createQuota.gpu_create_used += self.trainForm.session_nvidiagpu_num*1;
                    }
                } else {
                    self.trainForm.resource_groups.forEach(item => {
                        if (item.configOPtion.method == "defaultConfig") {
                            self.createQuota.cpu_create_used += item.cpu * item.replica;
                            self.createQuota.gpu_create_used += item.nvidiagpu * item.replica;
                        } else {
                            if (item.cputype.type == "cpu") {
                                self.createQuota.cpu_create_used += item.cpu * item.replica;
                            } else if (item.cputype.type == "gpu") {
                                self.createQuota.cpu_create_used += item.cpu * item.replica;
                                //0720
                                self.createQuota.gpu_create_used += item.nvidiagpu * item.replica;
                            }
                        }
                        self.createQuota.memory_create_used += item.memory * item.replica;
                    });
                    self.createQuota.cpu_create_used += self.trainForm.session_cpu_num*1;
                    self.createQuota.memory_create_used += self.trainForm.session_memory_num*1;
                    if (self.trainForm.session_cputype.type == "gpu") {
                        self.createQuota.gpu_create_used += self.trainForm.session_nvidiagpu_num*1;
                    }
                }
                if (self.quotaInfo.cpu_hard - self.quotaInfo.cpu_used < self.createQuota.cpu_create_used) {
                    self.createQuota.cpuOverQuota = true;
                } else {
                    self.createQuota.cpuOverQuota = false;
                }
                if (self.quotaInfo.gpu_hard - self.quotaInfo.gpu_used < self.createQuota.gpu_create_used) {
                    self.createQuota.gpuOverQuota = true;
                } else {
                    self.createQuota.gpuOverQuota = false;
                }
                if (self.quotaInfo.memory_hard - self.quotaInfo.memory_used < self.createQuota.memory_create_used) {
                    self.createQuota.memoryOverQuota = true;
                } else {
                    self.createQuota.memoryOverQuota = false;
                }
                if (self.createQuota.cpuOverQuota || self.createQuota.gpuOverQuota || self.createQuota.memoryOverQuota || self.createQuota.sameCataLog) {
                    self.firstStepQuota = true;
                } else {
                    self.firstStepQuota = false;
                }
                if (self.firstStepQuota) {
                    return false;
                }
            }
        }
        if (self.inStep == 3) {
            if (formName.$valid) {
                if (self.trainForm.session_train_engine.name == "caffe") {
                    if (self.trainForm.session_cputype.type == "gpu") {
                        self.trainForm.resource_groups = [];
                    }
                }
                //session选择mxnet引擎且资源组中含有多个机型时，添加PS_NUN和WORKER_NUM两个默认的超参数
                if (self.trainForm.session_train_engine.name.toLowerCase() == "mxnet" && self.trainForm.resource_groups.length > 0) {
                    if (!(self.trainForm.params[0].name == "PS_NUM" && self.trainForm.params[1].name == "WORKER_NUM")) {
                        self.trainForm.params = [
                            { "name": "PS_NUM", "value": "", "canChangeName": true, "pattern": "[1-9]\\d*", "paramsDesc": "只能输入正整数" },
                            { "name": "WORKER_NUM", "value": "", "canChangeName": true, "pattern": "[1-9]\\d*", "paramsDesc": "只能输入正整数" }
                        ];
                    }
                    //回退时如果切换session中的引擎，清空默认的两个超参数。
                } else {
                    if (self.trainForm.params.length > 0) {
                        if (self.trainForm.params[0].name == "PS_NUM" && self.trainForm.params[1].name == "WORKER_NUM") {
                            self.trainForm.params = [{
                                "pattern": "[\^\"]{0,}",
                                "paramsDesc": "不能输入英文的双引号"
                            }];
                        }
                    }
                }
            } else {
                self.createThirdFormValid = true;
                return false;
            }
        }
        if (self.inStep == 4) {
            self.saveTrainForm = angular.copy(self.trainForm);
            self.confirmParamsName = false;
            if (formName.$valid) {
                delete self.trainForm.configOPtion;
                self.trainForm.session_train_engine = self.trainForm.session_train_engine.name.toLowerCase();
                if (self.trainForm.session_cputype.type == "cpu") {
                    self.trainForm.session_cputype = self.trainForm.session_cputype.name;
                    self.trainForm.session_nvidiagpu_num = 0;
                } else if (self.trainForm.session_cputype.type == "gpu") {
                    self.trainForm.session_gputype = self.trainForm.session_cputype.name;
                    delete self.trainForm.session_cputype;
                }
                self.trainForm.session_cpu_num = Number(self.trainForm.session_cpu_num);
                self.trainForm.session_nvidiagpu_num = Number(self.trainForm.session_nvidiagpu_num);
                self.trainForm.session_memory_num = Number(self.trainForm.session_memory_num);
                if (self.trainForm.session_pooltype == true) {
                    self.trainForm.session_pooltype = "shared";
                } else if (self.trainForm.session_pooltype == false) {
                    self.trainForm.session_pooltype = "unshared";
                }
                if (self.trainForm.session_train_engine_version) {
                    self.trainForm.session_train_engine_version = self.trainForm.session_train_engine_version.version;
                }
                self.trainForm.tasktime = self.trainForm.tasktime * 1;
                var temporaryData = [];
                _.forEach(self.trainForm.resource_groups, function (item) {
                    var temporaryObj = {};
                    temporaryObj.cpu = item.cpu * 1;
                    temporaryObj.memory = item.memory * 1;
                    temporaryObj.replica = item.replica * 1;
                    temporaryObj.name = item.name;
                    temporaryObj.nvidiagpu = item.nvidiagpu*1;
                    temporaryObj.supportgpu = item.supportgpu;
                    if (item.pooltype == true) {
                        temporaryObj.pooltype = "shared";
                    } else if (item.pooltype == false) {
                        temporaryObj.pooltype = "unshared";
                    }
                    if (item.configOPtion.method == "defaultConfig") {
                        if (item.cputype.type == "gpu") {
                            temporaryObj.gputype = item.gputype;
                            temporaryObj.nvidiagpu = item.nvidiagpu * 1;
                            temporaryObj.cpu = item.cpu * 1;
                            temporaryObj.supportgpu = true;
                        } else {
                            temporaryObj.cputype = item.cputype.name;
                        }
                    } else {
                        if (item.gputype) {
                            temporaryObj.gputype = item.gputype;
                            //0720
                            //temporaryObj.nvidiagpu = item.nvidiagpu;
                            //temporaryObj.cpu = 1;
                            temporaryObj.supportgpu = true;
                        } else {
                            temporaryObj.cputype = item.cputype.name;
                            //0720
                            temporaryObj.nvidiagpu = 0;
                        }
                    }
                    temporaryData.push(temporaryObj);
                });
                self.trainForm.resource_groups = temporaryData;
                _.forEach(self.trainForm.volume_groups, function (item, index) {
                    if (index == 0) {
                        item.required = true;
                    }
                });
                var temporaryParams = [];
                //session选择mxnet引擎且资源组有多个机型时，添加对默认超参数的值的必填项验证
                if (self.trainForm.session_train_engine.toLowerCase() == "mxnet" && self.trainForm.resource_groups.length > 0) {
                    if (self.trainForm.params[0].value && self.trainForm.params[1].value) {
                        self.trainForm.params.map(function (item) {
                            if (item.name && item.value) {
                                var temporaryParamsObj = {};
                                temporaryParamsObj.name = item.name;
                                temporaryParamsObj.value = item.value;
                                temporaryParams.push(temporaryParamsObj);
                            }
                        });
                        self.trainForm.params = temporaryParams;
                        self.confirmMxnetParams = false;
                    } else {
                        self.confirmMxnetParams = true;
                        self.trainForm = angular.copy(self.saveTrainForm);
                    }
                } else {
                    self.trainForm.params.map(function (item) {
                        if (item.name && item.value) {
                            var temporaryParamsObj = {};
                            temporaryParamsObj.name = item.name;
                            temporaryParamsObj.value = item.value;
                            temporaryParams.push(temporaryParamsObj);
                        }
                    });
                    self.trainForm.params = temporaryParams;
                }
                //利用对象的映射完成超参数重名的判断
                if (!self.confirmMxnetParams) {
                    var paramsNameMap = {};
                    for (var i = 0; i < self.trainForm.params.length; i++) {
                        if (!paramsNameMap[self.trainForm.params[i].name]) {
                            paramsNameMap[self.trainForm.params[i].name] = true;
                        } else {
                            self.confirmParamsName = true;
                            break;
                        }
                    }
                    if (!self.confirmParamsName) {
                        self.inStep++;
                    } else {
                        self.trainForm = angular.copy(self.saveTrainForm);
                    }
                } else {
                    self.trainForm = angular.copy(self.saveTrainForm);
                }
            }
        } else {
            if (formName.$valid) {
                self.inStep++;
            } else {
                self[formName.$name + "Valid"] = true;
            }
        }
    };
    //上一步
    self.stepBack = function () {
        if (self.inStep == 2) {
            if (self.trainForm.configOPtion.method == "defaultConfig") {
                self.trainForm.session_cpu_num = 1;
                self.trainForm.session_nvidiagpu_num = 1;
                self.trainForm.session_memory_num = 1;
            }
            self.trainForm.resource_groups.forEach(element => {
                if (element.configOPtion.method == "defaultConfig") {
                    element.cpu = 1;
                    element.memory = 1;
                }
            });
        }
        if (self.inStep == 5) {
            self.trainForm = angular.copy(self.saveTrainForm);
        }
        self.inStep--;
    };
    //添加资源组的机型个数
    self.addTrainModel = function () {
        if (self.trainForm.session_train_engine.name.toLowerCase() == "tensorflow") {
            if (self.trainForm.resource_groups.length < 2) {
                addTensorflowModel()
                addTensorflowModel()
                self.trainForm.resource_groups.map((item, index) => {
                    item.numName = item.numName + index;
                    item.coreName = item.coreName + index;
                    item.memoryName = item.memoryName + index;
                    if (index == 0) {
                        item.name = "ps";
                    } else if (index == 1) {
                        item.name = "worker";
                    }
                });
            }
        } else {
            addTensorflowModel();
            self.trainForm.resource_groups.map((item, index) => {
                item.numName = item.numName + index;
                item.coreName = item.coreName + index;
                item.memoryName = item.memoryName + index;
            });
        }
    };
    function addTensorflowModel() {
        self.trainForm.resource_groups.push({
            "name": "",
            "replica": 1,
            "cpu": 1,
            "memory": 1,
            "cputype": "",
            "pooltype": true,
            "nvidiagpu": 1,
            "supportgpu": false,
            "numName": "typeNumber_",
            "numPattern": "[1-9]\\d*",
            "numDesc": "只能输入正整数",
            "coreName": "coreNumber_",
            "gpuName": "gpuName_",
            "corePattern": "(^[1-9]\\d*$)|(^0\\.[1-9]$)|(^[1-9]\\d*\\.[1-9]$)",
            "coreDesc": "只能输入保留一位有效数字的小数和正整数",
            "memoryName": "memory_",
            "configOPtion": {
                "method": "defaultConfig"
            }
        });
    }
    //机型选择切换时切换机型的类型
    self.modelChange = function (item) {
        if (item.cputype.type == "gpu") {
            item.gputype = item.cputype.name;
            item.nvidiagpu = 1;
        }else{
            item.nvidiagpu = 0;
        }
        getResourceFlavor(item);
    };
    function getResourceFlavor(item) {
        if (item.cputype.type == "cpu") {
            item.flavorList = angular.copy(self.cpuFlavorList);
        } else if (item.cputype.type == "gpu") {
            item.flavorList = angular.copy(self.gpuFlavorList);
        }
    }
    //添加附加存储卷
    self.addVolume = function (formName) {
        if (formName.$valid) {
            self.addVolumes.push({});
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
    //存储卷切换时更新下拉框的数组防止一个存储卷被多次选取
    self.volumeChange = function (index) {
        self.volumeData[index] = [];
        if (self.allVolumeData && self.allVolumeData.length) {
            for (var i = 0; i < self.allVolumeData.length; i++) {
                var obj = self.allVolumeData[i];
                var num = obj.pvc;
                var isExist = false;
                for (var j = 0; j < self.trainForm.volume_groups.length; j++) {
                    var aj = self.trainForm.volume_groups[j];
                    var n = aj.pvc;
                    if (n == num) {
                        if (j == index) {
                            isExist = false;
                            break;
                        } else {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    self.volumeData[index].push(obj);
                }
            }
        }
    };
    //添加超参数
    self.addParams = function (formName) {
        if (formName.$valid) {
            self.trainForm.params.push({
                "pattern": "[^\"]{0,}",
                "paramsDesc": "不能输入英文的双引号"
            });
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
    //超参数和资源组机型的移除
    self.removeModel = function (arrayData, index, type) {
        if (type == "resource") {
            if (self.trainForm.session_train_engine.name == "Tensorflow") {
                arrayData.splice(0, 2);
            } else {
                arrayData.splice(index, 1);
            }
        } else if (type == "params") {
            arrayData.splice(index, 1);
        }
        
    };
    //移除附加存储卷
    self.removeVolume = function (index) {
        self.addVolumes.splice(index - 1, 1);
        self.trainForm.volume_groups.splice(index, 1);
    };
    //更新数据集下拉框
    self.datasetChange = function (item) {
        self.unselectedList = [];
        var map = {};
        self.dataSetList.forEach(value => {
            if (value.name) {
                map[value.name] = true;
                if (item.name == value.name) {
                   map[value.name] = false;
                }
            }
        });
        self.dataSetNameList.forEach(value => {
            if (!map[value.pvcname]) {
                self.unselectedList.push(value);
            }
        });
    }
    //创建任务
    self.createConfirm = function (data) {
        data.datasets = {};
        self.dataSetList.forEach(item => {
            data.datasets[item.name] = item.mountCatalog
        });
        // trainmanageSrv.createTaskData(data).then(function () {
        //     refresh();
        // });
        // self.$dismiss();
        for(let i=0;i<40;i++){
            (function(i){
                var dat = angular.copy(data);
                dat.taskname = dat.taskname+i+'test';
                trainmanageSrv.createTaskData(dat).then(function () {
                    if(i==39){refresh()};
                })
            })(i)
        }
    };
}]);
trainclusterModule.controller("editTrainCtrl", ["$scope", "trainmanageSrv", "checkedItems", "context", function ($scope, trainmanageSrv, checkedItems, context) {
    var self = $scope;
    self.trainInfo = JSON.parse(context.checkedItems[0].taskmetadata);
    self.paramsData = [];
    function editInit() {
        trainmanageSrv.getTaskDetailData(checkedItems[0].uuid).then(function (res) {
            if (res && res.data && res.data.data) {
                res.data.data.task.taskmetadata = JSON.parse(res.data.data.task.taskmetadata);
                self.taskengine = res.data.data.task.taskengine;
                self.resource_groups = res.data.data.task.taskmetadata.resource_groups;
                _.forEach(res.data.data.task.taskmetadata.params, function (item, index) {
                    var paramsDataObj = {};
                    paramsDataObj.name = item.name;
                    paramsDataObj.value = item.value;
                    if (res.data.data.task.taskengine.toLowerCase() == "mxnet" && self.resource_groups.length > 0) {
                        if (index == 0 || index == 1) {
                            paramsDataObj.canChangeName = true;
                            paramsDataObj.pattern = "[1-9]\\d*";
                            paramsDataObj.paramsDesc = "只能输入正整数";
                        } else {
                            paramsDataObj.pattern = "[^\"]{0,}";
                            paramsDataObj.paramsDesc = "不能输入英文的双引号";
                        }
                    } else {
                        paramsDataObj.pattern = "[^\"]{0,}";
                        paramsDataObj.paramsDesc = "不能输入英文的双引号";
                    }
                    self.paramsData.push(paramsDataObj);
                });
                if (self.paramsData.length == 0) {
                    self.paramsData = [{
                        "pattern": "[^\"]{0,}",
                        "paramsDesc": "不能输入英文的双引号"
                    }];
                }
            }
        });
    }
    editInit();
    //移除超参数
    self.removeParams = function (index) {
        self.paramsData.splice(index, 1);
    };
    //添加超参数
    self.addParams = function () {
        self.paramsData.push({
            "pattern": "[^\"]{0,}",
            "paramsDesc": "不能输入英文的双引号"
        });
    };
    //确认编辑超参数
    self.editConfirm = function (formName) {
        if (formName.$valid) {
            self.editParamsFromValid = false;
            self.confirmEditParamsName = false;
            var saveEditParamsData = {
                "params": [],
                "taskUuid": checkedItems[0].uuid,
            };
            self.paramsData.map(function (item) {
                if (item.name && item.value) {
                    var obj = {};
                    obj.name = item.name;
                    obj.value = item.value;
                    saveEditParamsData.params.push(obj);
                }
            });
            var paramsNameMap = {};
            if (self.taskengine.toLowerCase() == "mxnet" && self.trainInfo.resource_groups.length > 0) {
                if (self.paramsData[0].value && self.paramsData[1].value) {
                    for (var i = 0; i < saveEditParamsData.params.length; i++) {
                        if (!paramsNameMap[saveEditParamsData.params[i].name]) {
                            paramsNameMap[saveEditParamsData.params[i].name] = true;
                        } else {
                            self.confirmEditParamsName = true;
                            break;
                        }
                    }
                    if (!self.confirmEditParamsName) {
                        trainmanageSrv.editTrainParams(saveEditParamsData).then(() => {
                            context.editTrainParamsModel.close();
                            context.refresh();
                        })
                    }
                }
            } else {
                for (var i = 0; i < saveEditParamsData.params.length; i++) {
                    if (!paramsNameMap[saveEditParamsData.params[i].name]) {
                        paramsNameMap[saveEditParamsData.params[i].name] = true;
                    } else {
                        self.confirmEditParamsName = true;
                        break;
                    }
                }
                if (!self.confirmEditParamsName) {
                    trainmanageSrv.editTrainParams(saveEditParamsData).then(() => {
                        context.editTrainParamsModel.close();
                        context.refresh();
                    });
                }
            }
        } else {
            self.editParamsFromValid = true;
        }
    };
}]);
trainclusterModule.controller("editTempTrainCtrl", ["$scope", "trainmanageSrv", "checkedItems", "context", function ($scope, trainmanageSrv, checkedItems, context) {
    var self = $scope;
    function editInit() {
        self.taskname = checkedItems[0].taskname;
        self.paramsData = JSON.parse(checkedItems[0].taskmetadata).params;
        switch (checkedItems[0].taskname) {
            case "tf-mnist-cnn-cpu":
                self.paramsPattern = [
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": false
                    },
                    {
                        "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                        "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                        "isRequired": false
                    },
                    {
                        "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                        "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                        "isRequired": false
                    },
                    {
                        "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                        "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                        "isRequired": false
                    },
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": false,
                        "id": "steps"
                    },
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": true,
                        "id": "eval_step",
                    }
                ]
                break;
            case "tf-lstm-wordpredict":
            self.paramsPattern = [
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                },
                {
                    "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                }
            ]
                break;
            case "tensorflow-flower":
                self.paramsPattern = [
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": false
                    },
                    {
                        "pattern": "^0\.[0-9]*[1-9]$|^1$",
                        "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                        "isRequired": false
                    },
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": false
                    },
                    {
                        "pattern": "[1-9]\\d*",
                        "patternInfo": "只能输入正整数",
                        "isRequired": false
                    }
                ]
                break;
            default:
                break;
        }
        if (checkedItems[0].taskname == "tf-mnist-cnn-cpu") {
            self.$watch(function () {
                return angular.element("#steps").val();
            },function (val) {
                if (val*1 == val && angular.element("#eval_step").val()*1 == angular.element("#eval_step").val()) {
                    if (val >= angular.element("#eval_step").val()) {
                        self.overStep = false;
                    } else {
                        self.overStep = true;
                    }
                } else {
                    self.overStep = false;
                }
            });
            self.$watch(function () {
                return angular.element("#eval_step").val();
            },function (val) {
                if (val*1 == val && angular.element("#steps").val()*1 == angular.element("#steps").val()) {
                    if (val <= angular.element("#steps").val()) {
                        self.overStep = false;
                    } else {
                        self.overStep = true;
                    }
                } else {
                    self.overStep = false;
                }
            });
        }
    }
    editInit();
    //确认编辑超参数
    self.editConfirm = function (formName) {
        if (formName.$valid) {
            self.editParamsFromValid = false;
            var saveEditParamsData = {
                "params": [],
                "taskUuid": checkedItems[0].uuid,
            };
            self.paramsData.map(function (item) {
                if (item.name && item.value) {
                    var obj = {};
                    obj.name = item.name;
                    obj.value = item.value;
                    saveEditParamsData.params.push(obj);
                }
            });
            trainmanageSrv.editTrainParams(saveEditParamsData).then(() => {
                context.editTempTrainParamsModel.close();
                context.refresh();
            });
        } else {
            self.editParamsFromValid = true;
        }
    };
}]);

trainclusterModule.controller("relaseModelCtrl", ["$scope", "context", "refresh", "trainmanageSrv", "checkedItems", function ($scope, context, refresh, trainmanageSrv, checkedItems) {
    var self = $scope;
    self.typeData = [];
    self.allTypeData = [];
    self.caffeTypeData = [];
    self.volumeData = [];
    self.modelForm = {
        "modelname": checkedItems[0].taskname,
        "replicas":1,
        "session_cpu_num": 1,
        "session_memory_num": 1,
        "sessionimage": JSON.parse(context.checkedItems[0].taskmetadata).sessionimage,
        "replicas": 1,
        "session_train_engine":JSON.parse(context.checkedItems[0].taskmetadata).session_train_engine,
        "session_train_engine_version":JSON.parse(context.checkedItems[0].taskmetadata).session_train_engine_version,
        "volume_groups": JSON.parse(context.checkedItems[0].taskmetadata).volume_groups
    };
    self.modelFormInfo = {
        cpuPattern: "(^[1-9]\\d*$)|(^0\\.[1-9]$)|(^[1-9]\\d*\\.[1-9]$)",
        cpuName: "sessionCpuName",
        cpuDesc: "只能输入保留一位有效数字的小数和正整数",
        memoryPattern: "[1-9]\\d*",
        memoryName: "sessionMemoryName",
        memoryDesc: "只能输入正整数",
        gpuName: "sessionGpuName",
        addNumber: 1,
        memoryAddNumber: 1,
        replicasName: "replicasName"
    };
    function createModelInit() {
        trainmanageSrv.getNodeTypeData().then(function (res) {
            if (res && res.data && res.data.data) {
                _.forEach(res.data.data, function (item) {
                    var obj = {};
                    obj.name = item.name;
                    obj.type = item.type;
                    self.typeData.push(obj);
                    if (obj.type != "gpu") {
                        self.caffeTypeData.push(obj);
                    }
                });
                self.allTypeData = angular.copy(self.typeData);
            }
        });
        trainmanageSrv.getVolumesData().then(function (res) {
            if (res && res.data && res.data.data) {
                self.volumeModelData = res.data.data;
                self.volumeData[0] = [];
                _.forEach(self.volumeModelData, function (item) {
                    var obj = {};
                    obj.pvc = item.volumename;
                    self.volumeData[0].push(obj);
                });
                self.allVolumeData = angular.copy(self.volumeData[0]);
            }
        });
        trainmanageSrv.getUsersQuota(localStorage.userId).then((res) => {
            if (res && res.data && res.data.data) {
                self.quotaInfo = res.data.data;
            }
        });
    }
    createModelInit();
    self.confirm = function (formName) {
        self.overQuota = false;
        if (formName.$valid) {
            if (self.quotaInfo.cpu_hard - self.quotaInfo.cpu_used < self.modelForm.session_cpu_num * self.modelForm.replicas) {
                self.cpuOverQuota = true;
            } else {
                self.cpuOverQuota = false;
            }
            if (self.quotaInfo.memory_hard - self.quotaInfo.memory_used < self.modelForm.session_memory_num * self.modelForm.replicas) {
                self.memoryOverQuota = true;
            } else {
                self.memoryOverQuota = false;
            }
            if (self.cpuOverQuota || self.memoryOverQuota) {
                self.overQuota = true;
            } else {
                self.overQuota = false;
            }
            if (!self.overQuota) {
                var option = {
                    "modelname": self.modelForm.modelname,
                    "session_cpu_num": self.modelForm.session_cpu_num,
                    "replicas": self.modelForm.replicas,
                    "sessionimage": self.modelForm.sessionimage,
                    "session_memory_num": self.modelForm.session_memory_num,
                    "session_train_engine": self.modelForm.session_train_engine,
                    "session_train_engine_version": self.modelForm.session_train_engine_version,
                    "volume_groups": [self.modelForm.volume_groups[0]]
                };
                option.volume_groups[0].required = true;
                if (self.modelForm.session_cputype.type == "cpu") {
                    option.session_cputype = self.modelForm.session_cputype.name;
                } else {
                    option.session_gputype = self.modelForm.session_cputype.name;
                    option.session_nvidiagpu_num = self.modelForm.session_nvidiagpu_num;
                }
                trainmanageSrv.createModel(option).then(() => {
                    refresh();
                });
                context.relaseModelModel.close();
            }
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
}]);

export default trainclusterModule.name;