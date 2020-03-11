<template>
    <div class="questions">
        <div class="questions-item" v-for="(item,index) in questions" :key="index" v-if="item.answer">
            <div class="title">{{item.number}}、{{item.title}}</div>
            <el-radio-group v-model="item.answer" v-if="item.type =='radio'" class="radio">
                <el-radio :label="el.key" v-for="(el,index) in item.options" :key="index">{{el.name}}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-model="item.answer" v-else-if="item.type =='checkbox'" class="checkbox">
                <el-checkbox :label="el.key" v-for="(el,index) in item.options" :key="index">{{el.name}}</el-checkbox>
            </el-checkbox-group>
            <div class="text" v-else>
                <div>答：<span class="content">{{item.answer}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Questions',
    props:{
        questions:{
            default:[],
            type:Array
        }
    },
    watch:{
        questions:{
            handler(val){
                val.forEach(ele =>{
                    if(ele.type == 'checkbox'){
                        if(ele.answer){
                            ele.answer = ele.answer.split(',')
                        }
                    }
                })
            },
            deep:true,
            immediate:true
        }
    },
    data(){
        return {

        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.questions{
    width:100%;
    padding:10px 10px 10px 10px;
    box-sizing:border-box;
    .questions-item{
        background: rgb(250,250,250);
        padding: 10px 20px;
        box-sizing: border-box;
        .radio{
            padding:0px 15px;
            .el-radio{
                margin-top:12px;
            }
        }
        .checkbox{
            padding:0px 15px;
            .el-checkbox{
                margin-top:12px;
            }
        }
        .text{
            padding:12px 15px;
            color:rgb(64, 158, 255);
            div{
                .content{
                    border-bottom:1px solid rgb(64, 158, 255);
                }
            }
        }
    }
}
</style>
