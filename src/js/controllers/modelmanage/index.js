import modelmanageModule from "./modelmanageModule";
import modelapplicModule from "./modelapplicModule";

let modelModule = angular.module("modelModule", [
    modelmanageModule,
    modelapplicModule
]);


export default modelModule.name;