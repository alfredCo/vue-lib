import "./daemsetappSrv";
import {daemsetappview} from "./daemsetappModule";
let daemsetappModule = angular.module("daemsetappModule", ["daemsetappService"]);

daemsetappModule.controller("daemsetappCtrl", ["$scope", "TableCom", "$translate", "daemsetappSrv", "$location", daemsetappview]);

export default daemsetappModule.name;