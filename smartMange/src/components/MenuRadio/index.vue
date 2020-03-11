<template>
    <div class="wrapper">
       <span> {{item.name}}</span> 
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <div>
             <span v-for="(value, index) in item.children" :key="index" class="check">
                <label>
                    <input name="Fruit" type="checkbox" value="value.id" :checked="value.checked" @change="handleCheck()"/> 
                    <span class="check-item">{{value.name}}</span> 
                </label> 
             </span>
        </div>
    </div>
 </template>

 <script>
 export default {
    props:{
       item:{
            type:Object
       }
    },
    data() {
        return {
            checkAll: false,
            checkedCities: [],
            menuOptins: [{
                name:"杭州",
                id:'111',
                checked:true
            },
            {
                name:"北京",
                id:'222',
                checked:false
            },
            {
                name:"南京",
                id:'22',
                checked:false
            },
            {
                name:"天津",
                id:'333',
                checked:false
            }
            ],
            isIndeterminate: false
        }
    },
    created() {
        console.log(this.item, 22222)
    },
    methods:{
        handleCheckAllChange(val) {
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            console.log(value,this.isIndeterminate)
            // let checkedCount = value.length;
            // this.checkAll = checkedCount === this.cities.length;
            // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        handleCheck() {
            
        }
    }
 }
 </script>
 

 <style lang="scss" scoped>
 .wrapper {
     margin: 30px 0 0 0;
     span {
        font-size:20px;
     }
    .check {
        display: inline-block;
        width: 100px;
        label {
            span {
                font-size: 16px;
                font-weight: normal;
                margin-right: 15px;
            }
        }
    }
 }


</style>
