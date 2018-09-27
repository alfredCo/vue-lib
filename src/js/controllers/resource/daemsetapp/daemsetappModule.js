function daemsetappview($scope, TableCom, $translate, daemsetappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.daemsetapp.dataTitles.name"),
        "namespace": $translate.instant("cn.daemsetapp.dataTitles.namespace"),
        "numberAvailable": $translate.instant("cn.daemsetapp.dataTitles.numberAvailable"),
        "numberReady": $translate.instant("cn.daemsetapp.dataTitles.numberReady"),
        "creationTimestamp": $translate.instant("cn.daemsetapp.dataTitles.creationTimestamp")
    }
    function daemsetappInit() {
        self.globalSearchTerm = "";
        daemsetappSrv.getDaemsetAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.jobTableData = res.data.data;
                self.jobTableData.forEach((item, index) => {
                    item.id = index;
                    item.searchTerm = [item.name, item.namespace, item.currentNumberScheduled, item.desiredNumberScheduled, item.creationTimestamp].join("\b");
                });
                TableCom.init(self, "tableParams", self.jobTableData, "id", 10);
            }
        });
    }
    daemsetappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        daemsetappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            daemsetappSrv.getDaemsetAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.daemsetappDetailInfo = res.data.data;
                    console.log(self.daemsetappDetailInfo);
                    self.daemsetappDetailInfo.scheduledInfo = {
                        "updatedNumberScheduled" : self.jobTableData[value].updatedNumberScheduled,
                        "currentNumberScheduled" : self.jobTableData[value].currentNumberScheduled,
                        "desiredNumberScheduled" : self.jobTableData[value].numberReady
                    }
                }
            })
        }
        detailInfoInit();
    });
}

export {daemsetappview};