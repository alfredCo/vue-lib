import resViewSrvModule from './resourceviewSrv';

let resourceviewModule = angular.module("resourceviewModule", ["resViewSrvModule"]);
resourceviewModule.controller("resourceviewCtrl",["$scope" ,"$rootScope" ,"$translate","resViewSrv",function(scope,rootScope,$translate,resViewSrv){
    var self= scope ;
    self.clusterData = {
        total:"0",
        chartTitle:"训练集群数",
        colorList:["#1abc9c","#4e80f5","#f39c12","#e74c3c","#b6a2dd","#666666","#4a6583"],
        chartData:[
            {
                value:"0"
            },{
                value:"0"
            },
            {
                value:"0"
            },
            {
                value:"0"
            },{
                value:"0"
            },
            {
                value:"0"
            },
            {
                value:"0"
            }
        ],
        clusterData:{
            finish:"0",
            error:"0",
            createing:0,
            stoping:0,
            scheduleing:0,
            running:0,
            deleting:0
        }
    }
    self.modelData = {
        total:"0",
        chartTitle:"托管模型数",
        colorList:["#1abc9c","#4e80f5","#f39c12","#e74c3c","#b6a2dd","#666666","#4a6583"],
        chartData:[
            {
                value:"0"
            },{
                value:"0"
            },
            {
                value:"0"
            },
            {
                value:"0"
            },{
                value:"0"
            },
            {
                value:"0"
            },
            {
                value:"0"
            }
        ],
        modelData:{
            disable:"0",
            error:"0",
            createing:0,
            disabling:0,
            scheduleing:0,
            running:0,
            deleting:0
        }
    }
    self.quotaData = {
        cpu:{
            total:0,
            inUsed:0,
            added: 0,
            beAdded: 0,
            unit:"个",
            label:"CPU核"
        },
        memory:{
            total: 0,
            inUsed:0,
            added: 0,
            beAdded: 0,
            unit:"GB",
            label:"内存"
        },
        storage:{
            total: 0,
            inUsed:0,
            added: 0,
            beAdded: 0,
            unit:"GB",
            label:"存储卷"
        },
        gpu:{
            inUsed:0,
            total:0,
            added: 0,
            beAdded: 0,
            unit:"个",
            label:"GPU"
        },
    };
    if ((localStorage.selectedUserName != "admin"&& localStorage.selectedUserId!="allUsers") || !!(localStorage.selectedUserName == "admin" && !rootScope.userListChangeSuccess)) {
        getQuotas();
        getUserRes();
    }
    self.$watch(function () {
        return rootScope.userListChangeSuccess;
    }, function (val) {
        if (val == true) {
            getQuotas();
            getUserRes();
        }
    });
    
    function getQuotas(){
        resViewSrv.getUserQuotas(localStorage.userId).then(function(data){
            if(data && data.data && data.data.data){
                var result = data.data.data
                self.quotaData = {
                    cpu:{
                        total:result.cpu_hard,
                        inUsed:result.cpu_used,
                        added: 0,
                        beAdded: 0,
                        unit:"个",
                        label:"CPU核"
                    },
                    memory:{
                        total: result.memory_hard,
                        inUsed:result.memory_used,
                        added: 0,
                        beAdded: 0,
                        unit:"GB",
                        label:"内存"
                    },
                    storage:{
                        total: result.disk_hard,
                        inUsed:result.disk_used,
                        added: 0,
                        beAdded: 0,
                        unit:"GB",
                        label:"存储卷"
                    },
                    gpu:{
                        inUsed:result.gpu_used,
                        total:result.gpu_hard,
                        added: 0,
                        beAdded: 0,
                        unit:"个",
                        label:"GPU"
                    },
                };
            }
        })
    }
    function getUserRes(){
        resViewSrv.getUserRes().then(function(data){
            if(data && data.data && data.data.data ){
                var result = data.data.data
                if(result.trainTask){
                    self.clusterData.total = result.trainTask.total;
                    self.clusterData.chartData = [{
                        value:result.trainTask.running
                    },{
                        value:result.trainTask.scheduleing
                    },{
                        value:result.trainTask.finish
                    },{
                        value:result.trainTask.error
                    },{
                        value:result.trainTask.createing
                    },{
                        value:result.trainTask.deleting
                    },{
                        value:result.trainTask.stoping
                    },
                ];
                    self.clusterData.clusterData = result.trainTask;
                }
                if(result.model){
                    self.modelData.total = result.model.total;
                    self.modelData.chartData = [{
                        value:result.model.running
                    },{
                        value:result.model.scheduleing
                    },{
                        value:result.model.disable
                    },{
                        value:result.model.error
                    },{
                        value:result.model.createing
                    },{
                        value:result.model.deleting
                    },{
                        value:result.model.disabling
                    },
                ];
                    self.modelData.modelData = result.model;
                }
            }
        })
    }
}]);


export default resourceviewModule.name;