import storageVolumeService from './storageVolumeSrv';

let loadingsViewModule = angular.module("loadingsViewModule", ["storageVolumeService"])
.controller("loadingsCtrl",["$scope" ,"$rootScope" ,"$translate","$uibModal","$location","TableCom","storageVolumeSrv",function(scope,rootScope,$translate,$uibModal,$location,TableCom,storageVolumeSrv){
    let self = scope
    self.getPage = true
    self.bundwidth = {
        "width":"0%"
    }
    
    function init(){
        self.count = 0
        var timer=setInterval(function(e){
            self.count++;
            self.bundwidth.width = self.count + "%";
            self.precent = self.count;
            self.$apply();
            if(self.count === 99) {
                clearInterval(timer);
            }
        },50);
    }

    function openPage(){
        let name = $location.search()
        storageVolumeSrv.getstorageLoadStatus(name.name).then(function(res){
            if(res&&res.data&&res.data.data){
                self.filemngurl = res.data.data
            }else{
                self.getPage = false
            }
        })
    }
    init();
    openPage();

    
    self.$watch(function(){
        return {count:self.count,filemngurl:self.filemngurl}
    },function(value){
        if(value.count==99&&value.filemngurl){
            self.bundwidth.width = "100%";
            self.precent = "100";
            window.location.href=value.filemngurl; 
        }
    },true)
}])

export default loadingsViewModule.name;