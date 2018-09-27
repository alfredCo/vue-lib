let monitorService = angular.module("monitorService", []);
monitorService.service("monitorSrv", ["$http" ,function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getMonitorCpu: function (params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/cluster/cpu",
                params:params
            });
        },
        getMonitorMemory: function (params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/cluster/memory",
                params:params
            });
        },
        getMonitorGpu: function (params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/cluster/gpu",
                params:params
            });
        },
        getNodeMonitorCpu: function (nodeName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/node/" + nodeName + "/cpu",
                params: params
            });
        },
        getNodeMonitorMemory: function (nodeName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/node/"+ nodeName +"/memory",
                params: params
            });
        },
        getNodeMonitorGpu: function (nodeName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/node/"+ nodeName +"/gpu",
                params: params
            });
        },
        getPodMonitorCpu: function (podName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/pod/" + podName + "/cpu",
                params: params
            });
        } ,
        getPodMonitorMemory: function (podName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/pod/" + podName + "/memory",
                params: params
            });
        } ,
        getProMonitorCpu: function (proName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/proj/" + proName + "/cpu",
                params: params
            });
        },
        getProMonitorMemory: function (proName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/proj/"+ proName +"/memory",
                params: params
            });
        },
        getProMonitorGpu: function (proName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/proj/"+ proName +"/gpu",
                params: params
            });
        },
        getNodeName: function(){
            return $http({
                method: "GET",
                url: static_url + "nodes",
            });
        },
        getProjectList:function(){
            return $http({
                method: "GET",
                url: "user-manager/v1/projects",
            });
        },
        getMonitorVolume: function(params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/cluster/volume",
                params: params
            });
        }
    };
}]);
