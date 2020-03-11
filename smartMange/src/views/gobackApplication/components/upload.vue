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
      let fileSupport = false;
      // console.log(file.size)
      if (file.size) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if(!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          return false;
        }
      }
      this.supportFileType.map(item=>{
        const splitFileName = file.name.split('.');
        const splitFileNameLen = splitFileName.length;
        const suffix = splitFileName[splitFileNameLen-1];
        if(file.type.indexOf(item) !== -1 || suffix.indexOf(item) !== -1) {
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
      this.$emit('upload', {name:this.name, str:''});
    },
    handlePreview(file) {
      // console.log(file);
      window.open(this.fileUrl)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    // 重置文件表单
    resetFileList() {
      this.fileList = this.fileList.slice(this.fileList.length);
      this.$emit('upload', {name:this.name, str:''});
      // console.log(this.fileList)
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
    /** 文件上传 **/
    async uploadFile(item) {
      // 发起上传请求
      const formData = new FormData()
      formData.append('multipartFile', item.file);

      const { data } = uploadFile(formData).then(res=>{
        const {data} = res;
        if(data.code === 200) {
          this.$emit('upload', {name:this.name, str:data.data.string})
          this.fileUrl = data.data.string;
          // console.log(this.fileUrl)
        } else {
          this.fileList.splice(0,this.fileList.length);
          this.fileUrl = '';
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