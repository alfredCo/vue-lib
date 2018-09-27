function statefulsetappview($scope, TableCom, $translate, statefulsetappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.statefulsetapp.dataTitles.name"),
        "namespace": $translate.instant("cn.statefulsetapp.dataTitles.namespace"),
        "replicas": $translate.instant("cn.statefulsetapp.dataTitles.replicas"),
        "observedGeneration": $translate.instant("cn.statefulsetapp.dataTitles.observedGeneration"),
        "creationTimestamp": $translate.instant("cn.statefulsetapp.dataTitles.creationTimestamp")
    }
    function statefulsetappInit() {
        self.globalSearchTerm = "";
        statefulsetappSrv.getStatefulsetAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.jobTableData = res.data.data;
                self.jobTableData.forEach((item, index) => {
                    item.id = index;
                    item.searchTerm = [item.name, item.namespace, item.replicas, item.observedGeneration, item.creationTimestamp].join("\b");
                });
                TableCom.init(self, "tableParams", self.jobTableData, "id", 10);
            }
        });
    }
    statefulsetappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        statefulsetappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            statefulsetappSrv.getStatefulsetAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.JobappDetailInfo = res.data.data;
                    console.log(self.JobappDetailInfo);
                }
            })
        }
        detailInfoInit();
    });
}

export {statefulsetappview};