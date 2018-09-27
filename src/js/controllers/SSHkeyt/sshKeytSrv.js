let sshKeytService = angular.module("sshKeytService", []);
sshKeytService.service("sshKeytSrv", ["$http", function ($http) {
    let static_url = "user-manager/v1/";
    return {
        getKeyList: function(option) {
            return $http({
                method: "GET",
                url: static_url + "keypairs",
                params: option
            });
        },
        createKey: function(option) {
            return $http({
                method: "POST",
                url: static_url + "keypairs/online",
                data: option
            });
        },
        importKey: function(option) {
            return $http({
                method: "POST",
                url: static_url + "keypairs/import",
                data: option
            });
        },
        deleteKey: function(keyId) {
            return $http({
                method: "DELETE",
                url: static_url + "keypairs/" + keyId
            });
        }
    };
}]);