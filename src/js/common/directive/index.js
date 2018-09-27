//example: import checkedmodule from './checkedSrv';
import UIModule from "./ui-directive";
import componentModule from "./component";
import validateModule from "./validate";

let ComDirectiveModule = angular.module("ComDirectiveModule",[
    UIModule,
    validateModule,
    componentModule
]);
export default ComDirectiveModule.name;