var tempTrainDataModule = angular.module("tempTrainDataModule", []);

tempTrainDataModule.service("TEMPTRAINDATA", [function() {
    var DATA = {
        /*CNN:{
            batch_size: 200,//一次性训练的图片数量， 默认200，可选
            learning_rate_base: 0.005,//基准学习率，小数，最大值1, 默认值0.005，保留6位，可选
            learning_rate_decay:0.99,//学习率衰减指数，小数，最大值1, 默认值0.99，保留6位，可选
            regularizer:0.0001,//训练的正则化指数，小数，最大值1, 默认值0.0001，保留6为，可选
            steps:10000,//训练的次数，整数，默认10000，可选
            eval_step:1000//每隔多少次训练，输出部分训练结果，默认1000，整数，可选，但是不能大于steps
        },*/
        CNN:[
            {
                name:"batch_size",
                value:"200"
            },
            {
                name:"learning_rate_base",
                value:"0.005"
            },
            {
                name:"learning_rate_decay",
                value:"0.99"
            },
            {
                name:"regularizer",
                value:"0.0001"
            },
            {
                name:"steps",
                value:"10000"
            },
            {
                name:"eval_step",
                value:"1000"
            },
        ],
        /*LETTER:{
            --rnn_size RNN隐藏状态个数 默认256， 正整数
            --num_layers RNN 层数  默认 2， 正整数
            --batch_size 一次填入单词个数 默认50， 正整数
            --num_epochs  默认1000， 正整数
            --learning_rate 学习效率  默认0.002 正实数
            --decay_rate   rmsprop衰减率 默认 0.97 正实数
        },*/
        LETTER:[
            {
                name:"rnn_size",
                value:"256"
            },
            {
                name:"num_layers",
                value:"2"
            },
            {
                name:"batch_size",
                value:"50"
            },
            {
                name:"num_epochs",
                value:"1000"
            },
            {
                name:"learning_rate",
                value:"0.002"
            },
            {
                name:"decay_rate",
                value:"0.97"
            }
        ],
        /*IMAGE:{
            training_steps:1,//   训练结束前运行的训练步数
            learning_rate:1,//   训练时使用的学习率大小
            eval_step_interval:1,// 训练结果评估的时间间隔
            train_batch_size:1// 一次训练的图像的数量
        },*/
        IMAGE:[
            {
                name:"training_steps",
                value:"10000"
            },
            {
                name:"learning_rate",
                value:"0.005"
            },
            {
                name:"eval_step_interval",
                value:"100"
            },
            {
                name:"train_batch_size",
                value:"100"
            }
        ],
        PATH:{
            CNN:"/library/tf-mnist-cnn-cpu:1.8.0",
            LETTER:"/library/tensorflow.lstm.predicate:1.8.0",
            IMAGE:"/library/tensorflow-flower:1.8.0"
        },
        NAME:{
            CNN:"tf-mnist-cnn-cpu",
            LETTER:"tf-lstm-wordpredict",
            IMAGE:"tensorflow-flower"
        }
    };
    return DATA;
}]);
export default tempTrainDataModule.name;
