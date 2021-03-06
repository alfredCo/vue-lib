var alertmodule = angular.module("alertsrv", []);

alertmodule.service("alertSrv", ["$timeout", "$sce", "$rootScope", "$uibModal", "$q", "$translate", function($timeout, $sce, $rootScope, $uibModal, $q,$translate) {
    var self = this;

    $rootScope.$on("alert-error", function(e, alert,requestId) {
        self.set(requestId, isNaN(Number(alert))?alert:$translate.instant("cn.statusCode."+ alert), "error",10000);
    }, $rootScope);
    $rootScope.$on("alert-warning", function(e, alert,requestId) {
        self.set(requestId, "warning", 5000);
    }, $rootScope);
    $rootScope.$on("alert-building", function(e, alert,requestId) {
        self.set(requestId, isNaN(Number(alert))?alert:$translate.instant("cn.statusCode."+ alert),"building");
    }, $rootScope);
    $rootScope.$on("alert-success", function(e, alert,requestId) {
        self.set(requestId, isNaN(Number(alert))?alert:$translate.instant("cn.statusCode."+ alert), "success", 3000);
    }, $rootScope);

    // List of all alert objects
    this.list = [];
    this.set = function(requestId, text, severity, timeout) {
        var newAlert = {
            requestId: requestId || "",
            text: text || "",
            severity: severity || "info"
        };
        // remove the end socket
        _.remove(self.list, function(value) {
            return  value.requestId === newAlert.requestId;
        });
        self.list.push(newAlert);
        if (timeout > 0) {
            $timeout(function() {
                self.list = _.without(self.list, newAlert);
            }, timeout);
        }
        return (newAlert);
    };

    this.clear = function(alert) {
        self.list = _.without(self.list, alert);
    };

    this.clearAll = function() {
        self.list = [];
    };

    this.showConfirmModal = function(e, payload) {
        var scope = $rootScope.$new();

        scope.title = payload.title;
        scope.text = payload.text;
        scope.onConfirm = payload.onConfirm;
        scope.icon = payload.icon || "fa-check";
        scope.yesText = payload.yesText || "Yes";
        scope.noText = payload.noText || "Cancel";
        scope.noDel = payload.noDel;

        var confirmModal = $uibModal.open({
            templateUrl: "/tmpl/confirm_modal.html",
            scope: scope,
            keyboard: false
        });
        scope.dismiss = function() {
            confirmModal.close();
        };
    };
}]);
export default alertmodule.name;