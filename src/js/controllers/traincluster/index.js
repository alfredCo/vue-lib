import trainclusterModule from "./trainclusterModule";
import temptrainModule from "./tempTrainclusterModule";

let trainModule = angular.module("trainModule", [
    trainclusterModule,temptrainModule
]);

export default trainModule.name;