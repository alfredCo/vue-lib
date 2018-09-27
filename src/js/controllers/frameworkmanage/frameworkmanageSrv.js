let frameworkmanageService = angular.module("frameworkManageSrv", []);
frameworkmanageService.service("frameworkManageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getFrameworkList: function () {
            return $http({
                method: "GET",
                url: static_url + "engines"
            });
        },
        createFramework: function (option) {
            return $http({
                method: "POST",
                url: static_url + "engine",
                data: option
            });
        },
        deleteFramework: function (id) {
            return $http({
                method: "DELETE",
                url: static_url + "engine/" + id
            });
        },
        getVersionList: function (id) {
            return $http({
                method: "GET",
                url: static_url + "engine/" + id + "/engineVersions"
            });
        },
        createVserion: function (options) {
            return $http({
                method: "POST",
                url: static_url + "engine/" + options.engineId + "/engineVersion",
                data: options
            });
        },
        deleteVersion: function (engineId,id) {
            return $http({
                method: "DELETE",
                url: static_url + "engine/" + engineId + "/engineVersion/" + id
            });
        }
    }
}]);