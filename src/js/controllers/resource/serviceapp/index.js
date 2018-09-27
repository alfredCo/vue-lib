import "./serviceappSrv";
import {serviceappview} from "./serviceModule";
let serviceappModule = angular.module("serviceappModule", ["serviceappService"]);

serviceappModule.controller("serviceappCtrl", ["$scope", "TableCom", "$translate", "serviceappSrv", "$location", serviceappview]);

export default serviceappModule.name;