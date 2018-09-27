function podappview($scope, TableCom, $translate, podappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.podapp.dataTitles.name"),
        "namespace": $translate.instant("cn.podapp.dataTitles.namespace"),
        "phase": $translate.instant("cn.podapp.dataTitles.phase"),
        "podIP": $translate.instant("cn.podapp.dataTitles.podIP"),
        "creationTimestamp": $translate.instant("cn.podapp.dataTitles.creationTimestamp")
    }
    function podappInit() {
        self.globalSearchTerm = "";
        podappSrv.getPodAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.jobTableData = res.data.data;
                self.jobTableData.forEach((item, index) => {
                    item.id = index;
                    item.searchTerm = [item.name, item.namespace, item.phase, item.podIP, item.creationTimestamp].join("\b");
                });
                TableCom.init(self, "tableParams", self.jobTableData, "id", 10);
            }
        });
    }
    podappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        podappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            podappSrv.getPodAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.JobappDetailInfo = res.data.data;
                    console.log(self.JobappDetailInfo);
                }
            })
        }
        detailInfoInit();
    });
}

export {podappview};