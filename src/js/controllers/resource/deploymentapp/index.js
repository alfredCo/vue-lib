import "./deploymentappSrv";
import {deploymentappview} from "./deploymentappModule";
let deploymentappModule = angular.module("deploymentappModule", ["deploymentappService"]);

deploymentappModule.controller("deploymentappCtrl", ["$scope", "TableCom", "$translate", "deploymentappSrv", "$location", deploymentappview]);

export default deploymentappModule.name;