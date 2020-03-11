<template>
    <div class="common-table">
        <el-table :data='tableData' height='90%' stripe>
            <el-table-column 
                 v-for="item in tableLabel" 
                 :key="item.prop"
                 :prop='item.prop'
                 :label='item.label'
                 align='center'
                 show-overflow-tooltip
                 >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作"  align='center' width="230px">
                <template slot-scope="scope">
                    <el-button
                        v-if='actions.edictor'
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button
                        v-if='actions.detail'
                        size="mini"
                        type="danger"
                        @click="handleDetail(scope.$index, scope.row)">
                        详情
                    </el-button>
                    <el-button
                        v-if='actions.delete'
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
export default {
    props:{
        tableLabel:{
            type:Array
        },
        tableData:{
            type:Array
        },
        // actions:{
        //     type:Object
        // }
    },
    methods: {
        handleEdit() {

        },
        handleDelete() {

        },
        handleDetail() {

        }
    },
}
</script>


<style scoped>
.common-table {
    height: calc(100% - 80px);
}
.page {
    padding-top: 10px;
    text-align: right;
}
</style>