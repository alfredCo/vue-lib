let replicasetsappService = angular.module("replicasetsappService", []);
replicasetsappService.service("replicasetsappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getReplicasetsAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "replicasets/list"
            });
        },
        getReplicasetsAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/replicasets/" + options.name
            });
        }
    }
}])