var detailModule = angular.module("detailsrv", []);

detailModule.controller("detailCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {
    $scope.$watch(function () {
        return $routeParams.id;
    }, function (value) {
        value ? $scope.animation = "animateIn" : $scope.animation = "animateOut";
        if (value && $routeParams.type) {
            $scope.$emit("get" + $routeParams.type + "Detail", value);
        } else if (value) {
            $scope.$emit("getDetail", value);
        }
        if (value) {
            $("body").addClass("animate-open");
        } else {
            $("body").removeClass("animate-open");
        }
    });
}]);

export default detailModule.name;