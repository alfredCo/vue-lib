let deploymentappService = angular.module("deploymentappService", []);
deploymentappService.service("deploymentappSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getDeploymentAppList: function () {
            return $http({
                method: "GET",
                url: static_url + "deployments/list"
            });
        },
        getDeploymentAppDetail: function (options) {
            return $http({
                method: "GET",
                url: static_url + options.namespace + "/deployments/" + options.name
            });
        }
    }
}])