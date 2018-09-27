import "./logSrv";

let logManageModule = angular.module("logManageModule", ["logService"]);

logManageModule.controller("logManageModuleCtrl", ["$scope", "$translate", "logSrv", function($scope, $translate, logSrv) {
    var self = $scope;
    logSrv.getNodeName().then(res => {
        if(res&&res.data&&res.data.data){
            self.nodeList = res.data.data;
            self.nodeList.unshift({
                spec:{
                    externalID:"所有节点"
                },
                id:"LOG_ALL_DATA",
            })
            //self.node.selected = self.nodeList[0];
        }
        
    })
    logSrv.getProjectList().then(res => {
        if(res&&res.data&&res.data.data){
            self.projectList = res.data.data;
            self.projectList.unshift({
                id:"LOG_ALL_DATA",
                name:"所有项目"
            })
            //self.project.selected = self.projectList[0];
        }
    })
    logSrv.getTaskList().then(res => {
        self.taskList =[];
        if(res&&res.data&&res.data.data){
            //self.taskList = res.data.data;
            res.data.data.forEach((item,index)=>{
                self.taskList.push({name:_.values(item)[0],uuid:_.keys(item)[0]})
            })
            self.taskList.unshift({
                uuid:"LOG_ALL_DATA",
                name:"所有训练"
            })
            //self.task.selected = self.taskList[0];
        }
    })
    logSrv.getModelList().then(res => {
        self.modelList =[];
        if(res&&res.data&&res.data.data){
            //self.modelList = res.data.data;
            res.data.data.forEach((item,index)=>{
                self.modelList.push({name:_.values(item)[0],uuid:_.keys(item)[0]})
            })
            self.modelList.unshift({
                uuid:"LOG_ALL_DATA",
                name:"所有模型"
            })
            //self.model.selected = self.modelList[0];
        }
    })
    self.titleName="LogTable";
        if(sessionStorage["LogTable"]){
            self.titleData=JSON.parse(sessionStorage["LogTable"]);
        }else{
            self.titleData=[
                {name:'log.namespace',value:false,disable:false,search:""},
                {name:'log.containerName',value:false,disable:false,search:""},
                {name:'log.podName',value:false,disable:false,search:""},
                {name:'log.taskname',value:false,disable:false,search:""},
                {name:'log.modelname',value:false,disable:false,search:""},
                {name:'log.jobName',value:false,disable:false,search:""},
                {name:'log.hostName',value:false,disable:false,search:""},
                {name:'log.detail',value:true,disable:true,search:""},
                {name:'log.time',value:true,disable:true,search:""}
            ];
    };
    function initFilterForm() {
        self.project = {
            selected:""
        }
        self.node = {
            selected:""
        }
        self.task = {
            selected:""
        }
        self.model = {
            selected:""
        }
        self.sessionStorage = {
            "starttime":"",
            "endtime":""
        }
        return self.filterData = {
            "namespace":"",
            "host":"",
            "uuid":"",
            "log":"",
            "starttime":"",
            "endtime":"",
            "from":1,
            "size":10
        };

    }
    initFilterForm();

    function formatPerams(filterData) {
        var permas = angular.copy(filterData);
        permas.namespace = self.project.selected.name||"";
        permas.host = self.node.selected?self.node.selected.spec.externalID:"";
        //permas.uuid = self.task.selected.uuid||"";
        permas.from = filterData.from - 1;
        
        if(self.node.selected.id=="LOG_ALL_DATA"){
            permas.host = "";
        }
        if(self.project.selected.id=="LOG_ALL_DATA"){
            permas.namespace = "";
        }
        if(self.task.selected.uuid=="LOG_ALL_DATA"){
            permas.uuid = "";
        }
        if(self.model.selected.uuid=="LOG_ALL_DATA"){
            permas.uuid = "";
        }
        if(self.sessionStorage.starttime!=permas.starttime||self.sessionStorage.endtime!=permas.endtime){
            permas.starttime = self.sessionStorage.starttime;
            permas.endtime = self.sessionStorage.endtime;
            self.filterData.starttime = self.sessionStorage.starttime;
            self.filterData.endtime = self.sessionStorage.endtime;
        }
        return permas;
    }
    self.formatPerams = formatPerams;

    function init_dateTimepicker() {
        $(".form_date").datetimepicker({
            language: "zh-CN",
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            //startView: 2,
            minView: "month",
            //minuteStep:5,
            forceParse: 0,
            format: "yyyy-mm-dd",
            pickerPosition: "bottom-left"
        });
    }
    init_dateTimepicker();

    function init_data(result) {
        self.logsTable = _.map(result.data.data, function(item) {
            item.createTime = new Date(item.timestamp);
            return item;
        });
        var e = $("#pageNum")[0];
        if (result.data.total && self.filterData.size) {
            self.pages = Math.ceil(result.data.total / self.filterData.size);
            self.showPage = self.pages>1?true:false;
        }
    }

    function setPage(container, count, pageindex) { //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
        var a = [];

        if (pageindex == 1) {
            a[a.length] = "<li><a href=\"#\" class=\"prev unclick\"><i class=\"icon-aw-angle-double-left\"></i></a></li>";
        } else {
            a[a.length] = "<li><a href=\"#\" class=\"prev\"><i class=\"icon-aw-angle-double-left\"></i></a></li>";
        }

        function setPageList() {
            if (pageindex == i) {
                a[a.length] = "<li><a href=\"#\" class=\"on\">" + i + "</a></li>";
            } else {
                a[a.length] = "<li><a href=\"#\">" + i + "</a></li>";
            }
        }

        if (count <= 10) { //总页数小于10
            for (var i = 1; i <= count; i++) {
                setPageList();
            }
        } else { //总页数大于10页
            if (pageindex <= 4) {
                for (var i = 1; i <= 5; i++) {
                    setPageList();
                }
                a[a.length] = "<li><span>...</span></li><li><a href=\"#\">" + count + "</a></li>";
            } else if (pageindex >= count - 3) {
                a[a.length] = "<li><a href=\"#\">1</a></li><li><span>...</span></li>";
                for (var i = count - 4; i <= count; i++) {
                    setPageList();
                }
            } else { //当前页在中间部分
                a[a.length] = "<li><a href=\"#\">1</a></li><li><span>...</span></li>";
                for (var i = pageindex - 2; i <= pageindex + 2; i++) {
                    setPageList();
                }
                a[a.length] = "<li><span>...</span></li><li><a href=\"#\">" + count + "</a></li>";
            }
        }
        if (pageindex == count) {
            a[a.length] = "<li><a href=\"#\" class=\"next unclick\"><i class=\"icon-aw-angle-double-right\"></i></a></li>";
        } else {
            a[a.length] = "<li><a href=\"#\" class=\"next\"><i class=\"icon-aw-angle-double-right\"></i></a></li>";
        }
        container.innerHTML = a.join("");

        (function pageClick() { //事件点击
            var oAlink = container.getElementsByTagName("a");
            var inx = pageindex; //初始的页码
            var clickPageFunc = function(inx) {
                self.filterData.from = inx;
                setPage(container, count, inx);
                self.clickPageToquery = function() {
                    initLogsTable(formatPerams(self.filterData));
                }();
            };
            oAlink[0].onclick = function() { //点击上一页
                if (inx == 1) {
                    return false;
                }
                inx--;
                clickPageFunc(inx);
                return false;
            };
            for (var i = 1; i < oAlink.length - 1; i++) { //点击页码
                oAlink[i].onclick = function() {
                    inx = parseInt(this.innerHTML);
                    clickPageFunc(inx);
                    return false;
                };
            }
            oAlink[oAlink.length - 1].onclick = function() { //点击下一页
                if (inx == count) {
                    return false;
                }
                inx++;
                clickPageFunc(inx);
                return false;
            };
        })();
    }

    function initLogsTable(params) {
        self.showPage = false;
        self.loadData = false;
        self.logsTable = [];
        var getlogsData = function() {
            logSrv.getLogList(params).then(function(result) {
                result ? self.loadData = true : false;
                if (result && result.data) {
                    init_data(result);
                }
            });
        };
        getlogsData();

    }
    self.initLogsTable = initLogsTable;
    initLogsTable(formatPerams(self.filterData));

    self.searchLog = function(type) {
        if (type == "refresh") {
            initFilterForm();
        }
        if (type == "form") {
            if (!self.logFilter_form.$valid) {
                return;
            }
            self.filterData.from = "1";
            self.sessionStorage.starttime = self.filterData.starttime;
            self.sessionStorage.endtime = self.filterData.endtime;
        }
        initLogsTable(formatPerams(self.filterData));
    };
    self.goToPage = function(num) {
        self.filterData.from = num;
        initLogsTable(formatPerams(self.filterData));
    };
    self.changeSearch = function(){
        self.filterData.from = "1";
        initLogsTable(formatPerams(self.filterData));
    }
    self.taskChange = function(type,cur){
        self.filterData.from = "1";
        self.filterData.uuid = cur.uuid;
        self[type].selected = "";
        initLogsTable(formatPerams(self.filterData));
    }

}])
.directive("pageLog", [function(){
    return {
        restrict: "ECMA",
        scope:{
            pages:"=",
            logfun:"&",
            formatperams:"&",
            filterData:"="
        },
        template:`
            <ul class="pagination clearfix" id="pageNum">
                <li><a ng-click="prev()" class="prev" ng-class="{'unclick':true}"><i class="icon-aw-angle-double-left"></i></a></li>
                <li ng-repeat="item in totalNum"><a ng-click="goTo(item)" ng-class="{'on':cur==item}">{{item}}</a></li>
                <li><a ng-click="next()" class="next" ng-class="{'unclick':true}"><i class="icon-aw-angle-double-right"></i></a></li>
            </ul>
        `,
        link: function(scope, element, attrs){
            var self = scope;
                function initPage(){
                    self.cur = self.filterData.from;
                    if(self.pages>10){
                        self.totalNum = [];
                        self.cur = self.cur*1;
                        if(self.cur>5){
                            if(self.pages-self.cur>5){
                                self.totalNum = [];
                                for(let i=self.cur-4;i<self.cur+6;i++){
                                    self.totalNum.push(i);
                                }
                            }else{
                                self.totalNum = [];
                                for(let i=self.pages-9;i<self.pages+1;i++){
                                    self.totalNum.push(i);
                                }
                            }
                        }else{
                            self.totalNum = [];
                            for(let i=1;i<11;i++){
                                self.totalNum.push(i);
                            }
                        }
                    }else{
                        self.totalNum = [];
                        for(let i=1;i<self.pages+1;i++){
                            self.totalNum.push(i)
                        }
                    }
                }
                initPage();
                self.goTo = function(num){
                    self.filterData.from = num;
                    self.cur = num*1;
                    self.logfun({fun:self.formatperams({option:self.filterData})});
                }
                self.prev = function(){
                    if(self.cur==1){
                        return;
                    }
                    self.cur = self.cur*1
                    self.cur-=1;
                    self.goTo(self.cur);
                }
                self.next = function(){
                    if(self.cur>=self.pages){
                        return;
                    }
                    self.cur = self.cur*1
                    self.cur+=1;
                    self.goTo(self.cur);
                }
        }
    };
}]);


export default logManageModule.name;
