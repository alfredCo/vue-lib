import "./statefulsetappSrv";
import {statefulsetappview} from "./statefulsetappModule";
let statefulsetappModule = angular.module("statefulsetappModule", ["statefulsetappService"]);

statefulsetappModule.controller("statefulsetappCtrl", ["$scope", "TableCom", "$translate", "statefulsetappSrv", "$location", statefulsetappview]);

export default statefulsetappModule.name;