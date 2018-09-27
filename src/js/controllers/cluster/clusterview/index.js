import clusterViewSrv from './clusterViewSrv';

let clusterViewModule = angular.module("clusterViewModule", ["clusterViewSrv"]);
clusterViewModule.controller("clusterViewCtrl",["$scope","$translate","clusterViewSrv",function(scope,$translate,clusterViewSrv){
    var self= scope ;
    getQuotas()
    getCluterInfo()
    getCluterUserCount()
    function getQuotas(){
        clusterViewSrv.getQuotas().then(function(data){
            if(data && data.data && data.data.data){
                var result = data.data.data
                self.quotaData = {
                    cpu:{
                        //total:result.user.cpu_hard,
                        total:result.node.cpu,
                        inUsed:result.user.cpu_used,
                        hard:result.user.cpu_hard,
                        added: 0,
                        beAdded: 0,
                        //node:result.node.cpu,
                        unit:"个"
                    },
                    memory:{
                        total: result.node.memory,
                        inUsed:result.user.memory_used,
                        hard:result.user.memory_hard,
                        added: 0,
                        beAdded:0 ,
                        unit:"GB"
                    },
                    storage:{
                        total: result.node.storage,
                        inUsed:result.user.disk_used,
                       // node:result.node.storage,
                        hard:result.user.disk_hard,
                        added: 0,
                        beAdded: 0,
                        unit:"GB"
                    },
                    gpu:{
                        inUsed:result.user.gpu_used,
                        hard:result.user.gpu_hard,
                        total:result.node.gpu,
                        added: 0,
                        beAdded: 0,
                        unit:"个"
                    },
                };
            }
        })
    };
    function getCluterInfo(){
        clusterViewSrv.getCluterInfo().then(function(data){
            if(data && data.data && data.data.data){
                var result = data.data.data
                self.cluterInfo = result;
            }
        })
    };
    function getCluterUserCount(){
        clusterViewSrv.getCluterUserCount().then(function(data){
            if(data && data.data && data.data.data){
                var result = data.data.data
                self.userCount = result.length;
            }
        })
    };
}]);


export default clusterViewModule.name;