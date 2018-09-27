import "./modelapplicSrv";
let modelapplicModule = angular.module("modelapplicModule", ["modelapplicService"]);

modelapplicModule.controller("modelapplicCtrl", ["$scope","modelapplicSrv", function ($scope, modelapplicSrv) {
    var self = $scope;
    self.tryCheck = function(type){
        window.open('/recognition/#/application?type='+type, "Recognize", "", false);
    }
    
}])
.controller("detailTempTrainCtrl", ["$scope","TEMPTRAINDATA","TYPE", function ($scope,TEMPTRAINDATA,TYPE) {
    var self = $scope;
}])


export default modelapplicModule.name;