<template>
  <div class="clearfix">
    <a-upload
      listType="picture-card"
      accept=".jpg, .jpeg, .png"
      @preview="handlePreview"
      @change="handleChange"
      :fileList="fileList"
      :multiple="multiple"
      :customRequest="upload"
    >
      <div v-if="multiple||(fileList.length<1&&!multiple)">
        <a-icon type="plus" />
        <div class="ant-upload-text">添加</div>
      </div>
    </a-upload>
    <a-button
      icon="drag"
      v-if="this.sort&&fileList.length>1"
      type="primary"
      style="width:104px"
      @click="sortVisible=true"
    >排序</a-button>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img class="image" alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-modal
      :visible="sortVisible"
      title="拖动图片排序"
      :centered="true"
      :footer="null"
      @cancel="sortVisible=false"
    >
      <draggable
        v-model="fileList"
        group="people"
        @start="drag=true"
        @end="drag=false"
        class="dragwrap"
      >
        <div v-for="(item,idx) in fileList" :key="idx" class="item">
          <img class="image" v-if="item.status=='done'" :src="item.response" alt />
        </div>
      </draggable>
    </a-modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    data: { type: Array },
    multiple: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: false
    },
    OSS: {
      type: Object,
      required: true
    }
  },

  components: {
    draggable
  },

  model: {
    prop: "data",
    event: "update"
  },

  data() {
    return {
      previewVisible: false,
      sortVisible: false,
      previewImage: "",
      fileList: []
    };
  },

  watch: {
    fileList: {
      handler: function() {
        this.$emit("update", this.update());
      },
      deep: true
    }
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.OSS.k = JSON.parse(JSON.stringify(this.OSS.key));
      this.fileList = this.data.map((val, idx) => {
        return {
          uid: "-" + idx,
          status: "done",
          name: "default" + idx,
          response: val,
          url: val
        };
      });
    },

    update() {
      let arr = this.fileList.map(v => {
        if (v.status == "done") {
          return v.response;
        }
      });
      return arr || [];
    },

    upload(e) {
      let file = e.file;
      let param = new FormData();
      for (let key in this.OSS) {
        param.append(key, this.OSS[key]);
      }
      let random = new Date().getTime().toString(36);
      let name =
        this.OSS.k +
        random +
        file.name.substring(file.name.lastIndexOf("."), file.name.length);
      param.set("key", name);
      param.append("file", file);
      this.$upload(this.OSS.host, param).then(res => {
        e.onSuccess(name);
      });
    },

    handleCancel() {
      this.previewVisible = false;
    },

    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },

    handleChange({ fileList }) {
      this.fileList = fileList;
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.dragwrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    border: 1px solid #eee;
    margin: 3px;
    border-radius: 10px;
  }
  .image {
    width: 70px;
    height: auto;
  }
}
</style>
