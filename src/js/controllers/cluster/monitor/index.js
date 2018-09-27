import "./monitorSrv";
let monitorViewModule = angular.module("monitorViewModule", ["monitorService"]);
monitorViewModule.controller("monitorCtrl",["$scope", "$translate","$routeParams","$timeout","monitorSrv",function($scope, $translate,$routeParams,$timeout,monitorSrv ){
    var self = $scope ;
    self.activeFlag = "1h";
    self.hostActiveFlag = "1h";
    self.proActiveFlag = "1h";
    self.volActiveFlag = "1h";
    self.showMonitorPage = true;
    self.hostintervalTime = 300;
    self.intervalTime = 300;
    self.proIntervalTime = 300;
    self.volIntervalTime = 300;
    self.timeType = "time"
    self.showNoCpuDataTitle = false;
    self.changeMonitorType = function(num){
        self.showMonitorPage = num
    }
  
    self.params={
        last:"1h",     // 最近时间范围
        interval:"300"    // 间隔时间
    }
    // 集群监控数据(cpu和内存)
    function getMonitorData(monitorType,timeType){
        switch (monitorType) {
            case "cpu":
                monitorSrv.getMonitorCpu(self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorCpuData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorCpuData,"clusterCpuData",timeType)
                        getClusterData("clusterCpuData");
                    }
                });
                break;
            case "memory":
                monitorSrv.getMonitorMemory(self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorMemoryData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorMemoryData,"clusterMemoryData",timeType)
                        getClusterData("clusterMemoryData")
                    }
                });
            break;
            case "gpu":
                monitorSrv.getMonitorGpu(self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let gpuMemoryData = {
                            total:res.data.data.memory?res.data.data.memory:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        let gpuNumData = {
                            total:res.data.data.count?res.data.data.count:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],
                            used:res.data.data.load?res.data.data.load:[]
                        }
                        initData(gpuNumData,"clusterGpuNumData",timeType);
                        getClusterData("clusterGpuNumData");
                        initData(gpuMemoryData,"clusterGpuMemoryData",timeType);
                        getClusterData("clusterGpuMemoryData");
                    }
                });
            break;
        }
    }

    // 主机监控数据（cpu和内存）
    function getNodeMonitorData(monitorType,timeType){
        switch (monitorType) {
            case "cpu":
                monitorSrv.getNodeMonitorCpu(self.nodeName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorCpuData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorCpuData,"clusterNodeCpuData",timeType);
                        getNodeClusterData("clusterNodeCpuData");
                    }
                });
                break;
            case "memory":
                 monitorSrv.getNodeMonitorMemory(self.nodeName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorMemoryData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorMemoryData,"clusterNodeMemoryData",timeType);
                        getNodeClusterData("clusterNodeMemoryData");
                    }
                 });
            break;
            case "gpu":
                monitorSrv.getNodeMonitorGpu(self.nodeName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        if(res&&res.data&&res.data.data){
                            let gpuNodeMemoryData = {
                                total:res.data.data.memory?res.data.data.memory:[],
                                stamp:res.data.data.stamp?res.data.data.stamp:[],
                                used:res.data.data.used?res.data.data.used:[],
                                alloc:res.data.data.alloc?res.data.data.alloc:[],                                
                            }
                            let gpuNodeNumData = {
                                total:res.data.data.count?res.data.data.count:[],
                                stamp:res.data.data.stamp?res.data.data.stamp:[],
                                alloc:res.data.data.alloc?res.data.data.alloc:[],
                                used:res.data.data.load?res.data.data.load:[]                  
                            }
                            initData(gpuNodeMemoryData,"clusterGpuNodeMemoryData",timeType);
                            getNodeClusterData("clusterGpuNodeMemoryData");
                            initData(gpuNodeNumData,"clusterGpuNodeNumData",timeType);
                            getNodeClusterData("clusterGpuNodeNumData");
                        }
                    }
                });
            break;
        }
    }

    // 项目监控数据
    function getProMonitorData(monitorType,timeType){
        switch (monitorType) {
            case "cpu":
                monitorSrv.getProMonitorCpu(self.proName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorCpuData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorCpuData,"clusterProCpuData",timeType);
                        getProClusterData("clusterProCpuData");
                    }
                });
                break;
            case "memory":
                 monitorSrv.getProMonitorMemory(self.proName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorMemoryData = {
                            total:res.data.data.total?res.data.data.total:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorMemoryData,"clusterProMemoryData",timeType);
                        getProClusterData("clusterProMemoryData");
                    }
                 });
            break;
            case "gpu":
                monitorSrv.getProMonitorGpu(self.proName.name,self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let gpuProMemoryData = {
                            total:res.data.data.memory?res.data.data.memory:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        let gpuProNumData = {
                            total:res.data.data.count?res.data.data.count:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],
                            used:res.data.data.load?res.data.data.load:[]                      
                        }
                        initData(gpuProMemoryData,"clusterGpuProMemoryData",timeType);
                        getProClusterData("clusterGpuProMemoryData");
                        initData(gpuProNumData,"clusterGpuProNumData",timeType);
                        getProClusterData("clusterGpuProNumData");
                    }
                });
            break;
        }
    }
    
     // 获取节点名称
    function getNodeName(){
        monitorSrv.getNodeName().then(function(res){
            self.nodeLise = []
            self.nodeName = {
                name:""
            }
            if(res&&res.data&&res.data.data){
                res.data.data.forEach(function(item){
                    self.nodeLise.push({"name":item.metadata.name})
                    self.nodeName.name = self.nodeLise[0].name
                })
            }
            self.hostInfo = [{},{},{},{}];
            getNodeMonitorData("cpu","time");
            getNodeMonitorData("memory","time");
            getNodeMonitorData("gpu","time");
        })
    }
    getNodeName()
    // 获取项目列表
    function getProjectList(){
        monitorSrv.getProjectList().then(function(res){
            self.projectLise = []
            self.proName = {
                name:""
            }
            if(res&&res.data&&res.data.data){               
                res.data.data.forEach(function(item){
                    self.projectLise.push({"name":item.name})
                })
                self.proName.name = self.projectLise[0].name     
            }
            self.proInfo = [{},{},{},{}];
            getProMonitorData("cpu","time")
            getProMonitorData("memory","time")
            getProMonitorData("gpu","time")
        })
    }
    getProjectList()
    function resetChartData(self,arg){
        for(let i=0;i<arg.length;i++){
            self[arg[i]] = {};
        }
    }
    self.choiceNode = function(item){
        resetChartData(self,['clusterNodeMemoryData','clusterNodeCpuData','clusterGpuNodeMemoryData','clusterGpuNodeNumData']);      
        self.params={
            last:self.hostActiveFlag,    
            interval:self.hostintervalTime
        }
        self.nodeName.name = item.name;
        self.hostInfo = [{},{},{},{}];
        getNodeMonitorData("cpu","time")
        getNodeMonitorData("memory","time")
        getNodeMonitorData("gpu","time")        
    }
    self.choicePro = function(item){
        resetChartData(self,['clusterProCpuData','clusterProMemoryData','clusterGpuProMemoryData','clusterGpuProNumData']);      
        self.params={
            last:self.proActiveFlag,    
            interval:self.proIntervalTime
        }
        self.proName.name = item.name
        self.proInfo = [{},{},{},{}];
        getProMonitorData("cpu","time");
        getProMonitorData("memory","time");
        getProMonitorData("gpu","time");
    }

    //获取存储卷监控数据
    function getVolMonitorData(monitorType,timeType) {
        switch (monitorType) {
            case "volume":
                monitorSrv.getMonitorVolume(self.params).then(function(res){
                    if(res&&res.data&&res.data.data){
                        let getMonitorVolData = {
                            total:res.data.data.capatity?res.data.data.capatity:[],
                            stamp:res.data.data.stamp?res.data.data.stamp:[],
                            used:res.data.data.used?res.data.data.used:[],
                            alloc:res.data.data.alloc?res.data.data.alloc:[],                        
                        }
                        initData(getMonitorVolData,"clusterVolData",timeType)
                        getVolClusterData()
                    }
                });
                break;
            default:
                break;
        }
    }
    function getVolClusterData() {
        return self.volInfo = [
            {
                title:"存储卷(GB)",
                showNoData:self.clusterVolData&&(self.clusterVolData.used.some(isDataUseable)||self.clusterVolData.alloc.some(isDataUseable)||self.clusterVolData.total.some(isDataUseable))?true:false,
                data:{
                    x_data:["分配存储卷大小", "实际使用存储卷大小", "总存储卷大小"],
                    series: [
                        {
                            name:'分配存储卷大小',
                            type:'line',
                            color:"rgba(81, 163, 255, 1)",
                            data:self.clusterVolData?self.clusterVolData.alloc:[],
                            time:self.clusterVolData?self.clusterVolData.time:[],
                            yAxisIndex:0
                        },
                        {
                            name:'实际使用存储卷大小',
                            type:'line',
                            color:"rgba(243, 156, 18, 1)",
                            data:self.clusterVolData?self.clusterVolData.used:[],
                            time:self.clusterVolData?self.clusterVolData.time:[],
                            yAxisIndex:0
                        },
                        {
                            name:'总存储卷大小',
                            type:'line',
                            color:"rgba(22, 160, 133, 1)",
                            data:self.clusterVolData?self.clusterVolData.total:[],
                            time:self.clusterVolData?self.clusterVolData.time:[],
                            yAxisIndex:0
                        }
                    ]
                }
            }
        ];
    }
    getVolMonitorData("volume","time");
    self.changeVolInfo = function(data,time){
        switch(data){
            case "1h":
                self.timeType = "time"
            break;
            case "12h":
                self.timeType = "time"
            break;
            case "1d":
                self.timeType = "day"
            break;
            case "7d":
                self.timeType = "day"
            break;
        }
        self.params = {
            last:data,
            interval:time
        }
        resetChartData(self,['clusterVolData']);       
        getVolMonitorData("volume",self.timeType);
        self.volIntervalTime = time;
        self.volActiveFlag = data;
    }
    function isDataUseable(item) {
        if (item != null) {
            return true;
        } else {
            return false;
        }
    }
    // 数据处理
    function initData(data,type,timeType){
        self[type] = {
            used : [],
            total : [],
            time : [],
            alloc : []
        }
        data.total.forEach(ele => {
            self[type].total.push(ele)
        });
        data.alloc.forEach(ele => {
            self[type].alloc.push(ele)
        });
        data.used.forEach(ele => {
            self[type].used.push(ele)
        });
        if(timeType == "day"){
            data.stamp.forEach(ele => {
                self[type].time.push(moment(ele*1000).format("YYYY-MM-DD HH:mm:ss"))
            });
        }else if(timeType == "time"){
            data.stamp.forEach(ele => {
                self[type].time.push(moment(ele*1000).format("HH:mm:ss"))
            });
        }
    }

    function getClusterData(type){
        switch (type) {
            case "clusterCpuData":
                self.resInfo[0] = {
                    title:$translate.instant("cn.monitor.cpu_kernel_num_status"),
                    showNoData:self.clusterCpuData&&(self.clusterCpuData.used.some(isDataUseable)||self.clusterCpuData.alloc.some(isDataUseable)||self.clusterCpuData.total.some(isDataUseable))?true:false,
                    data:{
                        
                        x_data:[$translate.instant("cn.monitor.allow_cpu_kernel_num"),$translate.instant("cn.monitor.used_cpu_kernel_num"),$translate.instant("cn.monitor.total_cpu_kernel_num")],
                        series: [
                            {
                                name:$translate.instant("cn.monitor.allow_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterCpuData?self.clusterCpuData.alloc:[],
                                time:self.clusterCpuData?self.clusterCpuData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.used_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterCpuData?self.clusterCpuData.used:[],
                                time:self.clusterCpuData?self.clusterCpuData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterCpuData?self.clusterCpuData.total:[],
                                time:self.clusterCpuData?self.clusterCpuData.time:[],
                                yAxisIndex:0,
                            },
                        ]
                    }
                }
                break;
            case "clusterMemoryData":
                self.resInfo[1] = {
                    title:$translate.instant("cn.monitor.used_memory_status"),
                    showNoData:self.clusterMemoryData&&(self.clusterMemoryData.used.some(isDataUseable)||self.clusterMemoryData.alloc.some(isDataUseable)||self.clusterMemoryData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.allow_memory"),$translate.instant("cn.monitor.used_memory"),$translate.instant("cn.monitor.total_memory")],
                        series: [
                            {   
                                name:$translate.instant("cn.monitor.allow_memory"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterMemoryData?self.clusterMemoryData.alloc:[],
                                time:self.clusterMemoryData?self.clusterMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.used_memory"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterMemoryData?self.clusterMemoryData.used:[],
                                time:self.clusterMemoryData?self.clusterMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_memory"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterMemoryData?self.clusterMemoryData.total:[],
                                time:self.clusterMemoryData?self.clusterMemoryData.time:[],
                                yAxisIndex:0,
                            },
                        ]
                    }
                }    
                break;
            case "clusterGpuNumData":
                self.resInfo[2] = {
                    title:$translate.instant("cn.monitor.used_gpu_status"),
                    showNoData:self.clusterGpuNumData&&(self.clusterGpuNumData.used.some(isDataUseable)||self.clusterGpuNumData.alloc.some(isDataUseable)||self.clusterGpuNumData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.allow_gpu"),$translate.instant("cn.monitor.link_gpu"),$translate.instant("cn.monitor.total_gpu_num")],
                        series: [
                            {   
                                name:$translate.instant("cn.monitor.allow_gpu"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterGpuNumData?self.clusterGpuNumData.alloc:[],
                                time:self.clusterGpuNumData?self.clusterGpuNumData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.link_gpu"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterGpuNumData?self.clusterGpuNumData.used:[],
                                time:self.clusterGpuNumData?self.clusterGpuNumData.time:[],
                                yAxisIndex:1,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_gpu_num"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterGpuNumData?self.clusterGpuNumData.total:[],
                                time:self.clusterGpuNumData?self.clusterGpuNumData.time:[],
                                yAxisIndex:0,
                            },
                        ]
                    }
                }
                break;
            case "clusterGpuMemoryData":
                self.resInfo[3] = {
                    title:$translate.instant("cn.monitor.gpu_memory"),
                    showNoData:self.clusterGpuMemoryData&&(self.clusterGpuMemoryData.used.some(isDataUseable)||self.clusterGpuMemoryData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.used_gpu_memory"),$translate.instant("cn.monitor.total_gpu_memory")],
                        series: [
                            {   
                                name:$translate.instant("cn.monitor.used_gpu_memory"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterGpuMemoryData?self.clusterGpuMemoryData.used:[],
                                time:self.clusterGpuMemoryData?self.clusterGpuMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_gpu_memory"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterGpuMemoryData?self.clusterGpuMemoryData.total:[],
                                time:self.clusterGpuMemoryData?self.clusterGpuMemoryData.time:[],
                                yAxisIndex:0,
                            }
                        ]
                    }
                }
                break;
            default:
                break;
        }
    }
    function getNodeClusterData(type){
        switch (type) {
            case "clusterNodeCpuData":
                self.hostInfo[0] = {
                    title:$translate.instant("cn.monitor.cpu_kernel_num_status"),
                    showNoData:self.clusterNodeCpuData&&(self.clusterNodeCpuData.used.some(isDataUseable)||self.clusterNodeCpuData.alloc.some(isDataUseable)||self.clusterNodeCpuData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.allow_cpu_kernel_num"),$translate.instant("cn.monitor.used_cpu_kernel_num"),$translate.instant("cn.monitor.total_cpu_kernel_num")],
                        series: [
                            {
                                name:$translate.instant("cn.monitor.allow_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterNodeCpuData?self.clusterNodeCpuData.alloc:[],
                                time:self.clusterNodeCpuData?self.clusterNodeCpuData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.used_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterNodeCpuData?self.clusterNodeCpuData.used:[],
                                time:self.clusterNodeCpuData?self.clusterNodeCpuData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_cpu_kernel_num"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterNodeCpuData?self.clusterNodeCpuData.total:[],
                                time:self.clusterNodeCpuData?self.clusterNodeCpuData.time:[],
                                yAxisIndex:0,
                            },
                        ]
                    }
                }
                break;
            case "clusterNodeMemoryData":
                self.hostInfo[1] = {
                    title:$translate.instant("cn.monitor.used_memory_status"),
                    showNoData:self.clusterNodeMemoryData&&(self.clusterNodeMemoryData.used.some(isDataUseable)||self.clusterNodeMemoryData.alloc.some(isDataUseable)||self.clusterNodeMemoryData.total.some(isDataUseable))?true:false,                
                    data:{
                        x_data:[$translate.instant("cn.monitor.allow_memory"),$translate.instant("cn.monitor.used_memory"),$translate.instant("cn.monitor.total_memory")],
                        series: [
                            {
                                name:$translate.instant("cn.monitor.allow_memory"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterNodeMemoryData?self.clusterNodeMemoryData.alloc:[],
                                time:self.clusterNodeMemoryData?self.clusterNodeMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.used_memory"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterNodeMemoryData?self.clusterNodeMemoryData.used:[],
                                time:self.clusterNodeMemoryData?self.clusterNodeMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_memory"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterNodeMemoryData?self.clusterNodeMemoryData.total:[],
                                time:self.clusterNodeMemoryData?self.clusterNodeMemoryData.time:[],
                                yAxisIndex:0,
                            }, 
                        ]
                    }
                }
                break;
            case "clusterGpuNodeNumData":
                self.hostInfo[2] = {
                    title:$translate.instant("cn.monitor.used_gpu_status"),
                    showNoData:self.clusterGpuNodeNumData&&(self.clusterGpuNodeNumData.used.some(isDataUseable)||self.clusterGpuNodeNumData.alloc.some(isDataUseable)||self.clusterGpuNodeNumData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.allow_gpu"),$translate.instant("cn.monitor.link_gpu"),$translate.instant("cn.monitor.total_gpu_num")],
                        series: [
                            {   
                                name:$translate.instant("cn.monitor.allow_gpu"),
                                type:'line',
                                color:"rgba(81, 163, 255, 1)",
                                data:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.alloc:[],
                                time:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.link_gpu"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.used:[],
                                time:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.time:[],
                                yAxisIndex:1,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_gpu_num"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.total:[],
                                time:self.clusterGpuNodeNumData?self.clusterGpuNodeNumData.time:[],
                                yAxisIndex:0,
                            },
                        ]
                    }
                }
                break;
            case "clusterGpuNodeMemoryData":
                self.hostInfo[3] = {
                    title:$translate.instant("cn.monitor.gpu_memory"),
                    showNoData:self.clusterGpuNodeMemoryData&&(self.clusterGpuNodeMemoryData.used.some(isDataUseable)||self.clusterGpuNodeMemoryData.total.some(isDataUseable))?true:false,
                    data:{
                        x_data:[$translate.instant("cn.monitor.used_gpu_memory"),$translate.instant("cn.monitor.total_gpu_memory")],
                        series: [
                            {   
                                name:$translate.instant("cn.monitor.used_gpu_memory"),
                                type:'line',
                                color:"rgba(243, 156, 18, 1)",
                                data:self.clusterGpuNodeMemoryData?self.clusterGpuNodeMemoryData.used:[],
                                time:self.clusterGpuNodeMemoryData?self.clusterGpuNodeMemoryData.time:[],
                                yAxisIndex:0,
                            },
                            {
                                name:$translate.instant("cn.monitor.total_gpu_memory"),
                                type:'line',
                                color:"rgba(22, 160, 133, 1)",
                                data:self.clusterGpuNodeMemoryData?self.clusterGpuNodeMemoryData.total:[],
                                time:self.clusterGpuNodeMemoryData?self.clusterGpuNodeMemoryData.time:[],
                                yAxisIndex:0,
                            }
                        ]
                    }
                }
                break;
            default:
                break;
        }
    }
    function getProClusterData(type){
        switch (type) {
            case "clusterProCpuData":
            self.proInfo[0] = {
                title:$translate.instant("cn.monitor.cpu_kernel_num_status"),
                showNoData:self.clusterProCpuData&&(self.clusterProCpuData.used.some(isDataUseable)||self.clusterProCpuData.alloc.some(isDataUseable)||self.clusterProCpuData.total.some(isDataUseable))?true:false,
                data:{
                    x_data:[$translate.instant("cn.monitor.allow_cpu_kernel_num"),$translate.instant("cn.monitor.used_cpu_kernel_num")],
                    series: [
                        {
                            name:$translate.instant("cn.monitor.allow_cpu_kernel_num"),
                            type:'line',
                            color:"rgba(81, 163, 255, 1)",
                            data:self.clusterProCpuData?self.clusterProCpuData.alloc:[],
                            time:self.clusterProCpuData?self.clusterProCpuData.time:[],
                            yAxisIndex:0,
                        },
                        {
                            name:$translate.instant("cn.monitor.used_cpu_kernel_num"),
                            type:'line',
                            color:"rgba(243, 156, 18, 1)",
                            data:self.clusterProCpuData?self.clusterProCpuData.used:[],
                            time:self.clusterProCpuData?self.clusterProCpuData.time:[],
                            yAxisIndex:0,
                        }
                    ]
                }
            }
                break;
                case "clusterProMemoryData":
            self.proInfo[1] = {
                title:$translate.instant("cn.monitor.used_memory_status"),
                showNoData:self.clusterProMemoryData&&(self.clusterProMemoryData.used.some(isDataUseable)||self.clusterProMemoryData.alloc.some(isDataUseable)||self.clusterProMemoryData.total.some(isDataUseable))?true:false,                
                data:{
                    x_data:[$translate.instant("cn.monitor.allow_memory"),$translate.instant("cn.monitor.used_memory")],
                    series: [
                        {
                            name:$translate.instant("cn.monitor.allow_memory"),
                            type:'line',
                            color:"rgba(81, 163, 255, 1)",
                            data:self.clusterProMemoryData?self.clusterProMemoryData.alloc:[],
                            time:self.clusterProMemoryData?self.clusterProMemoryData.time:[],
                            yAxisIndex:0,
                        },
                        {
                            name:$translate.instant("cn.monitor.used_memory"),
                            type:'line',
                            color:"rgba(243, 156, 18, 1)",
                            data:self.clusterProMemoryData?self.clusterProMemoryData.used:[],
                            time:self.clusterProMemoryData?self.clusterProMemoryData.time:[],
                            yAxisIndex:0,
                        }
                    ]
                }
            }
                break;
                case "clusterGpuProNumData":
            self.proInfo[2] = {
                title:$translate.instant("cn.monitor.used_gpu_status"),
                showNoData:self.clusterGpuProNumData&&(self.clusterGpuProNumData.used.some(isDataUseable)||self.clusterGpuProNumData.alloc.some(isDataUseable)||self.clusterGpuProNumData.total.some(isDataUseable))?true:false,
                data:{
                    // $translate.instant("cn.monitor.allow_gpu"),
                    x_data:[$translate.instant("cn.monitor.link_gpu"),$translate.instant("cn.monitor.total_gpu_num")],
                    series: [
                        // {   
                        //     name:$translate.instant("cn.monitor.allow_gpu"),
                        //     type:'line',
                        //     color:"rgba(81, 163, 255, 1)",
                        //     data:self.clusterGpuProNumData?self.clusterGpuProNumData.alloc:[],
                        //     time:self.clusterGpuProNumData?self.clusterGpuProNumData.time:[],
                        //     yAxisIndex:0,
                        // },
                        {
                            name:$translate.instant("cn.monitor.link_gpu"),
                            type:'line',
                            color:"rgba(243, 156, 18, 1)",
                            data:self.clusterGpuProNumData?self.clusterGpuProNumData.used:[],
                            time:self.clusterGpuProNumData?self.clusterGpuProNumData.time:[],
                            yAxisIndex:1,
                        },
                        {
                            name:$translate.instant("cn.monitor.total_gpu_num"),
                            type:'line',
                            color:"rgba(22, 160, 133, 1)",
                            data:self.clusterGpuProNumData?self.clusterGpuProNumData.total:[],
                            time:self.clusterGpuProNumData?self.clusterGpuProNumData.time:[],
                            yAxisIndex:0,
                        },
                    ]
                }
            }
                break;
                case "clusterGpuProMemoryData":
            self.proInfo[3] = {
                title:$translate.instant("cn.monitor.gpu_memory"),
                showNoData:self.clusterGpuProMemoryData&&(self.clusterGpuProMemoryData.used.some(isDataUseable)||self.clusterGpuProMemoryData.total.some(isDataUseable))?true:false,
                data:{
                    x_data:[$translate.instant("cn.monitor.used_gpu_memory"),$translate.instant("cn.monitor.total_gpu_memory")],
                    series: [
                        {   
                            name:$translate.instant("cn.monitor.used_gpu_memory"),
                            type:'line',
                            color:"rgba(243, 156, 18, 1)",
                            data:self.clusterGpuProMemoryData?self.clusterGpuProMemoryData.used:[],
                            time:self.clusterGpuProMemoryData?self.clusterGpuProMemoryData.time:[],
                            yAxisIndex:0,
                        },
                        {
                            name:$translate.instant("cn.monitor.total_gpu_memory"),
                            type:'line',
                            color:"rgba(22, 160, 133, 1)",
                            data:self.clusterGpuProMemoryData?self.clusterGpuProMemoryData.total:[],
                            time:self.clusterGpuProMemoryData?self.clusterGpuProMemoryData.time:[],
                            yAxisIndex:0,
                        }
                    ]
                }
            }
                break;
            default:
                break;
        }
    }
  
    self.changeDataByTime = function(data,time){
        switch(data){
            case "1h":
                self.timeType = "time"
            break;
            case "12h":
                self.timeType = "time"
            break;
            case "1d":
                self.timeType = "day"
            break;
            case "7d":
                self.timeType = "day"
            break;
        }
        self.params = {
            last:data,
            interval:time
        }
        resetChartData(self,['clusterMemoryData','clusterCpuData','clusterGpuMemoryData','clusterGpuNumData']);
        self.resInfo = [{},{},{},{}];
        getMonitorData("cpu",self.timeType)
        getMonitorData("memory",self.timeType)
        getMonitorData("gpu",self.timeType)
    
        self.intervalTime = time
        self.activeFlag = data;
    }
    self.changeDataByTime('1h','300');
    self.changeHostInfo = function(data,time){
        switch(data){
            case "1h":
                self.timeType = "time"
            break;
            case "12h":
                self.timeType = "time"
            break;
            case "1d":
                self.timeType = "day"
            break;
            case "7d":
                self.timeType = "day"
            break;
        }
        self.params = {
            last:data,
            interval:time
        }
        resetChartData(self,['clusterNodeMemoryData','clusterNodeCpuData','clusterGpuNodeMemoryData','clusterGpuNodeNumData']); 
        self.hostInfo = [{},{},{},{}];      
        getNodeMonitorData("cpu",self.timeType);
        getNodeMonitorData("memory",self.timeType);
        getNodeMonitorData("gpu",self.timeType);     
        self.hostintervalTime = time;
        self.hostActiveFlag = data;
    }
    self.changeProInfo = function(data,time){
        switch(data){
            case "1h":
                self.timeType = "time"
            break;
            case "12h":
                self.timeType = "time"
            break;
            case "1d":
                self.timeType = "day"
            break;
            case "7d":
                self.timeType = "day"
            break;
        }
        self.params = {
            last:data,
            interval:time
        }
        resetChartData(self,['clusterProMemoryData','clusterProCpuData','clusterGpuProMemoryData','clusterGpuProNumData']);
        self.proInfo = [{},{},{},{}];
        getProMonitorData("cpu",self.timeType);
        getProMonitorData("memory",self.timeType);
        getProMonitorData("gpu",self.timeType);      
        self.proIntervalTime = time
        self.proActiveFlag = data;
    }
}]);
export default monitorViewModule.name;