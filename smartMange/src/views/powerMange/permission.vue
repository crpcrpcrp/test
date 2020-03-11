<template>
  <div class="app-container" v-loading="listLoading">
    <div class="table">
         <div class="menu">
            <p>菜单权限 <el-button type='primary'  @click="addMenu('1')">添加一级菜单</el-button></p>
            <template>
            <el-table
              :data="pagePowver"
              stripe
              fit
              border
              >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <div v-for="(item, index) in props.row.children" :key="index" class="page">
                       <span>
                          <svg-icon :icon-class="item.icon" class-name="disabled" />
                         {{item.name}}
                      </span>
                       <span class="handle" @click="editorPage(item,props.row)">修改</span>
                       <span class="handle" @click="deleteMu(item,2)">删除</span>
                    </div>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="菜单名称" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <svg-icon :icon-class="row.icon" class-name="disabled" />
                    <span class="ico-name">
                       {{ row.name }}
                    </span>
                  </template>
              </el-table-column>
               <el-table-column
                label="图标名称"
                prop="icon"
                align="center"
                :show-overflow-tooltip="point">
              </el-table-column>
              <el-table-column
                label="url"
                prop="uri"
                align="center"
                :show-overflow-tooltip="point">
              </el-table-column>
              <el-table-column label="操作" align="center" width='330px' class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="editor(row)">
                      修改
                    </el-button>
                    <el-button type="warning" size="mini" @click="addPageMenu(row)">
                      添加子菜单
                    </el-button>
                    <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteMu(row,1)">
                      删除
                    </el-button>
                  </template>
              </el-table-column>
            </el-table>
          </template>
         </div>
    </div>
    

    <!-- 增加修改模块 -->
    <el-drawer
      :title="operateType == 'add' ? '添加一级菜单' : '修改一级菜单'"
      :visible.sync="dialogOperate"
      size='600px'
      direction="rtl"
      >
         <div class="editor">
             <common-form :formLable='formLable' :form='form' :labelWidth='editorLabelWidth'>
                <el-form-item label="菜单图标" required>
                  <el-select v-model="ico" placeholder="请选择" class='select' >
                    <el-option
                      v-for="item in svgIconsSelect"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                      <span class="icon-name" style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 16px" class='icon'><svg-icon slot="suffix"  :icon-class="item.name"/></span>
                    </el-option>
                  </el-select>
                  <span v-if="ico" class="icon-input" style=""><svg-icon slot="suffix"  :icon-class="ico"/></span>
                </el-form-item>
                <el-form-item >
                    <el-button type='primary' @click="submit">确定</el-button>
                    <el-button type='primary' @click="cancle">取消</el-button>
                </el-form-item>
             </common-form>
         </div>
    </el-drawer>



    <el-drawer
      :title="operatePageType == 'add' ? '添加子菜单' : '修改子菜单'"
      :visible.sync="dialogPageOperate"
      size='860px'
      direction="rtl"
      >
         <div class="editor">
             <common-form :formLable='formPageLable' :form='formPage' :labelWidth='labelWidth'>
                <el-form-item label="二级菜单图标" required>
                  <el-select v-model="ico" placeholder="请选择" class='select' >
                    <el-option
                      v-for="item in svgIconsSelect"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                      <span class="icon-name" style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 16px"><svg-icon slot="suffix"  :icon-class="item.name"/></span>
                    </el-option>
                  </el-select>
                  <span v-if="ico" class="icon-input" style=""><svg-icon slot="suffix"  :icon-class="ico"/></span>
                </el-form-item>
                <div style='' class='page-permission'>
                  <div class="title" style="">
                      按钮配置
                  </div>
                  
                   <el-form ref="form" v-for="(item, index) in btnValus" :key="index"  inline label-position='right' label-width="100px">
                      <el-form-item label="按钮名称"  >
                          <el-input class="el-item" v-model="item.name" ></el-input>
                      </el-form-item>
                      <el-form-item label="按钮权限值"  >
                          <el-input class="el-item" v-model="item.value" ></el-input>
                      </el-form-item>
                      <el-form-item >
                           <el-button type="primary" icon="el-icon-delete" @click="deleteBtn(index)" ></el-button>
                      </el-form-item>

                     

                   </el-form>

                  <div style='' class='wrap-btn'>
                     <span style='' class='addPageBtn' @click="addPageBtn">增加按钮</span>
                  </div>

                </div>
                <el-form-item >
                    <el-button type='primary' @click='pageSubmit'>确定</el-button>
                    <el-button type='primary' @click='pageCancle'>取消</el-button>
                </el-form-item>
             </common-form>
         </div>
    </el-drawer>
  </div>
</template>

<script>
import CommonForm from '@/components/CommonForm'
import { getAllMenu,  //获取所有的菜单
          updateMenu,   //修改菜单
         addFirstMenu,  //增加一级菜单
         updateFirst,   //修改一级菜单
         deleteFirst,   //删除一级菜单
         addSecondMenu,  //添加二级菜单
         updateSecond, //修改二级菜单
         deletesSecond, //删除二级菜单
      } from '@/myApi/powerMange/permission'
import { constants, copyFileSync } from 'fs';
import svgIcons from "./icons/svg-icons";
import { ESPIPE } from 'constants';
export default {
  components: { CommonForm },
  data() {
    return {
      listLoading:false,
      //一级菜单
      operateType:"",  //操作类型
      dialogOperate:false,//增加或者修改的框
      pagePowver:[],  //侧边栏
      point:true,
      svgIcons, //icon数组
      svgIconsSelect:[], //可用的icon数组
      formLable:[ //修改增加表单的参数
        {
            model:'name',
            lable:'一级菜单名称',
            option:[],
            placeholder:"请输入菜单名称",
            width:"220px",
            show:true
        },
         {
            model:'value',
            lable:'一级菜单权限值',
            option:[],
            placeholder:"请输入一级菜单权限值",
            show:true,
            width:"220px",
        },
        {
            model:'url',
            lable:'菜单url',
            option:[],
            placeholder:"请输入菜单url",
            show:true,
            width:"220px",
        },
      ],
      form:{//修改增加表单的数据
        name:"",
        url:"",
        value:""
      },
      editorLabelWidth:"120px",
      labelWidth:'140px',



       //二级别菜单
      operatePageType:'',
      dialogPageOperate:false,
      formPageLable:[ //修改增加表单的参数
        {
            model:'name',
            lable:'一级菜单名称',
            option:[],
            placeholder:"请输入菜单名称",
            show:true,
            disabled:true
        },
        {
            model:'pageName',
            lable:'二级菜单名称',
            option:[],
            placeholder:"请输入二级菜单名称",
            show:true
        },
        {
            model:'url',
            lable:'二级菜单url',
            option:[],
            placeholder:"请输入二级菜单url",
            show:true,
        },
        {
            model:'value',
            lable:'二级菜单权限值',
            option:[],
            placeholder:"请输入二级菜单权限值",
            show:true,
        },
      ],
      formPage:{//修改增加表单的数据
        name:"",
        pageName:"",
        url:"",
        value:""
      },
      pageIco:"",
      btnValus:[
        {
          value:"",
          name:""
        }
      ],

      ico:'',
      meunId:"",
      parentId:""
    }
  },
  created() {
    this.getAllMenu()
    this.svgIcons.forEach(element => { //处理选矿
       this.svgIconsSelect.push({name:element})
    });
  },
  methods:{
    editor(row) { //修改一级菜单按钮
        this.dialogOperate = true
        this.operateType = 'editor'
        this.form = {
          name:row.name,
          url:row.uri,
          value:row.value
        }
        this.ico = row.icon
        this.meunId = row.id
    },
    submit() {   //提交一级菜单
        let data = {
             name:this.form.name,
             url:this.form.url,
             icon:this.ico,
             value:this.form.value
        }
        if(this.operateType == 'editor') { //一级菜单修改
            data.id = this.meunId
            this.updateMenu(data)  
        } else {                          //一级菜单添加
            data.parentId = this.parentId
            this.subAddMenu(data)
        }
    },
    addFirstMenu(data) {//添加一级的提交按钮
      addFirstMenu(data).then(res => {
        if(res.data.code == 200) {
            this.$boxMessage( res.data.msg, 'warning')
            this.dialogOperate = false
            this.dialogPageOperate = false
            this.getAllMenu()
        } else {
          this.$boxMessage( res.data.msg, 'warning')
        }
      }).catch(err => {
        this.$boxMessage( '系统繁忙', 'warning')
      })
    },
    addMenu(item) { //添加一级菜单按钮，初始化
        this.dialogOperate = true
        this.btnValus = [{
          value:"",
          name:""
        }],
        this.operateType ='add'
        this.form = {
              name:"",
              url:"",
         },
        this.ico = '',
        this.meunId = ""
        this.parentId = 1
    },
    updateMenu(data) {//一级修改提交的菜单
        updateFirst(data).then(res => {
          if(res.data.code == 200) {
              this.$boxMessage( res.data.msg, 'warning')
              this.dialogOperate = false
              this.getAllMenu()
          } else {
            this.$boxMessage( res.data.msg, 'warning')
          }
        }).catch(err => {
           this.$boxMessage( '系统繁忙', 'warning')
        })
    },
    subAddMenu(data) {//验证添加一级菜单
        if(this.form.name === '' || this.form.url ==='' || this.ico === '' || this.form.value === '') {
          this.$boxMessage( '请完善信息', 'warning')
          return
        }
        this.addFirstMenu(data)
    },
    cancle() {
        this.dialogOperate = false
    },
    addPageMenu(item) { //添加二级菜单
        this.formPage = {
          name:item.name,
          pageName:'',
          url:'',
          value:""
        }
        this.ico = ''
        this.btnValus = [{
          value:"",
          name:"",
        }],
        this.parentId = item.id
        this.dialogPageOperate = true
        this.operatePageType ='add'
        
    },
    addPageBtn() {//按钮
        this.btnValus.push({
          value:"",
          name:""
        })
        
    },
    pageSubmit() { //提交二级菜单按钮
        if(this.formPage.pageName === '' || this.formPage.url === '' || this.ico === '' || this.formPage.value === '') {
           this.$message({
                type: 'warning',
                message: '请完善信息'
            });
            return
        }
        if(this.btnValus.length) {
          for(let i = 0; i < this.btnValus.length; i ++ ) {
            if(!this.btnValus[i].value || !this.btnValus[i].name) {
                this.$message({
                    type: 'warning',
                    message: '请完善按钮信息'
                });
                return
            }
          }
        } else {
          this.btnValus = []
        }
        let data = {
             name:this.formPage.pageName,
             url:this.formPage.url,
             value:this.formPage.value,
             icon:this.ico,
             parentId:this.parentId,
             children:this.btnValus
         }
        this.subSecondMenu(data)
    },
    addSonMenu(data) { //添加二级菜单
       this.dialogOperate = false
       this.dialogPageOperate = false
       addSecondMenu(data).then(res => {
         if(res.data.code == 200) {
            this.$boxMessage( res.data.msg, 'warning')
            this.getAllMenu()
         } else {
          this.$boxMessage( res.data.msg, 'warning')
        }
       }).catch(err => {
          this.$boxMessage( '系统繁忙', 'warning')
       })
    },
    subSecondMenu(data) {  //二级菜单的提交
        if(this.operatePageType === 'add'){
            this.addSonMenu(data)
        } else {
           data.id = this.meunId
           this.updateSecond(data)
        }
    },
    updateSecond(data) {  //二级菜单的修改
      this.dialogOperate = false
      this.dialogPageOperate = false
      updateSecond(data).then(res => {
        if(res.data.code == 200) {
             this.$boxMessage( res.data.msg, 'warning')
             this.getAllMenu()
        } else {
          this.$boxMessage( res.data.msg, 'warning')
        }
      }).catch(err => {
        this.$boxMessage( '系统繁忙', 'warning')
      })
    },
    pageCancle() {
        this.dialogPageOperate = false
    },
    editorPage(item,row) {//修改二级菜单
        this.dialogPageOperate = true
        // console.log(item,row)
        this.operatePageType ='editor'
        this.formPage.name = row.name

        this.formPage = {//修改增加表单的数据
          name:row.name,
          pageName:item.name,
          url:item.uri,
          value:item.value
        }
        this.ico = item.icon
        this.btnValus = item.children || []
        this.meunId = item.id
    },
    getAllMenu() { //侧边栏
      this.listLoading = true
      getAllMenu().then(res => {
        if(res.data.code == 200) {
            this.pagePowver = res.data.data.list   
            this.listLoading = false
        } else {
           this.$message({
              type: 'warning',
              message: '系统繁忙'
          });
        }
      }).catch(err => {
         this.$message({
          type: 'warning',
          message: '系统繁忙'
        });
      })
      //
    },
    deleteMu(item,menu) {//删除菜单
      this.$confirm('此操作将删除该菜单及其所有内容, 是否继续?', '警告！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {id : item.id }
        if(menu == 1) {
           this.deleteFirst(obj)
        } else {
           this.deletesSecond(obj)
        }
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    deletesSecond(obj) {
        deletesSecond(obj).then(res => {
          if(res.data.code == 200){
            this.$boxMessage( '删除成功', 'success')
            this.getAllMenu()
          } else {
            this.$boxMessage( res.data.msg, 'warning')
          }
        }).catch(err => {
            this.$boxMessage( '系统繁忙', 'warning')
        })
    },
    deleteFirst(obj) {
       deleteFirst(obj).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAllMenu()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })
    },
    deleteBtn(index) {//删除按钮
       this.btnValus.splice(index,1)
    }
   
  }
}
</script>


<style lang="scss" scoped>
.filter-container{
  // margin-bottom: 15px;
}
.app-container {
  padding: 0 20px 20px 20px;
}
.el-form-item .el-select{
  width: 100%;
}
.common-table {
    height: 500px;
}
.table {
    // display: flex;
    .menu {
        // flex: 1;
        width:80%;
        height: 100%;
        padding: 20px;
        p {
            font-size: 20px
        }
    }
    .choose {
        flex: 1;
        height: 100%;
        padding: 20px;
         p {
            font-size: 20px
        }
    }
}
.table .el-table__row--level-0 {
  background: red !important;
  height: 100px;;
}
.page {
  height: 40px;
  line-height: 40px;
  .handle {
    margin-left: 20px;
    color: blue;
    cursor: pointer;
    padding: 0 10px;
    text-align: center;
  }
}

.icons-container {
  overflow: auto;
  width: 100%;
  height: 200px;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  margin-bottom: 20px;
  .closeIcons {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 999;
  }
  // .el-tabs--border-card{      //加入element-icon时tab样式切为这个父类
  .icons-content-wrap {
    height: 230px;
    width: 100%;
    overflow: auto;
    .icon-item {
      margin: 0px;
      height: 80px;
      text-align: center;
      width: 25%;
      float: left;
      font-size: 28px;
      color: #24292e;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      // align-items: center;
      padding: 10px;
      overflow: hidden;
      box-sizing: border-box;
      svg {
        margin: 0 auto;
      }
    }
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 20px;
      display: block;
      text-align: center;
      font-size: 13px;
      margin-top: 5px;
    }
  }
  .disabled {
    pointer-events: none;
  }
}
.demo-table-expand {
  padding-left: 20px;
  span {
    display: inline-block;
    width: 100px;
  }
}
.ico-name {
  margin-left: 10px;
}
.editor {
    padding: 20px 40px;
    max-height: calc(100vh - 100px);
    overflow: auto;
    .select {
        display:inline-block;
        width:80%;
    }
    .icon-input {
        margin-left:10px;
        color: #8492a6; 
        font-size: 20px
    }
}
.title {
    height:50px; 
    line-height:50px;
    margin-bottom:15px;
}
.page-permission {
  border:1px solid gray;
  padding:10px 20px 20px 20px;
  margin-bottom:20px;
  cursor:pointer;
}

.wrap-btn {
  height:50px;
  line-height:50px;
  text-align:center;
  .addPageBtn {
    padding:12px 8px;
    border:1px solid gray;
    border-radius:5px;
    font-size:14px;
  }
}
</style>
