<template>
    <div class="container">
        <a-modal
                :destroyOnClose="true"
                :visible="visible"
                width="500px"
                :closable="false"
                okText="保存"
                cancelText="取消"
                title="重置密码"
                centered
                :confirmLoading="btnLoading"
                @ok="save"
                @cancel="visible=false"
        >
            <!-- <a-radio-group v-model="editItem.qlevel">
                <a-radio-button :value="1">管理员</a-radio-button>
                <a-radio-button :value="2">业务员</a-radio-button>
                <a-radio-button :value="3">普通用户</a-radio-button>
            </a-radio-group> -->
        </a-modal>

        <!--添加用户-->

        <a-modal
                :destroyOnClose="true"
                :visible="userVisible"
                width="800px"
                :closable="false"
                okText="保存"
                cancelText="取消"
                centered
                :confirmLoading="userBtnLoading"
                @ok="saveUser"
                @cancel="userVisible=false"
        >
            <a-form-model ref="userForm" :model="userForm" :rules="userRules" >
                <a-form-model-item
                        prop="userCode"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="登录名"
                >
                    <a-input v-model="userForm.userCode"></a-input>
                </a-form-model-item>
                <a-form-model-item
                        prop="userName"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="姓名"
                >
                <a-input v-model="userForm.userName"></a-input>

                </a-form-model-item>
                   <a-form-model-item
                        prop="roleCode"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="角色"
                >
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item :key="key" v-for="(name,key) in selectList" > {{name }} </a-menu-item>
                            </a-menu>
                        <a-button style="margin-left: 8px"> {{selectName}} <a-icon type="down" /> </a-button>
                    </a-dropdown>
                </a-form-model-item>

                <a-form-model-item
                        prop="email"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="邮箱"
                >
                    <a-input v-model="userForm.email"></a-input>
                </a-form-model-item>
                <!-- <a-form-model-item
                        prop="avatar"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 16 }"
                        label="头像"
                >
                    <UploadImage v-model="userForm.avatar" :OSS="OSS"/>
                </a-form-model-item> -->


            </a-form-model>
        </a-modal>


        <a-row type="flex" :gutter="10" style="margin-bottom:10px" justify="space-between">

            <a-col>               
                <a-button type="primary" icon="plus" @click="add">添加用户</a-button>
            </a-col>
            <!-- <a-col>
                <a-dropdown>
                    <a-menu slot="overlay" @click="handleMenuClick">
                         <a-menu-item :key="item.id" v-for="(item, index) in selectList" > {{item}} </a-menu-item> 
                        <a-menu-item :key="key" v-for="(name,key) in selectList" > {{name }} </a-menu-item>

                    </a-menu>
                    <a-button style="margin-left: 8px"> {{selectName}} <a-icon type="down" /> </a-button>
                </a-dropdown>
            </a-col> -->
            <!-- <a-col>
                <a-radio-group @change="typeChange" v-model="qlevel">
                    <a-radio-button value>全部</a-radio-button>
                    <a-radio-button value="1">管理员</a-radio-button>
                    <a-radio-button value="2">业务员</a-radio-button>
                    <a-radio-button value="3">普通用户</a-radio-button>
                </a-radio-group>
            </a-col> -->
            <a-col>                 
                <a-input-search placeholder v-model="key" enterButton @search="search"/>
            </a-col>
            <a-col>
                <a-button type="primary" icon="reload" @click="reload"></a-button>
            </a-col>
        </a-row>
        <a-table
                :dataSource="list"
                :columns="columns"
                :rowKey="record=>record.id"
                :loading="loading"
                :pagination=false
                @change="tableChange"
        >
            <template slot="avatar" slot-scope="item">
                <a-avatar size="large" :src="item.avatar" icon="user"/>
            </template>
            <template slot="type" slot-scope="item">
                <a-tag v-if="item.user_type==0">用户</a-tag>
                <a-tag v-if="item.user_type==1" color="orange">站长</a-tag>
                <a-tag v-if="item.user_type==2" color="blue">员工</a-tag>
            </template>
            <template slot="mobile" slot-scope="item">
                <div>{{item.mobile||'-'}}</div>
            </template>
            <template slot="operation" slot-scope="item">
                <a>
                    <a-icon type="edit" style="font-size:20px;margin-right:20px;" @click="save(item)"></a-icon>
                </a>
                <a>
                    <a-icon type="delete" style="font-size:20px;margin-right:40px;" @click="del(item.id)"></a-icon>
                </a>
            </template>
        </a-table>
        
        <div style="display: flex;flex-direction:column ;align-items: flex-end;width: 100%;margin-top: 10px">


        <a-pagination
                v-model="current"
                :page-size-options="pageSizeOptions"
                :total="total"
                show-size-changer
                :page-size="pageSize"
                @change="onChange"
                @showSizeChange="onShowSizeChange"
        >
            <template slot="buildOptionText" slot-scope="props">
                <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
                <span v-if="props.value === '50'">全部</span>
            </template>
        </a-pagination>

        </div>
    </div>
</template>

<script>
    import UploadImage from "@/components/UploadImage";

    import {reload} from "@/mixins";


    export default {
        mixins: [reload],
        components: { UploadImage },


        data() {
            return {
                list: [],
                stations: [],
                form: {mobile: "", gas_id: ""},

                userForm: {
                    userCode: "",
                    userName: "",
                    roleCode: "",
                    email: "",
                    avatar: [],
                },
                userRules: {                    
                    userCode:[
                        {
                            required: true,
                            message: "请输入正确的登录名,字母开头，允许5-16位",
                            trigger: "blur",
                            //字母开头，允许 5 - 16 字节
                            pattern: /^[a-zA-Z][a-zA-Z0-9]{4,20}$/
                        }
                    ],
                    userName: [{ required: true, message: "请输入姓名" }],
                    roleCode: [{ required: true, message: "请选择角色" }],
                    email:[
                        {
                            required: true,
                            message: "请输入正确的邮箱",
                            trigger: "blur",
                            //字母开头，允许 5 - 16 字节
                            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                        }
                    ],                    
                },
                selectName:"请选择",
                selectList:[
                    // {id:"0",name:"测试一"},
                    // {id:"1",name:"测试二"},
                    // {id:"2",name:"测试三"},
                    // {id:"3",name:"测试四"},
                    // {id:"4",name:"测试五"}
                ],

                rules: {
                    mobile: [
                        {
                            required: true,
                            message: "请输入正确的手机号",
                            trigger: "blur",
                            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
                        }
                    ],
                    gas_id: [{required: true, message: "请选择", trigger: "change"}]
                },
                columns: [
                    {title: "ID", dataIndex: "id", align: "center"},
                    {title: "用户名", dataIndex: "userCode", align: "center"},
                    {title: "姓名", dataIndex: "userName", align: "center"},                   
                    {title: "邮箱",align: "center",  dataIndex:"email"},
                    {title: "用户角色", dataIndex: "roleName", align: "center"},
                    {title: "操作时间", dataIndex: "updateTime", align: "center"},
                    {
                        title: "操作",
                        align: "center",
                        scopedSlots: {customRender: "operation"}
                    }
                ],
                loading: false,
                visible: false,
                btnLoading: false,
                editItem: {},
                pagination: {total: 0, current: 1, pageSize: 10},
                OSS: {},
                qlevel: "",
                key: "",
                userVisible: false,
                userBtnLoading: false,
                //分页
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                current: 1,
                pageSize: 10,//默认每页10条数据
                total: 50,

            };
        },

        mounted() {
            this.getList(1);
            //this.getOss();
            this.getRoleList();
        },

        methods: {
            handleMenuClick(e){
                console.log('click', e);
                console.log('key', e.key);
                // for(const key in this.selectList){
                //     console.log('index', index);
                //     if(e.key==key){
                //         this.selectName=selectList[key]
                //     }
                // }
                this.selectName=this.selectList[e.key]
                this.userForm.roleCode=e.key
                //this.$message.error("点击的id是"+e.key);
            },
            onChange(page,pageSize){

                this.getList(page);

            },

            onShowSizeChange(current, pageSize) {
                this.pageSize = pageSize;

                this.getList(current);

                console.log("pageSize="+this.pageSize)
            },
            // getOss() {
            //     this.$post("/common/getOssSign", { type: "taocan" }).then(res => {
            //         this.OSS = res.data;
            //     });
            // },

            getRoleList() {                
                this.$get("/user/getRoleList").then(res => {                            
                    if (res.respCode ==200) {
                        this.selectList = res.data;
                    }else if (res.respCode ==100001) {
                        this.$router.replace("/user/login");
                    }
                });
            },

            add() {

                this.userForm = {
                    userName: "",
                    avatar: [],
                };
                this.userVisible = true;

            },


            onChangeSort(id, val) {
                this.$post(`${this.url}?id=${id}`, {sort: val}).then(res => {
                    if (res.status == 1) {
                        this.$message.success("操作成功");
                    } else {
                        this.$message.error(res.info);
                    }
                });
            },

            typeChange(e) {
                this.reload();
            },

            edit(e) {
                this.editItem = e;
                this.visible = true;
            },

            // del(e) {
            //     this.editItem = e;
            //     this.visible = true;
            // },

            saveUser(){

                this.$refs.userForm.validate(valid => {

                    console.log(this.userForm);

                    if (valid) {
                        this.btnLoading = true;
                        let param = {...this.userForm};
                        this.$post("/user/add", param).then(res => {
                            this.btnLoading = false;
                            if (res.respCode ==200) {
                                this.$message.success("添加成功");
                                this.userVisible = false;
                                this.reload();
                               // this.$router.replace("/basic/userlist");
                            } else {
                                this.$message.error(res.respMsg);
                            }
                        });
                      
                    }
                });



            },

            save(editItem) {
                this.$confirm({
                    content: "确认重置密码?",
                    okText: "确定",
                    title: "提示",
                    okType: "danger",
                    centered: true,
                    cancelText: "取消",
                    onOk: () => {
                        console.log('editItem', editItem);
                        this.$post("/user/restPwd", {
                            id: editItem.id,
                            qlevel: editItem.qlevel
                        }).then(res => {
                            if (res.respCode == 200) {
                                this.visible = false;
                                this.$message.success("修改成功");
                                this.reload();
                            } else {
                                this.$message.error(res.respMsg);
                            }
                        });
                    }
                });
            },

            reload() {
                this.key = "";
                this.getList(1);
            },

            search() {
                this.getList(1);
            },

            del(id) {
                this.$confirm({
                    content: "确认删除吗?",
                    okText: "确定",
                    title: "提示",
                    okType: "danger",
                    centered: true,
                    cancelText: "取消",
                    onOk: () => {
                        console.log('editItem-id', id);
                        this.$post("/user/del", {"id":id}).then(res => {
                            if (res.respCode ==200) {
                                this.$message.success("操作成功");
                                this.reload();
                            } else {
                                this.$message.error(res.respMsg);
                            }
                        });
                    }
                });
            },

            handleStatus(e) {
                this.$post(this.url + "?id=" + e.cat_id, {
                    status: e.status > 0 ? "0" : "1"
                }).then(res => {
                    if (res.status == 1) {
                        e.status = e.status > 0 ? "0" : "1";
                        this.$message.success("操作成功");
                    } else {
                        this.$message.error(res.info);
                        e.statusFlag = !e.statusFlag;
                    }
                });
            },

            getList(page) {
                this.loading = true;
                this.$post("/user/page", {
                    pageNum:page,
                    qlevel: this.qlevel,
                    userName: this.key,
                    pageSize:this.pageSize,//每页条数
                    type: 1
                }).then(res => {
                    this.list = res.data.data;
                    this.pagination.total = res.data.total;
                    this.pagination.current = page * 1;
                    this.pagination.pageSize = res.data.pageSize * 1;                    
                    //新的
                    this.total= res.data.total;
                    this.current=page * 1;

                    this.loading = false;
                    document.documentElement.scrollTop = 0;
                });
            },

            tableChange(e) {
                this.getList(e.current);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        padding: 10px;
        background-color: #fff;

    .image {
        height: 70px;
    }

    }
</style>
