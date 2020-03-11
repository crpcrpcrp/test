<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      action="string"
      :http-request="uploadFile"
      :file-list="fileList">
      <el-button size="small" icon="el-icon-upload2">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" style="fontSize:14px">{{des}}</div>
    </el-upload>
  </div>
</template>
<script>
  import { uploadFile } from '@/myApi/gobackApplication';

  export default {
    name:'upload',
    props: {
      name: {
        type: String,
        default: '',
      },
      des: {
        type: String,
        default: '',
      },
      supportFileType:{
        type: Array,
        default: ()=>[],
      }
    },
    data(){
      return {
        fileList: [],
        fileUrl: '',
      };
    },
    mounted() {

    },
    methods: {
      beforeUpload(file) {
        console.log(file, 'file type')
        let fileSupport = false;
        this.supportFileType.map(item=>{
          if(file.type.indexOf(item) !== -1) {
            fileSupport = true;
          }
        });
        if(!fileSupport) {
          this.$message.error('不支持此上传文件格式');
          this.fileList = [];
          return false;
        }
        return true
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.$emit('upload', {name:this.name, str:''});
      },
      handlePreview(file) {
        console.log(file);
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-1);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      /** 文件上传 **/
      async uploadFile(item) {
        console.log(item, 'file item')
        // 发起上传请求
        const formData = new FormData()
        formData.append('multipartFile', item.file);

        const { data } = uploadFile(formData).then(res=>{
          const {data} = res;
          if(data.code === 200) {
            this.$emit('upload', {name:this.name, str:data.data.string})
          } else {
            this.fileList.splice(0,this.fileList.length);
          }
        }).catch((res)=>{
          this.$message.error(res.message);
          this.fileList.splice(0,this.fileList.length);
          this.$emit('upload', {name:this.name, str:''})
        });

      },
    },
  }
</script>
