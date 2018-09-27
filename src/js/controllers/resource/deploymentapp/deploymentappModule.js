function deploymentappview($scope, TableCom, $translate, deploymentappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.deploymentapp.dataTitles.name"),
        "namespace": $translate.instant("cn.deploymentapp.dataTitles.namespace"),
        "observedGeneration": $translate.instant("cn.deploymentapp.dataTitles.observedGeneration"),
        "replicas": $translate.instant("cn.deploymentapp.dataTitles.replicas"),
        "creationTimestamp": $translate.instant("cn.deploymentapp.dataTitles.creationTimestamp")
    }
    function deploymentappInit() {
        self.globalSearchTerm = "";
        deploymentappSrv.getDeploymentAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.jobTableData = res.data.data;
                self.jobTableData.forEach((item, index) => {
                    item.id = index;
                    item.searchTerm = [item.name, item.namespace, item.observedGeneration, item.replicas, item.creationTimestamp].join("\b");
                });
                TableCom.init(self, "tableParams", self.jobTableData, "id", 10);
            }
        });
    }
    deploymentappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        deploymentappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            deploymentappSrv.getDeploymentAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.deploymentAppDetailInfo = res.data.data;
                    console.log(self.deploymentAppDetailInfo);
                }
            })
        }
        detailInfoInit();
    });
}

export {deploymentappview};