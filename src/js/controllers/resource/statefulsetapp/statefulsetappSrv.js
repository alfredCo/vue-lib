let statefulsetappService = angular.module("statefulsetappService", []);
statefulsetappService.service("statefulsetappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getStatefulsetAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "statefulsets/list"
            });
        },
        getStatefulsetAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/statefulsets/" + options.name
            });
        }
    }
}])