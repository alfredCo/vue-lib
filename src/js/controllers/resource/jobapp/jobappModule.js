function jobappview($scope, TableCom, $translate, jobappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.jobapp.dataTitles.name"),
        "namespace": $translate.instant("cn.jobapp.dataTitles.namespace"),
        "active": $translate.instant("cn.jobapp.dataTitles.active"),
        "selector": $translate.instant("cn.jobapp.dataTitles.selector"),
        "creationTimestamp": $translate.instant("cn.jobapp.dataTitles.creationTimestamp")
    }
    function jobappInit() {
        self.globalSearchTerm = "";
        jobappSrv.getJobAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.jobTableData = res.data.data;
                self.jobTableData.forEach((item, index) => {
                    item.id = index;
                    item.searchTerm = [item.name, item.namespace, item.active, item.creationTimestamp].join("\b");
                });
                TableCom.init(self, "tableParams", self.jobTableData, "id", 10);
            }
        });
    }
    jobappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        jobappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            jobappSrv.getJobAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.JobappDetailInfo = res.data.data;
                    console.log(self.JobappDetailInfo);
                }
            })
        }
        detailInfoInit();
    });
}

export {jobappview};