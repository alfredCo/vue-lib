let trainmanageService = angular.module("trainmanageService", []);
trainmanageService.service("trainmanageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getTaskListData: function () {
            return $http({
                method: "GET",
                url: static_url + "train/task"
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
        getTaskDetailData: function (uuid) {
            return $http({
                method: "GET",
                url: static_url + "train/task/" + uuid
            });
        },
        getEngineListData: function () {
            return $http({
                method: "GET",
                url: static_url + "engines"
            });
        },
        getVersionListData: function (uuid) {
            return $http({
                method: "GET",
                url: static_url + "engine/" + uuid + "/engineVersions"
            });
        },
        createTaskData: function (data) {
            return $http({
                method: "POST",
                url: static_url + "train/task",
                data: data
            });
        },
        stopTaskData: function (id) {
            return $http({
                method: "delete",
                url: static_url + "train/task/stop/" + id
            });
        },
        reTrainTaskData: function (uuid) {
            return $http({
                method: "GET",
                url: static_url + "retrain/task/" + uuid
            });
        },
        subsequentTaskData: function (uuid) {
            return $http({
                method: "GET",
                url: static_url + "continue/task/" + uuid
            });
        },
        checkJupyterNotebook: function (id) {
            return $http({
                method: "GET",
                url: static_url + "train/task/jupyterNotebook/" + id
            });
        },
        checkTensorboard: function (id) {
            return $http({
                method: "GET",
                url: static_url + "train/task/tensorboard/" + id
            });
        },
        editTrainParams: function (data) {
            return $http({
                method: "POST",
                url: static_url + "train/task/updateParams",
                data: data
            });
        },
        deleteTraining: function (id) {
            return $http({
                method: "delete",
                url: static_url + "train/task/delete/" + id
            });
        },
        getListStatus: function (data) {
            return $http({
                method: "POST",
                url: static_url + "round/train/task/scan",
                data: data
            });
        },
        getSSHkeyList: function () {
            return $http({
                method: "GET",
                url: "user-manager/v1/keypairs"
            });
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
            });
        },
        getFlavorList: function () {
            return $http({
                method: "GET",
                url: static_url + "flavors"
            });
        },
        createModel: function (option) {
            return $http({
                method: "POST",
                url: static_url + "train/publishModel",
                data: option
            });
        },
        getDataSetList: function () {
            return $http({
                method: "GET",
                url: static_url + "datasets?onlyAvailable=true",
            });
        }
    };
}]);