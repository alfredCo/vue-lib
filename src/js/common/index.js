import ComServiceModule from "./service";
import ComDirectiveModule from "./directive";

let ComModule = angular.module("ComModule",[
    ComServiceModule,
    ComDirectiveModule
]);
export default ComModule.name;