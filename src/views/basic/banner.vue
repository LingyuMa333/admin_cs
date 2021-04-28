<template>
  <div class="container">
    <a-modal
      :destroyOnClose="true"
      :visible="visible"
      width="800px"
      :closable="false"
      okText="保存"
      cancelText="取消"
      centered
      :confirmLoading="btnLoading"
      @ok="save"
      @cancel="visible=false"
    >
      <a-form-model :model="form" ref="form" :rules="rules">
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          prop="title"
          label="名称"
        >
          <a-input v-model="form.title"></a-input>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          prop="title"
          label="首页"
        >
          <a-radio-group v-model="form.is_index">
            <a-radio-button :value="0">隐藏</a-radio-button>
            <a-radio-button :value="1">展示</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <!-- -------------------------------------------------------------------------------------- -->
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          v-for="(item, index) in form.list"
          :key="index"
          :label="'广告'+(index+1)"
          :required="false"
        >
          <a-row :gutter="16">
            <a-col :span="13">
              <a-input v-model="item.url" placeholder="跳转地址" />
            </a-col>
            <a-col :span="5">
              <UploadImage v-model="item.image" :OSS="OSS" />
            </a-col>
            <a-col :span="2">
              <a-icon
                v-if="form.list.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="form.list.length === 1"
                @click="() => remove(item)"
              />
            </a-col>
          </a-row>
        </a-form-model-item>
        <!-- -------------------------------------------------------------------------------------- -->
        <a-button type="dashed" style="width: 60%;margin-left: 16.667%;" @click="addOption">
          <a-icon type="plus" />增加选项
        </a-button>
      </a-form-model>
    </a-modal>
    <a-row type="flex" style="margin-bottom:10px" justify="space-between">
      <a-col>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
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
      :pagination="pagination"
      @change="tableChange"
    >
      <template slot="operation" slot-scope="item">
        <a>
          <a-icon type="edit" style="font-size:20px;margin-right:20px;" @click="edit(item)"></a-icon>
        </a>
        <a>
          <a-icon type="delete" style="font-size:20px;color:#f5222d" @click="del(item.id)"></a-icon>
        </a>
      </template>
      <template slot="image" slot-scope="item">
        <img :src="item.img" class="image" />
      </template>
    </a-table>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
import { reload } from "@/mixins";
export default {
  mixins: [reload],

  components: { UploadImage },

  data() {
    return {
      list: [],
      form: { title: "", list: [{ image: [], url: "" }], is_index: 0 },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      columns: [
        { title: "ID", dataIndex: "id", align: "center" },
        { title: "名称", dataIndex: "title", align: "center" },

        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loading: false,
      visible: false,
      btnLoading: false,
      images: [],
      editItem: "",
      pagination: { total: 0, current: 1 },
      OSS: {}
    };
  },

  mounted() {
    this.getList(1);
    this.getOss();
  },

  methods: {
    addOption() {
      this.form.list.push({
        image: [],
        url: ""
      });
    },

    remove(item) {
      let index = this.form.list.indexOf(item);
      if (index !== -1) {
        this.form.list.splice(index, 1);
      }
    },

    getOss() {
      this.$post("/admin/index/getOssSign", { type: "ad" }).then(res => {
        if (res.status == 1) {
          res.datas.accessKeyId = res.datas.OSSAccessKeyId;
          this.OSS = res.datas;
        }
      });
    },

    edit(e) {
      this.editItem = e;
      this.$post("/admin/ad/getAdInfo", { id: e.id }).then(res => {
        this.visible = true;
        this.form.title = res.datas.title;
        this.form.is_index = res.datas.is_index;
        this.form.list = res.datas.images.map((v, idx) => {
          return { image: [v], url: res.datas.urls[idx] };
        });
      });
    },

    del(id) {
      this.$confirm({
        content: "确认删除?",
        okText: "确定",
        title: "提示",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk: () => {
          this.$post("/admin/ad/adDel", { id }).then(res => {
            if (res.status == 1) {
              this.$message.success("操作成功");
              this.reload();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },

    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let url = "/admin/ad/adAdd";
          let param = {
            title: this.form.title,
            is_index: this.form.is_index,
            images: this.form.list.map(v => {
              return v.image[0];
            }),
            urls: this.form.list.map(v => {
              return v.url[0];
            })
          };
          if (this.editItem) {
            url = "/admin/ad/adEdit";
            param.id = this.editItem.id;
          }
          this.$post(url, param).then(res => {
            if (res.status == 1) {
              this.visible = false;
              this.$message.success("添加成功");
              this.reload();
            } else {
              this.$message.error(res.info);
            }
          });
        }
      });
    },

    reload() {
      this.getList(1);
    },

    add() {
      this.editItem = "";
      this.form = { title: "", list: [{ image: [], url: "" }], is_index: 0 };
      this.visible = true;
    },

    getList(page) {
      this.loading = true;
      this.$post("/admin/ad/getAdList", { page }).then(res => {
        this.list = res.datas.data.map(v => {
          v.statusFlag = v.status > 0 ? true : false;
          return v;
        });
        this.pagination.total = res.total;
        this.pagination.current = page * 1;
        this.loading = false;
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
