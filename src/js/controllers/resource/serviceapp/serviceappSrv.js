let serviceappService = angular.module("serviceappService", []);
serviceappService.service("serviceappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getServiceAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "services/list"
            });
        },
        getServiceAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/services/" + options.name
            });
        }
    }
}])