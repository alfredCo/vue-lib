let storageVolumeService = angular.module("storageVolumeService", []);
storageVolumeService.service("storageVolumeSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getVolumeList: function () {
            return $http({
                method: "GET",
                url: static_url + "train/task/volume"
            });
        },
        createVolume: function (option) {
            return $http({
                method: "POST",
                url: static_url + "pvc",
                data: option
            });
        },
        deleteVolume: function (option) {
            return $http({
                method: "DELETE",
                url: static_url + "pvc?" + option
            });
        },
        getVolumeQuota: function (option) {
            return $http({
                method: "GET",
                url: "user-manager/v1/users/" + option + "/quota/createpvc"
            });
        },
        getMonitorVolume: function(namespace ,volName, params) {
            return $http({
                method: "GET",
                url: static_url + "/monitor/proj/" + namespace + "/volume/" + volName,
                params: params
            });
        },
        getstorageLoadStatus: function(name) {
            return $http({
                method: "GET",
                url: static_url + "pvc/manager/"+name
            });
        }
    };
}]);