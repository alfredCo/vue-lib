let dataSetSrvTab = angular.module("dataSetSrvTab", []);
dataSetSrvTab.service("dataSetSrv", ["$http","$q", function ($http,$q) {
    let static_url = "resource-manager/v1/";  
    let static_user =  "user-manager/v1/"; 
    return {
        getDataSetList: function () {
            return $http({
                method: "GET",
                url: static_url + "datasets",
            });
        },
        createDataSet: function(data){
           return $http({
                method: "POST",
                url: static_url + "datasets",
                data: data
            })
        },
        editDataSet: function(name,data){
            return $http({
                method: "PUT",
                url: static_url + "datasets/" + name,
                data: data
            })
        },
        dataSetDetail: function(name){
            return $http({
                method: "GET",
                url: static_url + "datasets/" + name,
            });
        },
        deleteDataSet: function(params){
            return $http({
                method: "DELETE",
                url: static_url + "datasets",
                params: params
            })
        },
        getProjectList: function () {
            return $http({
                method: "GET",
                url: static_user + "projects"
            });
        },
        getFilemngurl:function(name){
            return $http({
                method: "GET",
                url: static_url + "datasets/" + name + "/filemngurl"
            });
        },
        getDataSetDetail:function(name){
            return $http({
                method: "GET",
                url: static_url + "datasets/" + name
            });
        }
    };
}]);

export default dataSetSrvTab.name;
