let resViewSrvModule = angular.module("resViewSrvModule", []);
resViewSrvModule.service("resViewSrv", ["$http", function ($http) {
    let static_url = "user-manager/v1/";
    return {
        getUserQuotas: function (id) {
            return $http({
                method: "GET",
                url: "/user-manager/v1/users/"+id+"/quota",
            });
        },
        getUserRes:function(){
            return $http({
                method: "GET",
                url: "/resource-manager/v1/resource/user/count",
            });
        },
    };
}]);