let systemInfoService = angular.module("systemInfoService", []);
systemInfoService.service("systemInfoSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getSystemInfo: function() {
            return $http({
                method: "GET",
                url: static_url + "license"
            });
        }
    };
}]);