import "./jobappSrv";
import {jobappview} from "./jobappModule";
let jobappModule = angular.module("jobappModule", ["jobappService"]);

jobappModule.controller("jobappCtrl", ["$scope", "TableCom", "$translate", "jobappSrv", "$location", jobappview]);

export default jobappModule.name;