let configmanageService = angular.module("configManageSrv", []);
configmanageService.service("configManageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getConfigList: function () {
            return $http({
                method: "GET",
                url: static_url + "flavors"
            });
        },
        createConfig: function (options) {
            return $http({
                method: "POST",
                url: static_url + "flavor",
                data: options
            });
        },
        editConfig: function (options, id) {
            return $http({
                method: "PUT",
                url: static_url + "flavor/" + id,
                data: options
            });
        },
        deleteConfig: function (option) {
            return $http({
                method: "DELETE",
                url: static_url + "flavor/" + option
            });
        }
    }
}]);