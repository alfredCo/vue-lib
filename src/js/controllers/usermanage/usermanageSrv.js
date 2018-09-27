var tableService = angular.module("userManageSrv", []);
tableService.service('userManageSrv', ["$http", function ($http) {
    return {
        getUserList: function () {
            return $http({
                method: 'get',
                url: "/user-manager/v1/consumer"
            })
        },
        getProjectList :function(){
            return $http({
                method: 'get',
                url: "/user-manager/v1/projects",
            })
            // var data = [
            //     {projectID:"1",name:"aaa"},
            //     {projectID:"2",name:"bbb"},
            //     {projectID:"3",name:"ccc"},
            // ];
            // var deferred = $q.defer();
            // deferred.resolve(data);
            // return deferred.promise;
        },
        createUser:function (data) {
            return $http({
                method: 'POST',
                url: "/user-manager/v1/consumer",
                data:data
            })
        },
        editUser:function (id,data) {
            return $http({
                method: 'PUT',
                url: "/user-manager/v1/consumer/"+id,
                data:data
            })
        },
        delUser:function (id) {
            return $http({
                method: 'delete',
                url: "/user-manager/v1/consumer/"+id,
            })
        }
    }
}])