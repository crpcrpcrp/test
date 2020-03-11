<template>
    <div class="common-table">
        <input type="file" id="file" accept="image/gif, image/jpeg, image/png," ref='upload' @change="uploadInp">
        <img class='upload' style="border:1px solid red;height: 100px;width:100px;" @click="clickImg">
        <img src="" class="img">
    </div>
</template>

<script>
export default {
  methods: {
    clickImg() {
        this.$refs.upload.click()
    },
    getImgInfo(ev){
        var oFile=ev
        var reader=new FileReader();
        reader.onload=function(){
            var oImg=new Image();
            oImg.src = this.result;
            document.body.appendChild(oImg);
            oImg.onload=function(){
                var imgWidth=oImg.offsetWidth;
                var imgHeight=oImg.offsetHeight;
                document.body.removeChild(oImg);
            };
        };
        reader.readAsDataURL(oFile);

    },
    uploadInp(e) {
        let file = e.target.files[0];
        this.getImgInfo(file)
    },
    uploadPicture() {

    }


  }
}
</script>


<style scoped>
#file{
    opacity:0;
}
</style>
