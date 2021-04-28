<template>
  <div class="container">
    <a-modal
      :destroyOnClose="true"
      :visible="visible"
      width="500px"
      :closable="false"
      okText="保存"
      cancelText="取消"
      centered
      :confirmLoading="btnLoading"
      @ok="save"
      @cancel="visible=false"
    >
      <a-form-model ref="form" :model="form" :rules="rules">
        <a-form-model-item
          prop="name"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 8 }"
          label="名称"
        >
          <a-input v-model="form.name"></a-input>
        </a-form-model-item>
        <a-form-model-item
          prop="img"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          label="图标"
        >
          <UploadImage v-model="form.img" :OSS="OSS" />
        </a-form-model-item>
        <a-form-model-item
          prop="sort"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          label="排序"
        >
          <a-input-number v-model="form.sort"></a-input-number>
        </a-form-model-item>
        <a-form-model-item
          prop="status"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          label="状态"
        >
          <a-radio-group v-model="form.status">
            <a-radio-button :value="1">开启</a-radio-button>
            <a-radio-button :value="0">关闭</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-row type="flex" :gutter="10" justify="space-between">
      <a-col>
        <a-button type="primary" style="margin-bottom:16px" icon="plus" @click="add">新建</a-button>
      </a-col>
      <a-col>
        <a-button type="primary" icon="reload" @click="reload"></a-button>
      </a-col>
    </a-row>
    <a-table
      :dataSource="list"
      :columns="columns"
      :rowKey="record=>record.cat_id"
      :loading="loading"
      :pagination="pagination"
      @change="tableChange"
    >
      <template slot="operation" slot-scope="item">
        <a>
          <a-icon type="edit" style="font-size:20px;margin-right:20px;" @click="edit(item)"></a-icon>
        </a>
        <a>
          <a-icon type="delete" style="font-size:20px;color:#f5222d" @click="del(item.cat_id)"></a-icon>
        </a>
      </template>
      <template slot="image" slot-scope="item">
        <img :src="item.img" class="image" />
      </template>
      <template slot="sort" slot-scope="item">
        <a-input-number :min="0" v-model="item.sort" @blur="onChangeSort(item.cat_id,item.sort)" />
      </template>
      <template slot="state" slot-scope="item">
        <a-switch @change="handleStatus(item)" v-model="item.statusFlag"></a-switch>
      </template>
      <template slot="type" slot-scope="item">
        <div>{{item.gc_type==1?'普通商品':'店铺商品'}}</div>
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
      form: { name: "", sort: 1, img: [], status: 1 },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sort: [
          {
            required: true,
            message: "请输入排序权重",
            trigger: "change"
          }
        ],
        img: [{ required: true, message: "请添加图标 ", trigger: "change" }],
        status: [{ required: true }]
      },
      columns: [
        { title: "ID", dataIndex: "cat_id", align: "center" },
        { title: "名称", dataIndex: "name", align: "center" },
        {
          title: "图标",
          align: "center",
          scopedSlots: { customRender: "image" }
        },
        {
          title: "排序",
          align: "center",
          scopedSlots: { customRender: "sort" }
        },
        {
          title: "显示状态",
          align: "center",
          scopedSlots: { customRender: "state" }
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loading: false,
      visible: false,
      btnLoading: false,
      editItem: {},
      pagination: { total: 0, current: 1 },
      OSS: {},
      url: "/Tasteadmin/Article/art_class"
    };
  },

  mounted() {
    this.getList(1);
    this.getOss();
  },

  methods: {
    onChangeSort(id, val) {
      this.$post(`${this.url}?id=${id}`, { sort: val }).then(res => {
        if (res.status == 1) {
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.info);
        }
      });
    },

    getOss() {
      this.$post("/Admin/Upload/getSignedUrl", { type: "article" }).then(res => {
        if (res.status == 1) {
          res.datas.accessKeyId = res.datas.OSSAccessKeyId;
          this.OSS = res.datas;
        }
      });
    },

    edit(e) {
      this.editItem = e;
      this.form = {
        name: e.name,
        sort: e.sort,
        img: [e.img],
        status: e.status * 1
      };
      this.visible = true;
    },

    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let url = this.url;
          if (this.editItem) {
            url = `${url}?id=${this.editItem.cat_id}`;
          }
          let param = { ...this.form };
          param.img = param.img[0];
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

    del(id) {
      this.$confirm({
        content: "确认删除?",
        okText: "确定",
        title: "提示",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk: () => {
          this.$get(this.url, { del: id }).then(res => {
            if (res.status == 1) {
              this.$message.success("操作成功");
              this.reload();
            } else {
              this.$message.error(res.info);
            }
          });
        }
      });
    },

    add() {
      this.editItem = "";
      this.form = { name: "", sort: 1, img: [], status: 1 };
      this.visible = true;
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
      this.$post(this.url, { page }).then(res => {
        this.list = res.datas.map(v => {
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
