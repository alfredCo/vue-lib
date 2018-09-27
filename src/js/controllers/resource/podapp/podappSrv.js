let podappService = angular.module("podappService", []);
podappService.service("podappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getPodAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "pods/list"
            });
        },
        getPodAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/pods/" + options.name
            });
        }
    }
}])