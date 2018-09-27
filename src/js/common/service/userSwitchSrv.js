var userSwitchModule = angular.module("userSwitchModule", []);

userSwitchModule.service("userSwitchSrv", [function() {
    var btnData = {
        traincluster: false,
        storagevolume: false,
        modeltrustee: false,
        sshKeyt: false,
        datasetmanage: false
    };
    return btnData;
}]);
export default userSwitchModule.name;
