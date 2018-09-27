function serviceappview($scope, TableCom, $translate, serviceappSrv, $location) {
    var self = $scope;
    self.dataTitles = {
        "serviceName": $translate.instant("cn.serviceapp.dataTitles.serviceName"),
        "namespace": $translate.instant("cn.serviceapp.dataTitles.namespace"),
        "type": $translate.instant("cn.serviceapp.dataTitles.type"),
        "clusterIP": $translate.instant("cn.serviceapp.dataTitles.clusterIP"),
        "creationTimestamp": $translate.instant("cn.serviceapp.dataTitles.creationTimestamp"),
        "ports": $translate.instant("cn.serviceapp.dataTitles.ports")
    }
    self.serviceappName = "serviceappName";
    if (sessionStorage["serviceappName"]) {
        self.serviceappManageTitleData = JSON.parse(sessionStorage["serviceappName"]);
    } else {
        self.serviceappManageTitleData = [
            {name: "serviceapp.dataTitles.serviceName", value: true, disable: true, search: "name"},
            {name: "serviceapp.dataTitles.namespace", value: true, disable: false, search: "namespace"},
            {name: "serviceapp.dataTitles.type", value: true, disable: false, search: "type"},
            {name: "serviceapp.dataTitles.clusterIP", value: true, disable: false, search: "clusterIP"},
            {name: "serviceapp.dataTitles.ports", value: true, disable: false, search: "ports"},
            {name: "serviceapp.dataTitles.creationTimestamp", value: true, disable: false, search: "creationTimestamp"},
        ];
    }
    self.serviceappManageSearchTerm = serviceappManageSearchTerm;
    function serviceappManageSearchTerm(obj){
        self.globalSearchTerm = "";
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function (item) {
            item.searchTerm = [];
            titleData.forEach(function (value) {
                if (value.value) {
                    item.searchTerm.push(item[value.search]);
                }
            });
            item.searchTerm = item.searchTerm.join("\b");
        });
        self.applyGlobalSearch();
    }
    function serviceappInit() {
        self.globalSearchTerm = "";
        serviceappSrv.getServiceAppList().then(res => {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.serviceTableData = res.data.data;
                self.serviceTableData.forEach((item, index) => {
                    item.ports = [];
                    item.portsList.forEach(ele => {
                        if (ele.nodePort) {
                            ele.ports = [[ele.port, ele.nodePort].join(":"), ele.protocol].join("/");
                        } else {
                            ele.ports = [ele.port, ele.protocol].join("/");
                        }
                        item.ports.push(ele.ports);
                        
                    });
                    item.id = index;
                    item.ports = item.ports.join(" ");
                    item.searchTerm = [item.name, item.namespace, item.type, item.clusterIP, item.creationTimestamp, item.ports].join("\b");
                });
                self.serviceappManageListData = angular.copy(self.serviceTableData);
                TableCom.init(self, "tableParams", self.serviceappManageListData, "id", 10);
                self.serviceappManageSearchTerm({tableData:self.serviceappManageListData,titleData:self.serviceappManageTitleData});
            }
        });
    }
    serviceappInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        serviceappInit();
    };
    self.$on("getDetail", function (event, value) {
        function detailInfoInit() {
            console.log(value);
            var options = {
                "namespace": $location.search().namespace,
                "name": $location.search().name
            }
            serviceappSrv.getServiceAppDetail(options).then(res => {
                if (res && res.data && res.data.data) {
                    self.serciveappDetailInfo = res.data.data;
                    self.serciveappDetailInfo.name = $location.search().name;
                    if (Object.keys(self.serciveappDetailInfo.selector).length == 0) {
                        self.serciveappDetailInfo.selectorInfo = {
                            "version": "",
                            "k8s-app": "",
                            "app": "",
                            "isExist": false
                        }
                    } else {
                        self.serciveappDetailInfo.selectorInfo = {
                            "version": self.serciveappDetailInfo.selector.version,
                            "k8s-app": self.serciveappDetailInfo.selector["k8s-app"],
                            "app": self.serciveappDetailInfo.selector.app,
                            "isExist": true
                        }
                    }
                }
            })
        }
        detailInfoInit();
    });
}

export {serviceappview};