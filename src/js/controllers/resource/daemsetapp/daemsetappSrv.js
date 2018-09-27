let daemsetappService = angular.module("daemsetappService", []);
daemsetappService.service("daemsetappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getDaemsetAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "daemonsets/list"
            });
        },
        getDaemsetAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/daemonsets/" + options.name
            });
        }
    }
}])