import "./trainclusterSrv";
let temptrainModule = angular.module("temptrainModule", ["trainmanageService"]);

temptrainModule.controller("temptrainCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "$sce", "trainmanageSrv", "$window", "$timeout", "userSwitchSrv", "$filter","logSrv", function ($scope, TableCom, $uibModal, $translate, $sce, trainmanageSrv, $window, $timeout, userSwitchSrv, $filter,logSrv) {
    var self = $scope;
    self.createTrain = function (type) {
        self.createTrainModel = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "createTempTrain.html",
            controller: "createTempTrainCtrl",
            resolve: {
                context: function () {
                    return self;
                },
                TYPE:function(){
                    return type;
                }
            }
        });
    };
    self.getDetail = function(type){
        $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "trainDetailTempTrain.html",
            controller: "trainDetailTempTrainCtrl",
            resolve: {
                TYPE:function(){
                    return type;
                }
            }
        });
    }
    
}]);
temptrainModule.controller("createTempTrainCtrl", ["$scope", "context", "trainmanageSrv","TEMPTRAINDATA","TYPE", function ($scope, context, trainmanageSrv,TEMPTRAINDATA,TYPE) {
    var self = $scope;
    self.trainModelType = TYPE;
    self.TaskengineData = [];
    self.versionListData = [];
    self.typeData = [];
    self.caffeTypeData = [];
    self.allTypeData = [];
    self.volumeData = [];
    self.addVolumes = [];
    self.sshKeyList = [];
    self.sshoption = {};
    self.firstStepQuota = false;
    self.trainForm = {
        "taskname":TEMPTRAINDATA.NAME[TYPE],
        "sessionimage":window.GLOBALCONFIG.APIHOST.PATH + TEMPTRAINDATA.PATH[TYPE],
        "session_cpu_num": 1,
        "session_memory_num": 1,
        "session_nvidiagpu_num": 1,
        "session_pooltype": 'shared',
        "resource_groups": [],
        "volume_groups": [],
        "tasktime": 1000,
        "session_train_trigger_method": "default",
        "session_train_trigger_command": "",
        "log_dir": "/root/tensorflow/log",
        "data_dir":"",
        "model_dir": "/root/tensorflow/model",
        "params": angular.copy(TEMPTRAINDATA[TYPE]),
        "session_train_engine":"tensorflow",
        "session_train_engine_version":"1.8.0",
        "configOPtion": {
            "method": "defaultConfig",
            "typeFlavor": ""
        }
    };
    self.inStep = 1;
    self.trainFormInfo = {
        cpuPattern: "[1-9]\\d*",
        cpuName: "sessionCpuName",
        cpuDesc: "只能输入正整数",
        memoryPattern: "[1-9]\\d*",
        memoryName: "sessionMemoryName",
        memoryDesc: "只能输入正整数",
        gpuName: "sessionGpuName",
        addNumber: 1,
        memoryAddNumber: 1,
        tasktimeName: "tasktimeName"
    };
    self.showSessionGpu = false;
    self.configOPtion = {
        "method": "defaultConfig",
        "typeFlavor": ""
    }
    function createTrainInit() {
        trainmanageSrv.getVolumesData().then(function (res) {
            if (res && res.data && res.data.data) {
                self.volumeModelData = res.data.data;
                self.volumeData[0] = [];
                _.forEach(self.volumeModelData, function (item) {
                    var obj = {};
                    obj.pvc = item.volumename;
                    self.volumeData[0].push(obj);
                });
                self.allVolumeData = angular.copy(self.volumeData[0]);
            }
        });
        trainmanageSrv.getNodeTypeData().then(function (res) {
            if (res && res.data && res.data.data) {
                _.forEach(res.data.data, function (item) {
                    var obj = {};
                    obj.name = item.name;
                    obj.type = item.type;
                    obj.option = item.name;
                    self.typeData.push(obj);
                    if (obj.type != "gpu") {
                        self.caffeTypeData.push(obj);
                    }
                });
                self.allTypeData = angular.copy(self.caffeTypeData)
                self.trainForm.session_cputype = self.allTypeData[0];
            }
        });

        trainmanageSrv.getUsersQuota(localStorage.userId).then((res) => {
            if (res && res.data && res.data.data) {
                self.quotaInfo = res.data.data;
            }
        });
        trainmanageSrv.getFlavorList().then(res => {
            if (res && res.data && res.data.data) {
                self.allFlavorList = res.data.data;
                self.cpuFlavorList = self.allFlavorList.filter(item => {
                    if (item.gpu == 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
                self.gpuFlavorList = self.allFlavorList.filter(item => {
                    if (item.gpu != 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
                self.showSessionGpu = false;
                self.flavorList = self.cpuFlavorList;
                self.trainForm.configOPtion.typeFlavor = self.flavorList[0];
            }
        });
    }
    self.paramsPattern = [];
    switch (TYPE) {
        case "CNN":
            self.paramsPattern = [
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                },
                {
                    "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                },
                {
                    "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false,
                    "id": "steps"
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": true,
                    "id": "eval_step",
                }
            ]
            break;
        case "LETTER":
        self.paramsPattern = [
            {
                "pattern": "[1-9]\\d*",
                "patternInfo": "只能输入正整数",
                "isRequired": false
            },
            {
                "pattern": "[1-9]\\d*",
                "patternInfo": "只能输入正整数",
                "isRequired": false
            },
            {
                "pattern": "[1-9]\\d*",
                "patternInfo": "只能输入正整数",
                "isRequired": false
            },
            {
                "pattern": "[1-9]\\d*",
                "patternInfo": "只能输入正整数",
                "isRequired": false
            },
            {
                "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                "isRequired": false
            },
            {
                "pattern": "(^0\.[0-9]{0,5}[1-9]$)|^1$",
                "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                "isRequired": false
            }
        ]
            break;
        case "IMAGE":
            self.paramsPattern = [
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "^0\.[0-9]*[1-9]$|^1$",
                    "patternInfo": "只能输入1和大于0的保留六位以内的小数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                },
                {
                    "pattern": "[1-9]\\d*",
                    "patternInfo": "只能输入正整数",
                    "isRequired": false
                }
            ]
            break;
        default:
            break;
    }
    if (TYPE == "CNN") {
        self.$watch(function () {
            return angular.element("#steps").val();
        },function (val) {
            if (val*1 == val && angular.element("#eval_step").val()*1 == angular.element("#eval_step").val()) {
                if (val >= angular.element("#eval_step").val()) {
                    self.overStep = false;
                } else {
                    self.overStep = true;
                }
            } else {
                self.overStep = false;
            }
        });
        self.$watch(function () {
            return angular.element("#eval_step").val();
        },function (val) {
            if (val*1 == val && angular.element("#steps").val()*1 == angular.element("#steps").val()) {
                if (val <= angular.element("#steps").val()) {
                    self.overStep = false;
                } else {
                    self.overStep = true;
                }
            } else {
                self.overStep = false;
            }
        });
    }
    createTrainInit();

    
    //下一步
    self.stepTo = function (formName) {
        self.resourceNameRepeat = false;
        self.createQuota = {
            "cpu_create_used" : 0,
            "disk_create_used" : 0,
            "gpu_create_used" : 0,
            "memory_create_used" : 0,
            "cpuOverQuota": false,
            "gpuOverQuota": false,
            "memoryOverQuota": false,
        }
        if (self.inStep == 1) {
            self.firstStepQuota = false;
            if (formName.$valid) {
                if (self.trainForm.configOPtion.method == "defaultConfig") {
                    self.trainForm.session_cpu_num = self.trainForm.configOPtion.typeFlavor.cpu;
                    self.trainForm.session_nvidiagpu_num = self.trainForm.configOPtion.typeFlavor.gpu;
                    self.trainForm.session_memory_num = self.trainForm.configOPtion.typeFlavor.memory;
                }
                
                self.createQuota.cpu_create_used += self.trainForm.session_cpu_num*1 + 2;
                self.createQuota.memory_create_used += self.trainForm.session_memory_num*1 + 2;
                

                if (self.quotaInfo.cpu_hard - self.quotaInfo.cpu_used < self.createQuota.cpu_create_used) {
                    self.createQuota.cpuOverQuota = true;
                } else {
                    self.createQuota.cpuOverQuota = false;
                }
                if (self.quotaInfo.gpu_hard - self.quotaInfo.gpu_used < self.createQuota.gpu_create_used) {
                    self.createQuota.gpuOverQuota = true;
                } else {
                    self.createQuota.gpuOverQuota = false;
                }
                if (self.quotaInfo.memory_hard - self.quotaInfo.memory_used < self.createQuota.memory_create_used) {
                    self.createQuota.memoryOverQuota = true;
                } else {
                    self.createQuota.memoryOverQuota = false;
                }
                if (self.createQuota.cpuOverQuota || self.createQuota.gpuOverQuota || self.createQuota.memoryOverQuota) {
                    self.firstStepQuota = true;
                } else {
                    self.firstStepQuota = false;
                }
                if (self.firstStepQuota) {
                    return false;
                }
            }
        }
        if (self.inStep == 2) {
            if (formName.$valid) {
                self.saveTrainForm = angular.copy(self.trainForm);
                self.inStep++;
            } else {
                self[formName.$name + "Valid"] = true;
            }
        } else {
            if (formName.$valid) {
                self.inStep++;
            } else {
                self[formName.$name + "Valid"] = true;
            }
        }
    };
    //上一步
    self.stepBack = function () {
        if (self.inStep == 2) {
            if (self.trainForm.configOPtion.method == "defaultConfig") {
                self.trainForm.session_cpu_num = 1;
                self.trainForm.session_nvidiagpu_num = 1;
                self.trainForm.session_memory_num = 1;
            }
        }
        if (self.inStep == 3) {
            self.trainForm = angular.copy(self.saveTrainForm);
        }
        self.inStep--;
    };
    
    
    //机型选择切换时切换机型的类型
    self.modelChange = function (item) {
        if (item.cputype.type == "gpu") {
            item.gputype = item.cputype.name;
        }
    };
    //添加附加存储卷
    self.addVolume = function (formName) {
        if (formName.$valid) {
            self.addVolumes.push({});
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
    //存储卷切换时更新下拉框的数组防止一个存储卷被多次选取
    self.volumeChange = function (index) {
        self.volumeData[index] = [];
        if (self.allVolumeData && self.allVolumeData.length) {
            for (var i = 0; i < self.allVolumeData.length; i++) {
                var obj = self.allVolumeData[i];
                var num = obj.pvc;
                var isExist = false;
                for (var j = 0; j < self.trainForm.volume_groups.length; j++) {
                    var aj = self.trainForm.volume_groups[j];
                    var n = aj.pvc;
                    if (n == num) {
                        if (j == index) {
                            isExist = false;
                            break;
                        } else {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    self.volumeData[index].push(obj);
                }
            }
        }
    };
    
    //移除附加存储卷
    self.removeVolume = function (index) {
        self.addVolumes.splice(index - 1, 1);
        self.trainForm.volume_groups.splice(index, 1);
    };
    //创建任务
    self.createConfirm = function (createParamForm,data) {
        if (TYPE == "CNN") {
            if (!self.overStep) {
                if(createParamForm.$valid){
                    delete data.configOPtion;
                    if (data.session_cputype.type == "cpu") {
                        data.session_cputype = data.session_cputype.name;
                        data.session_nvidiagpu_num = 0;
                    } 
                    data.volume_groups.forEach((element, index) => {
                        if (index == 0) {
                            element.required = true;
                        }
                    });
                    trainmanageSrv.createTaskData(angular.copy(data)).then(function () {
                    });
                    self.$dismiss();
                }
            }
        } else {
            if(createParamForm.$valid){
                delete data.configOPtion;
                if (data.session_cputype.type == "cpu") {
                    data.session_cputype = data.session_cputype.name;
                    data.session_nvidiagpu_num = 0;
                } 
                console.log(angular.copy(data));
                data.volume_groups.forEach((element, index) => {
                    if (index == 0) {
                        element.required = true;
                    }
                });
                trainmanageSrv.createTaskData(angular.copy(data)).then(function () {
                });
                self.$dismiss();
            }
        }
        
    };
}]);
temptrainModule.controller("trainDetailTempTrainCtrl", ["$scope","TEMPTRAINDATA","TYPE", function ($scope,TEMPTRAINDATA,TYPE) {
    var self = $scope;
    self.infoType = TYPE;
}])


export default temptrainModule.name;