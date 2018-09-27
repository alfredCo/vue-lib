let modelmanageService = angular.module("modelmanageService", []);
modelmanageService.service("modelmanageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getModelList: function () {
            return $http({
                method: "GET",
                url: static_url + "train/model"
            });
        },
        createModel: function (option) {
            return $http({
                method: "POST",
                url: static_url + "train/publishModel",
                data: option
            });
        },
        getModelStatus: function (option) {
            return $http({
                method: "POST",
                url: static_url + "round/mode/task/scan",
                data: option
            });
        },
        getNodeTypeData: function () {
            return $http({
                method: "GET",
                url: static_url + "nodetype"
            });
        },
        getVolumesData: function () {
            return $http({
                method: "GET",
                url: static_url + "train/task/volume"
            });
        },
        getEngineListData: function () {
            return $http({
                method: "GET",
                url: static_url + "/engines"
            });
        },
        getVersionListData: function (uuid) {
            return $http({
                method: "GET",
                url: static_url + "engine/" + uuid + "/engineVersions"
            });
        },
        deleteListData: function (option) {
            return $http({
                method: "POST",
                url: static_url + "train/model/deletemodel",
                data: option
            });
        },
        getListStatus: function (data) {
            return $http({
                method: "POST",
                url: static_url + "round/mode/task/scan",
                data: data
            });
        },
        setReplicas: function (data) {
            return $http({
                method: "POST",
                url: static_url + "train/model/setreplicas",
                data: data
            });
        },
        stopmodel: function (data) {
            return $http({
                method: "POST",
                url: static_url + "train/model/stopmodel",
                data: data
            });
        },
        startUsing: function (data) {
            return $http({
                method: "POST",
                url: static_url + "train/model/restartmodel",
                data: data
            });
        },
        getTaskDetailData: function (id) {
            return $http({
                method: "GET",
                url: static_url + "train/model/" + id
            })
        },
        checkLog: function (podname, container) {
            return $http({
                method: "GET",
                url: static_url + "k8s/dockerclusterreplica/" + podname +"/log/" + container
            })
        },
        getPodMonitorCpu: function (podName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/pod/" + podName + "/cpu",
                params: params
            });
        },
        getPodMonitorMemory: function (podName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/pod/" + podName + "/memory",
                params: params
            });
        },
        getPodMonitorGpu: function (podName,params) {
            return $http({
                method: "GET",
                url: static_url + "monitor/gpu/pod/" + podName,
                params: params
            });
        },
        getUsersQuota: function (id) {
            return $http({
                method: "GET",
                url: "user-manager/v1/users/" + id + "/quota/traintask"
            })
        }
    };
}]);