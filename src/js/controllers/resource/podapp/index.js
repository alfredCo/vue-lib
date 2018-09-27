import "./podappSrv";
import {podappview} from "./podappModule";
let podappModule = angular.module("podappModule", ["podappService"]);

podappModule.controller("podappCtrl", ["$scope", "TableCom", "$translate", "podappSrv", "$location", podappview]);

export default podappModule.name;