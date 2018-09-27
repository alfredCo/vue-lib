let jobappService = angular.module("jobappService", []);
jobappService.service("jobappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getJobAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "jobs/list"
            });
        },
        getJobAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/jobs/" + options.name
            });
        }
    }
}])