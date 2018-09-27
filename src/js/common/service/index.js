import checkedmodule from "./checkedSrv";
import alertmodule from "./alertSrv";
import globalSettingModule from "./globalSetting";
import comModule from "./component";
import detailModule from "./detailSrv";
import userSwitchModule from "./userSwitchSrv";
import tempTrainDataModule from "./tempTrainData";
let ComServiceModule = angular.module("ComServiceModule",[
    checkedmodule,
    alertmodule,
    globalSettingModule,
    comModule,
    detailModule,
    userSwitchModule,
    tempTrainDataModule
]);
export default ComServiceModule.name;