let imagemanageService = angular.module("imagemanageService", []);
imagemanageService.service("imagemanageSrv", ["$http", function ($http) {
    let static_url = "resource-manager/v1/";
    return {
        getImageList: function () {
            return $http({
                method: "GET",
                url: static_url + "images"
            });
        },
        createImage: function (option) {
            return $http({
                method: "POST",
                url: static_url + "images",
                data: option
            });
        },
        deleteImage: function (id) {
            return $http({
                method: "DELETE",
                url: static_url + "image/" + id
            });
        },
        getTypeList: function () {
            return $http({
                method: "GET",
                url: static_url + "nodetype"
            });
        },
        getEnginesList:function(){
            return $http({
                method: "GET",
                url: static_url + "engines"
            });
        },
        getEnginesVersionList:function(id){
            return $http({
                method: "GET",
                url: static_url + "engine/"+id+"/engineVersions"
            });
        }
    };
}]);