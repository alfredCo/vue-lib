import dataSetViewModule from "./datasetmanage/dataSetModule";
import loadingViewModule from "./datasetmanage/loadingModule";

let dataSetModule = angular.module("dataSetModule", [
    dataSetViewModule,    
    loadingViewModule
]);


export default dataSetModule.name;