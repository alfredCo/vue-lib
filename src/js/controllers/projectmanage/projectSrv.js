var projectService = angular.module("projectSrv", []);
projectService.service('projectSrv', ["$http","$q", function ($http,$q) {
    return {
        getProjectist:function(){
            return $http({
                method: 'get',
                url: "/user-manager/v1/projects"
            })
        },
        createProjct:function(data){
            return $http({
                method: 'POST',
                url: "/user-manager/v1/projects",
                data:data
            })
        },
        editProject:function(data,id){
            return $http({
                method: 'put',
                url: "/user-manager/v1/projects/" + id,
                data:data
            })
        },
        getProjectDetail:function(id){
            return $http({
                method: 'get',
                url: "/user-manager/v1/project/" + id
            })
        },
        delProject:function(id){
            return $http({
                method: 'delete',
                url: "/user-manager/v1/projects/" + id
            }) 
        },
        getProjectQuota:function(params){
            return $http({
                method: 'get',
                url: "/user-manager/v1/projects/quota",
                params:params
            })
        },   
        getUserList:function(projectId){
            return $http({
                method: 'GET',
                //url: "/user-manager/v1/consumer"
                url: "/user-manager/v1/consumer/"+projectId+"/users"
            })
        },
        getBindUser:function(id){
            return $http({
                method: 'get',
                url: "/user-manager/v1/projects/" + id + "/users"
            })
        },
        allowProjct:function(data ,id){
            return $http({
                method: 'put',
                url: "/user-manager/v1/projects/" + id + "/users",
                data:data
            })
        },
    }
}])