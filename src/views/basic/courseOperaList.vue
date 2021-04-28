<template>
    <div class="container">

        <!--添加课程-->

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
            <a-form-model ref="userForm" :model="userForm" :rules="userRules">
                <a-form-model-item
                        prop="courseName"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="课程名"
                >
                    <a-input v-model="userForm.courseName"></a-input>
                </a-form-model-item>


                <a-form-model-item
                        prop="semester"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="学期"
                >
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item :key="key" v-for="(item,key) in selectList"> {{item.name }}</a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px"> {{selectName}}
                            <a-icon type="down"/>
                        </a-button>
                    </a-dropdown>
                </a-form-model-item>
                <a-form-model-item
                        prop="courseTime"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="课时"
                >
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuTimeClick">
                            <a-menu-item :key="key" v-for="(item,key) in selectTimeList"> {{item }}</a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px"> {{selectTimeName}}
                            <a-icon type="down"/>
                        </a-button>
                    </a-dropdown>
                </a-form-model-item>

                <a-form-model-item
                        prop="isHai"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="是否海外"
                >
                    <a-switch :checked="userForm.isHai" @change="onChangeHai"/>

                </a-form-model-item>

                <a-form-model-item
                        prop="visa"
                        :label-col="{ span:4 }"
                        :wrapper-col="{ span: 18 }"
                        label="签证"
                        v-show="userForm.isHai"
                >
                    <a-input v-model="userForm.visa"></a-input>
                </a-form-model-item>


            </a-form-model>
        </a-modal>

        <a-row type="flex" :gutter="10" style="margin-bottom:10px;display: flex;flex-direction: row-reverse"
               justify="space-between">

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


            <a-table
                    slot="expandedRowRender"
                    slot-scope="item"
                    :columns="innerColumns"
                    :data-source="item.data"
                    :pagination="false"
            >

                <template slot="isHai" slot-scope="innerItem">

                    <div v-show="innerItem.isHai">是</div>
                    <div v-show="!innerItem.isHai">否</div>
                </template>

                <template slot="operation" slot-scope="innerItem">
                    <a>
                        <a-icon type="edit" style="font-size:20px;margin-right:20px;"
                                @click="edit(item.key,innerItem)"></a-icon>
                    </a>

                </template>

            </a-table>


            <template slot="operation" slot-scope="item">

                <a>
                    <a-icon type="plus" style="font-size:20px;margin-right:40px;" @click="add(item.key)"></a-icon>
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
        components: {UploadImage},


        data() {
            return {
                list: [],
                stations: [],
                form: {mobile: "", gas_id: ""},

                userForm: {
                    courseName: "",
                    semester: "",
                    courseTime: "",
                    isHai: false,
                    visa: "",

                },
                userRules: {

                    courseName: [{required: true, message: "请输入课程名"}],
                    semester: [{required: true, message: "请选择学期"}],
                    courseTime: [{required: true, message: "请选择课时"}],
                    visa: [{required: true, message: "请填写签证"}],

                },
                selectName: "请选择",
                selectList: [{name: "一学期"}, {name: "二学期"}, {name: "三学期"}, {name: "四学期"}],

                selectTimeList: ["0.5", "1", "1.5", "2", "2.5", "3"],

                selectTimeName: "请选择",

                columns: [
                    {title: "老师", dataIndex: "name", align: "center"},
                    {title: "操作时间", dataIndex: "createdAt", align: "center"},
                    {
                        title: "操作",
                        align: "center",
                        scopedSlots: {customRender: "operation"}
                    }
                ],
                loading: false,
                btnLoading: false,
                userVisible: false,
                userBtnLoading: false,
                //分页
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                current: 1,
                pageSize: 10,//默认每页10条数据
                total: 50,

                //子table的列表

                innerColumns: [

                    {title: "课程", dataIndex: "courseName", align: "center"},
                    {title: "学期", dataIndex: "semester", align: "center"},
                    {title: "课时", dataIndex: "courseTime", align: "center"},

                    {title: "是否海外",
                        align: "center",
                        scopedSlots: { customRender: "isHai" }

                    },
                    {
                        title: "操作",
                        align: "center",
                        scopedSlots: {customRender: "operation"}
                    }

                ],

                //选择添加的索引
                addPosition: 0,
                optType: 0,//0添加  1编辑
                choseItem: {},

            };
        },

        mounted() {
            this.getList(1);

        },

        methods: {

            onChangeHai(checked) {
                this.userForm.isHai = checked

            },


            handleMenuTimeClick(e) {
                //课时的选择

                this.selectTimeName = this.selectTimeList[e.key];
                this.userForm.courseTime = this.selectTimeList[e.key];

            },


            handleMenuClick(e) {
                console.log('click', e);
                console.log('key', e.key);
                this.selectName = this.selectList[e.key].name;
                this.userForm.semester = this.selectList[e.key].name;
            },
            onChange(page, pageSize) {

                this.getList(page);

            },

            onShowSizeChange(current, pageSize) {
                this.pageSize = pageSize;

                this.getList(current);

                console.log("pageSize=" + this.pageSize)
            },


            add(key) {//key从0开始


                this.optType = 0;

                this.addPosition = parseInt(key);

                //添加

                this.userVisible = true


            },

            edit(key, item) {
                //编辑
                this.optType = 1;

                this.addPosition = parseInt(key);
                this.choseItem = item;

                this.userForm.visa = item.visa;
                this.userForm.isHai = item.isHai;
                this.userForm.courseTime = item.courseTime;
                this.userForm.courseName = item.courseName;
                this.userForm.semester = item.semester;


                this.selectName = item.semester;

                this.selectTimeName = item.courseTime;

                this.userVisible = true


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


            saveUser() {
                this.userBtnLoading = true;

                this.$refs.userForm.validate(valid => {

                    console.log(this.userForm);

                    this.$message.success("添加成功");

                    if (this.optType == 0) {

                        //添加数据
                        let bean = {
                            courseName: this.userForm.courseName, courseTime: this.userForm.courseTime,
                            semester: this.userForm.semester, isHai: this.userForm.isHai, visa: this.userForm.visa
                        };

                        this.list[this.addPosition].data.push(bean);
                    } else {
                        //编辑数据

                        for (let index in this.list[this.addPosition].data) {
                            if (this.list[this.addPosition].data[index] == this.choseItem) {

                                this.list[this.addPosition].data[index].courseName = this.userForm.courseName;
                                this.list[this.addPosition].data[index].courseTime = this.userForm.courseTime;
                                this.list[this.addPosition].data[index].semester = this.userForm.semester;
                                this.list[this.addPosition].data[index].isHai = this.userForm.isHai;
                                this.list[this.addPosition].data[index].visa = this.userForm.visa;

                            }
                        }


                    }


                    this.userBtnLoading = false;
                    this.userVisible = false;


                    // if (valid) {
                    //     let param = {...this.userForm};
                    //     this.$post("/user/add", param).then(res => {
                    //         if (res.respCode == 200) {
                    //             this.$message.success("添加成功");
                    //             this.reload();
                    //         } else {
                    //             this.$message.error(res.respMsg);
                    //         }
                    //     });
                    //
                    // }
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
                        this.$post("/user/del", {"id": id}).then(res => {
                            if (res.respCode == 200) {
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
                //     this.$post("/user/page", {
                //         pageNum:page,
                //         qlevel: this.qlevel,
                //         userName: this.key,
                //         pageSize:this.pageSize,//每页条数
                //         type: 1
                //     }).then(res => {
                //         this.list = res.data.data;
                //
                //         //新的
                //         this.total= res.data.total;
                //         this.current=page * 1;
                //         document.documentElement.scrollTop = 0;
                //     });


                //设置测试数据
                let data = [];

                data.push({courseName: "数学", courseTime: 1, semester: "学期一", isHai: false, visa: ""});
                data.push({courseName: "语文", courseTime: 2, semester: "学期二", isHai: false, visa: ""});
                data.push({courseName: "英语", courseTime: 3, semester: "学期三", isHai: false, visa: ""});
                for (let i = 0; i < 6; i++) {

                    this.list.push({key: i, name: '老师一' + i, createdAt: '2014-12-24 23:12:00', data: []});
                    this.list[i].data = data;

                }


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
