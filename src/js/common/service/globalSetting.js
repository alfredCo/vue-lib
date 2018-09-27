var globalSettingModule = angular.module("globalSettingModule", ["ngTable"]);

globalSettingModule.service("globalMenuModule", [function() {
    var GLOBALDATA = {
        ADMIN_MENU:[
            {
                keywords:"clusterManage",
                text:"集群管理",
                href:"",
                active:"cluster",
                icon:"icon-aw-cluster",
                child:[
                    {
                        keywords:"clusterView",
                        text:"集群概况",
                        href:"#/cluster/clusterview",
                        active:"clusterview",
                        icon:""
                    },
                    {
                        keywords:"clusterHostmanage",
                        text:"主机管理",
                        href:"#/cluster/hostmanage",
                        active:"hostmanage",
                        icon:""
                    },
                    {
                        keywords:"clusterMonitor",
                        text:"监控",
                        href:"#/cluster/monitor",
                        active:"monitor",
                        icon:""
                    },
                    // {
                    //     keywords:"clusterLog",
                    //     text:"日志",
                    //     href:"#/cluster/log",
                    //     active:"log",
                    //     icon:""
                    // }
                ]
            },
            // {
            //     keywords:"projectManage",
            //     text:"项目管理",
            //     href:"#/project/promanage",
            //     active:"promanage",
            //     icon:"",
            //     child:[]
            // },
            {
                keywords:"userManage",
                text:"用户管理",
                href:"#/user/usermanage",
                active:"usermanage",
                icon:"icon-aw-user-group",
                child:[]
            },
            {
                keywords:"proManage",
                text:"项目管理",
                href:"#/project/promanage",
                active:"promanage",
                icon:"icon-aw-xmgl",
                child:[]
            },
            {
                keywords:"configManage",
                text:"配置管理",
                href:"#/config/configmanage",
                active:"configmanage",
                icon:"icon-aw-xnzygl",
                child:[]
            },
            {
                keywords:"typeManage",
                text:"机型管理",
                href:"#/type/typemanage",
                active:"typemanage",
                icon:"icon-aw-hard-disk",
                child:[]
            },
            {
                keywords:"frameworkManage",
                text:"框架管理",
                href:"#/framework/frameworkmanage",
                active:"frameworkmanage",
                icon:"icon-aw-bmgl",
                child:[]
            },
            {
                keywords:"imageManage",
                text:"镜像管理",
                href:"#/image/imagemanage",
                active:"imagemanage",
                icon:"icon-aw-mirroring",
                child:[]
            },
            {
                keywords:"resourceManage",
                text:"资源管理",
                href:"",
                active:"resource",
                icon:"icon-aw-data-center1",
                child:[
                    {
                        keywords:"serviceApp",
                        text:"Service应用管理",
                        href:"#/resource/serviceapp",
                        active:"serviceapp",
                        icon:""
                    },
                    {
                        keywords:"jobApp",
                        text:"Job应用管理",
                        href:"#/resource/jobapp",
                        active:"jobapp",
                        icon:""
                    },
                    {
                        keywords:"daemsetApp",
                        text:"Daemset应用管理",
                        href:"#/resource/daemsetapp",
                        active:"daemsetapp",
                        icon:""
                    },
                    {
                        keywords:"deploymentApp",
                        text:"Deployment应用管理",
                        href:"#/resource/deploymentapp",
                        active:"deploymentapp",
                        icon:""
                    },
                    {
                        keywords:"replicaSetsApp",
                        text:"ReplicaSets应用管理",
                        href:"#/resource/replicasetsapp",
                        active:"replicasetsapp",
                        icon:""
                    },
                    {
                        keywords:"statefulSetApp",
                        text:"StatefulSet应用管理",
                        href:"#/resource/statefulsetapp",
                        active:"statefulsetapp",
                        icon:""
                    },
                    {
                        keywords:"PodApp",
                        text:"POD应用管理",
                        href:"#/resource/podapp",
                        active:"podapp",
                        icon:""
                    }
                ]
            },
            {
                keywords:"log",
                text:"日志",
                href:"#/logmanage/log",
                active:"log",
                icon:"icon-aw-plzc",
                child:[]
            },
            {
                keywords:"systemMessage",
                text:"系统信息",
                href:"#/system/systemmessage",
                active:"systemmessage",
                icon:"icon-aw-jsgl",
                child:[]
            },
            // {
            //     keywords:"resourceView",
            //     text:"资源概览",
            //     href:"#/resource/resourceview",
            //     active:"resourceview",
            //     icon:"icon-aw-gk0",
            //     child:[]
            // },
            // {
            //     keywords:"trainCluster",
            //     text:"训练集群",
            //     href:"#/train/traincluster",
            //     active:"traincluster",
            //     icon:"icon-aw-wdgd",
            //     child:[]
            // },
            // {
            //     keywords:"storageVolume",
            //     text:"存储卷",
            //     href:"#/storage/storagevolume",
            //     active:"storagevolume",
            //     icon:"icon-aw-storage1",
            //     child:[]
            // },
            // {
            //     keywords:"modelManage",
            //     text:"模型托管",
            //     href:"#/model/modelmanage",
            //     active:"modelmanage",
            //     icon:"icon-aw-rqfw",
            //     child:[]
            // },
            // {
            //     keywords:"sshKeyt",
            //     text:"用户信息",
            //     href:"#/ssh/sshKeyt",
            //     active:"sshKeyt",
            //     icon:"icon-aw-user",
            //     child:[]
            // }
        ],
        USER_MENU:[
            {
                keywords:"resourceView",
                text:"资源概览",
                href:"#/resource/resourceview",
                active:"resourceview",
                icon:"icon-aw-gk0",
                child:[]
            },
            {
                keywords:"trainManage",
                text:"训练管理",
                href:"",
                active:"train",
                icon:"icon-aw-wdgd",
                child:[
                    {
                        keywords:"trainCluster",
                        text:"训练任务",
                        href:"#/train/traincluster",
                        active:"traincluster",
                    },
                    {
                        keywords:"temptrain",
                        text:"训练任务",
                        href:"#/train/temptrain",
                        active:"temptrain",
                    }
                ]
            },
            {
                keywords:"storageVolume",
                text:"存储卷",
                href:"#/storage/storagevolume",
                active:"storagevolume",
                icon:"icon-aw-storage1",
                child:[]
            },
            {
                keywords:"datasetmanage",
                text:"数据集",
                href:"#/dataset/datasetmanage",
                active:"datasetmanage",
                icon:"icon-aw-yunfuwuqi",
                child:[]
            },
            {
                keywords:"modelManage",
                text:"模型管理",
                href:"",
                active:"model",
                icon:"icon-aw-rqfw",
                child:[
                    {
                        keywords:"modelTrustee",
                        text:"模型托管",
                        href:"#/model/modeltrustee",
                        active:"modeltrustee",
                        child:[]
                    },
                    {
                        keywords:"modelapplic",
                        text:"模型应用",
                        href:"#/model/modelapplic",
                        active:"modelapplic",
                        child:[]
                    }
                ]
            },
            {
                keywords:"sshKeyt",
                text:"SSH密钥",
                href:"#/ssh/sshKeyt",
                active:"sshKeyt",
                icon:"icon-aw-key",
                child:[]
            }
        ],
        ADMIN_MENU_LIST:[
            "/cluster/clusterview", "/cluster/hostmanage", "/cluster/monitor", "/project/promanage", "/user/usermanage", 
            "/config/configmanage", "/type/typemanage", "/framework/frameworkmanage","/logmanage/log",
            "/image/imagemanage", "/system/systemmessage", "/resource/resourceview", "/train/traincluster", "/storage/storagevolume","/loadsing/progressbar","/dataset/datasetmanage","/loading/progressbar",
            "/model/modeltrustee", "/ssh/sshKeyt", "/resource/serviceapp", "/resource/jobapp", "/resource/podapp", "/resource/daemsetapp",
            "/resource/deploymentapp", "/resource/replicasetsapp", "/resource/statefulsetapp","/train/temptrain","/model/modelapplic"
        ],
        USER_MENU_LIST:[
            "/resource/resourceview", "/train/traincluster", "/storage/storagevolume","/loadsing/progressbar","/dataset/datasetmanage","/loading/progressbar", "/model/modeltrustee", "/ssh/sshKeyt","/train/temptrain","/model/modelapplic"
        ]
    };
    return GLOBALDATA;
}]);
export default globalSettingModule.name;
