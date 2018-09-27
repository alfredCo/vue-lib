import usermanageViewModule from "./storageVolumeModule";
import loadingsViewModule from "./loadingModule";

let storageVolumeModule = angular.module("storageVolumeModule", [
    usermanageViewModule,
    loadingsViewModule
]);


export default storageVolumeModule.name;