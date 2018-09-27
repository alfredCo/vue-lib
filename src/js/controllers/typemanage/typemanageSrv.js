let typemanageService = angular.module("typeManageSrv", []);
typemanageService.service("typeManageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getTypeList: function () {
            return $http({
                method: "GET",
                url: static_url + "nodetype"
            });
        }
    }
}]);