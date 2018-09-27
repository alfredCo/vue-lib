let logService = angular.module("logService", []);
logService.service("logSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getNodeName: function(){
            return $http({
                method: "GET",
                url: static_url + "nodes",
            });
        },
        getProjectList:function(){
            return $http({
                method: 'GET',
                url: "/user-manager/v1/projects"
            })
        },
        getTaskList:function(){
            return $http({
                method: "GET",
                url: static_url + "elasticsearch/task"
            });
        },
        getModelList: function () {
            return $http({
                method: "GET",
                url: static_url + "elasticsearch/model"
            });
        },
        getLogList: function (option) {
            /*
            option = {
                "namespace":"admin",
                "host":"k8s-node1",
                "taskname":"mxnetmodel",
                "log":"mxnetmodel",
                "starttime":"2018-07-02",
                "endtime":"2018-07-04",
                "from":0,
                "size":10
            }
            */
            return $http({
                method: "POST",
                url: static_url + "elasticsearch",
                data: option
            });
        }
    };
}]);