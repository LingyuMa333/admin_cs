<template>
    <div class="container">



        <a-row type="flex" :gutter="10" style="margin-bottom:10px;display: flex;flex-direction: row-reverse" justify="space-between">

            <!-- <a-col>
                <a-input-search placeholder v-model="key" enterButton @search="search"/>
            </a-col> -->
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
                    <a-icon type="edit" style="font-size:20px;margin-right:20px;" @click="edit(item)"></a-icon>
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
                    email: "",
                    avatar: [],
                },

                columns: [
                    //{title: "ID", dataIndex: "id", align: "center"},
                    {title: "标题", dataIndex: "title", align: "center"},
                    {title: "内容", dataIndex: "content", align: "center"},
                    {title: "通知时间", dataIndex: "createTime", align: "center"},
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
        },

        methods: {

            onChange(page,pageSize){

                this.getList(page);

            },

            onShowSizeChange(current, pageSize) {
                this.pageSize = pageSize;

                this.getList(current);

                console.log("pageSize="+this.pageSize)
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


            reload() {
                this.key = "";
                this.getList(1);
            },

            search() {
                this.getList(1);
            },

            getList(page) {
                this.loading = true;
                this.$post("/notice/page", {
                    pageNum:page,
                    qlevel: this.qlevel,
                    content: this.key,
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
