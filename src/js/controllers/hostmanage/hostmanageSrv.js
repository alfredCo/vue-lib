let hostmanageService = angular.module("hostmanageService", []);
hostmanageService.service("hostmanageSrv", ["$http" ,function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getHostList: function () {
            return $http({
                method: "GET",
                url: static_url + "nodes"
            });
        },
        getLabelList: function (option) {
            return $http({
                method: "GET",
                url: static_url + "nodes/" + option + "/labels"
            });
        },
        setLabelList: function (option, nodeName) {
            return $http({
                method: "POST",
                url: static_url + "nodes/" + nodeName + "/labels",
                data: option
            });
        },
        editLabelList: function (option, nodeName) {
            return $http({
                method: "PUT",
                url: static_url + "nodes/" + nodeName + "/labels",
                data: option
            });
        },
        deleteLabelList: function (option, nodeName) {
            return $http({
                method: "DELETE",
                url: static_url + "nodes/" + nodeName + "/labels?" + option
            });
        },
        getNodeTypeData: function () {
            return $http({
                method: "GET",
                url: static_url + "nodetype"
            });
        }
    };
}]);