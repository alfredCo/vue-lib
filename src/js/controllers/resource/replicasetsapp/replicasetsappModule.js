function replicasetsappview($scope, TableCom, $translate, replicasetsappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.replicasetsapp.dataTitles.name"),
        "namespace": $translate.instant("cn.replicasetsapp.dataTitles.namespace"),
        "observedGeneration": $translate.instant("cn.replicasetsapp.dataTitles.observedGeneration"),
        "replicas": $translate.instant("cn.replicasetsapp.dataTitles.replicas"),
        "creationTimestamp": $translate.instant("cn.replicasetsapp.dataTitles.creationTimestamp")
    }
    function replicasetsappInit() {
        self.globalSearchTerm = "";
        replicasetsappSrv.getReplicasetsAppList().then(res => {
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
    replicasetsappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        replicasetsappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            replicasetsappSrv.getReplicasetsAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.replicasetsappDetailInfo = res.data.data;
                    console.log(self.replicasetsappDetailInfo);
                }
            })
        }
        detailInfoInit();
    });
}

export {replicasetsappview};