import Vue from 'vue';
//一般的toast
Vue.prototype.$boxMessage = function(message, type='warning') {
    this.$message({
        type: type,
        message: message
    });
}

//修改，增加失败时间的提示，  需点击确认按钮
Vue.prototype.$confirmMessage = function(title='', content='', message) {
    this.$alert(content, title, {
        confirmButtonText: '确定',
        // callback: action => {
        //   this.$message({
        //     type: 'warning',
        //     message: message
        //   });
        // }
    });
}


//询问是否继续操作的按钮
Vue.prototype.$deleteMessage = function(title, content) {
    return this.$confirm(title, content, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
}


