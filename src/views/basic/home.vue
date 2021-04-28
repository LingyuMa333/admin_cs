<template>
    <div class="container">

        <div class="top">
<!-- 
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
            <a-form-model-item has-feedback label="新密码" prop="pass">
                <a-input v-model="ruleForm.pass" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item has-feedback label="确认新密码" prop="checkPass">
                <a-input v-model="ruleForm.checkPass" autocomplete="off"/>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="submitForm('ruleForm')">
                    确定
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
                    重置
                </a-button>
            </a-form-model-item>
        </a-form-model> -->

        </div>

    </div>
</template>

<script>
    import UploadImage from "@/components/UploadImage";
    import {reload} from "@/mixins";

    export default {
        mixins: [reload],

        components: {UploadImage},

        // data() {

        //     return {
        //         ruleForm: {
        //             pass: '',
        //             checkPass: '',
        //         },
        //         rules: {
        //             pass: [{required: true, message: "请输入密码"}],
        //             checkPass: [{required: true, message: "请再次确认密码"}],

        //         },
        //         layout: {
        //             labelCol: {span: 4},
        //             wrapperCol: {span: 14},
        //         },

        //     };
        // },

        mounted() {


        },

        methods: {
            // submitForm(formName) {
            //     this.$refs[formName].validate(valid => {
            //         if (valid) {
            //             alert('submit!');
            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
            // resetForm(formName) {
            //     this.$refs[formName].resetFields();
            // },


        }
    };
</script>

<style lang="scss" scoped>
    .container {
        padding: 10px;
        height: 800px;
        background-color: #fff;




    .image {
        height: 70px;
    }

    }
</style>
