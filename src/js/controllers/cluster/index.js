import clusterViewModule from "./clusterview";
import monitorViewModule from "./monitor";
let clusterModule = angular.module("clusterModule", [
    clusterViewModule,
    monitorViewModule
]);


export default clusterModule.name;