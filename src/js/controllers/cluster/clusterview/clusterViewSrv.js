let clusterViewSrvModule = angular.module("clusterViewSrv", []);
clusterViewSrvModule.service("clusterViewSrv", ["$http", function ($http) {
    let static_url = "user-manager/v1/";
    return {
        getQuotas: function () {
            return $http({
                method: "GET",
                url: static_url + "users/quota"
            });
        },
        getCluterInfo:function () {
            return $http({
                method: "GET",
                url: "resource-manager/v1/resource/all/count"
            });
        },
        getCluterUserCount:function () {
            return $http({
                method: "GET",
                url: "/user-manager/v1/users"
            });
        },
    };
}]);