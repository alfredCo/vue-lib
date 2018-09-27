import "./replicasetsappSrv";
import {replicasetsappview} from "./replicasetsappModule";
let replicasetsappModule = angular.module("replicasetsappModule", ["replicasetsappService"]);
replicasetsappModule.controller("replicasetsappCtrl", ["$scope", "TableCom", "$translate", "replicasetsappSrv", "$location", replicasetsappview]);

export default replicasetsappModule.name;