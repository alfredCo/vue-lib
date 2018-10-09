<template>
  <div class="page-inner">
    <div class="table-action">
      <div class="pull-left" ng-show="userSwitchSrv.traincluster">
          <button type="button" data-toggle="modal" class="btn btn-primary" ng-click="createTrain()">
              <i class="icon-aw-add-to2"></i>新建训练</button>
          <button type="button" data-toggle="modal" ng-click="stopTrain(checkedItems)" class="btn btn-warning" ng-disabled="!canStopTrain">
              <i class="icon-aw-time-out"></i>停止训练</button>
          <button type="button" data-toggle="modal" ng-click="retraining(checkedItems)" class="btn btn-info" ng-disabled="!canReTrain">
              <i class="icon-aw-repeat"></i>重新训练</button>
          <button type="button" data-toggle="modal" ng-click="subsequentTraining(checkedItems)" class="btn btn-info" ng-disabled="!canSubsequent">
              <i class="icon-aw-start-up"></i>继续训练</button>
          <div class="dropdown">
              <button type="button" class="btn btn-info dropdown-toggle" ng-disabled="!canMoreOpt" data-toggle="dropdown">更多操作
                  <i class="icon-aw-angle-down-1"></i>
              </button>
              <ul class="dropdown-menu">
                  <li>
                      <button ng-click="checkJupyter(checkedItems)" ng-disabled="!canCheckJupyter">查看Jupyter Notebook</button>
                  </li>
                  <li>
                      <button ng-click="checkTensorboard(checkedItems)" ng-disabled="!canCheckTensor">查看TensorBoard</button>
                  </li>
                  <li>
                      <button ng-click="editTrainParams(checkedItems)" ng-disabled="!canEditHyperparameter">编辑超参数</button>
                  </li>
                  <li>
                      <button ng-click="deleteTraining(checkedItems)" ng-disabled="!canDeleteTraining">删除训练</button>
                  </li>
                  <li>
                      <button ng-click="relaseModel(checkedItems)" ng-disabled="!canRealseModel">发布模型</button>
                  </li>
              </ul>
          </div>
      </div>
    </div>
    <div class="table-content">
      <table class="table">
        <tbody>
          <tr v-for="item in imgList" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.num}}</td>
            <td>{{item.url}}</td>
            <td>{{item.createTime}}</td>
          </tr>
        </tbody>
      </table> 
    </div>
  </div>
</template>
<script>
export default {
  data:function(){
    return{
      ao:"ddd",
      imgList:[]
    }
  },
  methods:{
    getData:function(){
      console.log(1234);
      let _this = this
      axios.get('http://172.16.2.100:30093/ailab-manager/v1/front/getPictureInfos').then(function(res){
        console.log(res);
        _this.imgList = res.data;
      })
    }
  },
  created:function(){
    this.getData();
  }
}
</script>


  
