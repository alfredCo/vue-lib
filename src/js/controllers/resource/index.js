import serviceappModule from "./serviceapp";
import jobappModule from "./jobapp";
import daemsetappModule from "./daemsetapp";
import deploymentappModule from "./deploymentapp";
import replicasetsappModule from "./replicasetsapp";
import statefulsetappModule from "./statefulsetapp";
import podappModule from "./podapp";
let resourceModule = angular.module("resourceModule", [
    serviceappModule,
    jobappModule,
    daemsetappModule,
    deploymentappModule,
    replicasetsappModule,
    statefulsetappModule,
    podappModule
]);


export default resourceModule.name;