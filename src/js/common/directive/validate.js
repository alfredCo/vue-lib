var validateModule = angular.module("validateModule", []);


validateModule.directive("minmax",[function(){
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            min:"=",
            max:"="
        },
        link:function(scope,elem,attrs,ngModel){
            var reg = new RegExp("^(0|[1-9][0-9]*)$");
            ngModel.$parsers.push(valid);
            ngModel.$formatters.push(valid);
            function valid(viewValue){
                if(Number(angular.element("#"+attrs.minmax).val())){
                    var val = Number(viewValue);
                    if(val < Number(scope.min) || val > Number(scope.max) || !reg.test(viewValue)){
                        ngModel.$setValidity("minmax",false);
                    }else{
                        ngModel.$setValidity("minmax",true);
                    }
                }
                return viewValue
            }
            scope.$watch(function(){
                // return angular.element("#"+attrs.minmax).val();
                return angular.element("#"+attrs.minmax).val()+"_"+scope.max+"_"+scope.min;
            },function(startValue){
                if(scope.max || scope.max == "0"){
                    startValue = startValue.split("_")[0];
                    if(Number(startValue) || startValue=="0" ){
                        var val = Number(ngModel.$viewValue);
                        if(val < Number(scope.min) || val > Number(scope.max) || !reg.test(ngModel.$viewValue)){
                            ngModel.$setValidity("minmax",false);
                        }else{
                            ngModel.$setValidity("minmax",true);
                        }
                    }
                }
            });
            // scope.$watch(function() {
            //     return ngModel.$viewValue;
            // }, function(viewValue) {
            //     if (viewValue) {
            //         valid(viewValue);
            //     }
            // });
        }
    };
}]);
validateModule.directive("flaram",[function(){
    return {
        restrict:"A",
        require:"ngModel",
        link:function(scope,elem,attrs,ngModel){
            var reg = new RegExp("^\d+([.][0-9])?$");
            ngModel.$parsers.push(function(viewValue){
                if(reg.test(viewValue)){
                    ngModel.$setValidity("flaram",false);
                }else{
                    if(viewValue*1>0){
                        if(viewValue*1 == (viewValue*1).toFixed(1)){
                            if(viewValue.substr(-1,1)=="."){
                                ngModel.$setValidity("flaram",false);
                            }else{
                                ngModel.$setValidity("flaram",true);
                            }
                        }else{
                            ngModel.$setValidity("flaram",false);
                        }
                    }else{
                        ngModel.$setValidity("flaram",false);

                    }
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("gtZeroNum",[function(){ //校验大于等于0的数,小数保留两位
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            min:"=",
            max:"="
        },
        link:function(scope,elem,attrs,ngModel){
            var reg = /^[0-9]\d*(\.\d{1,2})?$/;
            ngModel.$parsers.push(function(viewValue){
                if(reg.test(viewValue)){
                    if(viewValue.indexOf(".")>-1 ){ //如果是小数
                        if(viewValue.substr(0,1) == "0"){
                            if(viewValue.substr(1,1) == "."){
                                ngModel.$setValidity("gtZeroNum",true);
                            }else{
                                ngModel.$setValidity("gtZeroNum",false);
                            };
                        }else{
                            if(Number(viewValue) <= Number(scope.max)){
                                ngModel.$setValidity("gtZeroNum",true);
                            }else{
                                ngModel.$setValidity("gtZeroNum",false);
                            };
                        }
                    }else{
                        if(viewValue.length>1 && viewValue.substr(0,1) == "0"){
                            ngModel.$setValidity("gtZeroNum",false);
                        }else{
                            if(Number(viewValue) <= Number(scope.max)){
                                ngModel.$setValidity("gtZeroNum",true);
                            }else{
                                ngModel.$setValidity("gtZeroNum",false);
                            }
                        }
                    }
                }else{
                    ngModel.$setValidity("gtZeroNum",false);
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("minmaxram",[function(){
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            min:"=",
            max:"="
        },
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                if(Number(angular.element("#"+attrs.minmaxram).val())){
                    var val = Number(viewValue);
                    if(val >= Number(scope.min) && val <= Number(scope.max)){
                        ngModel.$setValidity("minmaxram",true);
                    }else{
                        ngModel.$setValidity("minmaxram",false);
                    }
                }
                return viewValue;
            });
            scope.$watch(function(){
                return angular.element("#"+attrs.minmaxram).val();
            },function(startValue){
                if(Number(startValue)){
                    var val = Number(ngModel.$viewValue);
                    if(val >= Number(scope.min) && val <= Number(scope.max)){
                        ngModel.$setValidity("minmaxram",true);
                    }else{
                        ngModel.$setValidity("minmaxram",false);
                    }
                }

            });
        }
    };
}]);
validateModule.directive("minmaxChk",[function(){
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            min:"=",
            max:"="
        },
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                    let reg = /^[1-9]\d*$/
                    var val = Number(viewValue);
                    if(reg.test(viewValue)&&val >= Number(scope.min) && val <= Number(scope.max)){
                        ngModel.$setValidity("minmaxChk",true);
                    }else{
                        ngModel.$setValidity("minmaxChk",false);
                    }
                return viewValue;
            })
        }
    };
}]);
validateModule.directive("repeatName",[function(){ //校验输入的名称是否已存在
    return {
        restrict:"A",
        require:"ngModel",
        link:function(scope,elem,attr,ngModel){
            ngModel.$parsers.push(function(viewValue){
                if(viewValue && _.include(scope.existedNamesList,viewValue) ){
                    ngModel.$setValidity("repeatName",false);
                }else{
                    ngModel.$setValidity("repeatName",true);
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("exceptName",[function(){ //禁止输入某个名称
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            exceptname:"="
        },
        link:function(scope,elem,attr,ngModel){
            ngModel.$parsers.push(function(viewValue){
                if(viewValue && viewValue.toString() == scope.exceptname ){
                    ngModel.$setValidity("exceptName",false);
                }else{
                    ngModel.$setValidity("exceptName",true);
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("pwCheck", [function() {
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ngModel) {
            var firstPassword = "#" + attrs.pwCheck;
            elem.on("keyup", function() {
                scope.$apply(function() {
                    var v = elem.val() === $(firstPassword).val();
                    ngModel.$setValidity("pwCheck", v);
                });
            });
            scope.$watch(function(){
                return angular.element(firstPassword).val();
            },function(val){
                if(val && elem.val() != val){
                    ngModel.$setValidity("pwCheck", false);
                }else{
                    ngModel.$setValidity("pwCheck", true);
                }
            });
        }
    };
}]);
validateModule.directive("oldnewCheck", [function() { // 校验新密码是否与原密码相同
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ngModel) {
            var oldPassword = "#" + attrs.oldnewCheck;
            elem.on("keyup", function() {
                scope.$apply(function() {
                    var v = elem.val() !== $(oldPassword).val();
                    ngModel.$setValidity("oldnewCheck", v);
                });
            });
            scope.$watch(function(){
                return angular.element(oldPassword).val();
            },function(val){
                if(val && elem.val() == val){
                    ngModel.$setValidity("oldnewCheck", false);
                }else{
                    ngModel.$setValidity("oldnewCheck", true);
                }
            });
        }
    };
}]);
validateModule.directive("gtCurrTime",[function(){ //选择的时间大于当天日期校验
    return {
        restrict:"A",
        require:"ngModel",
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                var reg = /^\d{4}-([0][1-9]|[1][0-2])-([0-2][1-9]|[1-2][0]|[3][0-1])$/;
                if(scope.timePattern){
                    reg = scope.timePattern;
                }
                if(reg.test(viewValue)){
                    if(new Date(viewValue) > new Date(moment())){
                        ngModel.$setValidity("gtCurrTime",false);
                    }else{
                        ngModel.$setValidity("gtCurrTime",true);
                    }
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("availquota",[function(){ //资源是否超额
    return {
        restrict:"A",
        require:"ngModel",
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                if(scope.totalResMax&&scope.totalResMax.nodeQuota&&scope.totalResMax.nodeQuota[attrs.name]>=0){
                    if(viewValue>scope.totalResMax.nodeQuota[attrs.name]||viewValue<scope.totalResMin.nodeQuota[attrs.name]){  
                        ngModel.$setValidity("availquota",false);  
                    }else{
                        ngModel.$setValidity("availquota",true);
                    }
                }
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("gtTime",function(){ //日志模块结束时间大于起始时间校验
    return {
        restrict:"A",
        require:"ngModel",
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                scope.$watch(function(){
                    return scope.filterData;
                },function(filterData){
                    if(filterData.starttime && filterData.endtime){
                        var start_time = new Date(filterData.starttime);
                        var end_time =new Date(filterData.endtime);
                        if(start_time > end_time){
                            ngModel.$setValidity("gtTime",false);
                        }else{
                            ngModel.$setValidity("gtTime",true);
                        }
                    }else{
                        ngModel.$setValidity("gtTime",true);
                    }
                },true);
                return viewValue;
            });
        }
    };
});
validateModule.directive("gtBillTime",[function(){ //结束时间大于起始时间校验
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            gtBillTime:"="
        },
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                scope.$watch(function(){
                    return scope.gtBillTime;
                },function(filterData){
                    if(filterData.startAt && filterData.endAt){
                        var start_time = new Date(filterData.startAt);
                        var end_time =new Date(filterData.endAt);
                        if(start_time > end_time){
                            ngModel.$setValidity("gtBillTime",false);
                        }else{
                            ngModel.$setValidity("gtBillTime",true);
                        }
                    }
                },true);
                return viewValue;
            });
        }
    };
}]);
validateModule.directive("copyText",[function(){
    return {
        restrict: "EA",
        link:function(scope,elem,attr){
            var c = attr.copytarget;
            scope.copytext = "Copy";
            scope.copyTipShow = false;
            elem.on("click", function(){
                var inp = (c ? document.querySelector(c) : null);
                if (inp && inp.select) { // is element selectable?  判断元素是否能被选中
                    inp.select();  // select text 选择文本
                    try {
                        document.execCommand("copy");  // copy text复制文本
                        scope.copytext = "Copied";
                        scope.copyTipShow = true;
                        inp.blur(); //失去焦点
                    }
                    catch (err) {
                        alert("please press Ctrl/Cmd+C to copy");
                    }
                }
                scope.$apply();
            });
        }
    };
}]);
validateModule.directive("repeatVerify",[function(){
    return {
        restrict:"A",
        require:"ngModel",
        scope:{
            tableData:"=",
            keyName:"="
        },
        link:function(scope,elem,attrs,ngModel){
            ngModel.$parsers.push(function(viewValue){
                var map = {};
                for (var i = 0;i < scope.tableData.length;i++) {
                    map[scope.tableData[i][scope.keyName]] =  !map[scope.tableData[i][scope.keyName]];
                }
                if (!map[viewValue]) {
                    ngModel.$setValidity("nameexist",true);
                } else {
                    ngModel.$setValidity("nameexist",false);
                }
                return viewValue;
            });
        }
    };
}]);
export default validateModule.name;