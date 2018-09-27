let modelapplicService = angular.module("modelapplicService", []);
modelapplicService.service("modelapplicSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getTaskListData: function () {
            return $http({
                method: "GET",
                url: static_url + "train/task"
            });
        }
    };
}]);