<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-modal
      :visible="visible"
      :destroyOnClose="true"
      width="500px"
      centered
      :confirmLoading="btnLoading"
      @ok="save"
      @cancel="visible=false"
      title="修改密码"
    >
      <a-form :form="form">
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="原密码">
          <a-input
            type="password"
            v-decorator="[
          'oldPwd',
          {rules: [{ required: true, message: '请填写原密码!' }]}
        ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          extra="请输入6-20位新密码"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          label="新密码"
        >
          <a-input
            type="password"
            v-decorator="[
          'newPwd',
          {rules: [{ required: true,min:6,max:20, message: '请填写新密码!' }]}
        ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          extra="再次输入密码"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          label="确认新密码"
        >
          <a-input
            type="password"
            v-decorator="[
          'new_passwd2',
          {rules: [{ required: true,min:6,max:20, message: '请确认新密码!' }]}
        ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- ---------------------------------------------------------------------------------- -->
    <a-layout-sider class="sider" collapsible v-model="collapsed">
      <div class="logowrap">
        <div class="logo"></div>
        <!-- <img class="logo" src="../assets/logo.png" alt /> -->
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        v-model="selected"
        :openKeys="openKeys"
        @openChange="onOpenChange"
        @click="goto"
      >
        <template v-for="(item,idx) in menu">
          <a-menu-item v-if="!item.child" :key="idx">
            <a-icon :type="item.icon" />
            <span>{{item.text}}</span>
          </a-menu-item>
          <a-sub-menu v-else :key="idx">
            <span slot="title">
              <a-icon :type="item.icon" />
              <span>{{item.text}}</span>
            </span>
            <a-menu-item v-for="(sitem,sidx) in item.child" :key="idx+'-'+sidx">{{sitem.text}}</a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout :class="{main:true,padding:collapsed}">
      <div :class="{head:true,width:collapsed}">
        <div style="flex: 1"></div>
        <!-- <div class="item">上次登录时间：{{data.last_time}}</div> -->
        <!-- <div class="item">上次登录IP：{{data.last_ip}}</div> -->
        <a-dropdown class="item">
          <a>
            <a-icon type="user" />
            {{data.userName||'管理员'}}
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
             <a-menu-item key="1" @click="change">修改密码</a-menu-item>
            <a-menu-item key="0" @click="logout">退出</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="body">
        <a-config-provider :getPopupContainer="getPopupContainer">
          <router-view />
        </a-config-provider>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
const moment = require("moment");
export default {
  data() {
    return {
      collapsed: false,
      data: {},
      menu: [
        { text: "用户", path: "/basic/userlist", icon: "user" },
        { text: "通知", path: "/basic/noticeList", icon: "picture" },
        { text: "课程", path: "/basic/courseList", icon: "profile" },
        { text: "课程设置", path: "/basic/courseOperaList", icon: "profile" },

        // {
        //   text: "个人中心",
        //   path: "/basic/home",
        //   icon: "profile"
        // },

        // { text: "广告", path: "/basic/banner", icon: "picture" },

      ],
      rootSubmenuKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      openKeys: [],
      visible: false,
      btnLoading: false,
      form: this.$form.createForm(this),
      selected: []
    };
  },

  created() {
    this.initSelected();
  },

  mounted() {
     this.getInfo();
  },

  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      } else {
        return document.body;
      }
    },

    initSelected() {
      let path = this.$route.path;
      for (let i = 0, l = this.menu.length; i < l; i++) {
        if (this.menu[i].path) {
          console.log(this.menu[i].path);
          if (this.menu[i].path == path) {
            this.selected = [i];
            break;
          }
        } else {
          for (let j = 0, k = this.menu[i].child.length; j < k; j++) {
            if (this.menu[i].child[j].path == path) {
              this.openKeys = [i];
              this.selected = [`${i}-${j}`];
              break;
            }
          }
        }
      }
    },

    save() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPwd !== values.new_passwd2) {
            this.$message.error("两次输入的密码不一致");
            this.form.setFieldsValue({
              new_passwd2: ""
            });
            return;
          }
          this.btnLoading = true;
          this.$post("/user/upPwd", values).then(res => {
            this.btnLoading = false;
            if (res.respCode ==200) {
              this.$message.success("修改成功");
              //localStorage.clear();
              this.$router.replace("/user/login");
            } else {
              this.$message.error(res.respMsg);
            }
          });
        }
      });
    },

    change() {
      this.visible = true;
    },

    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },

    getInfo() {
      this.$get("/user/getInfo").then(res => {
            if (res.respCode ==200) {
              this.data = res.data;
              return
            }
            this.$router.replace("/user/login");
      });
    },

    logout() {
      this.$confirm({
        title: "确定退出?",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.$post("/login/exit", {}).then(res => {
            if (res.respCode ==200) {
              localStorage.setItem("tk", "");
              this.$router.replace("/user/login");
            } else {
              this.$message.error(res.msg);
            }
          });

        }
      });
    },

    goto(e) {
      let path =
        e.keyPath.length == 1
          ? this.menu[e.keyPath[0]].path
          : this.menu[e.keyPath[0][0]].child[e.keyPath[0][2]].path;
      if (this.$route.path == path) {
        console.log("already");
      } else {
        this.$router.replace(path);
      }
    },
    moment
  }
};
</script>

<style lang="scss" scoped>
.sider {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
}
.main {
  padding-left: 200px;
  transition: all 0.2s;
}
.padding {
  padding-left: 80px;
}
.logowrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  vertical-align: middle;
  overflow: hidden;
  background-color: #041527;

  .logo {
    width: 100%;
    height: 100%;

    background: url(../assets/home_bg.png) no-repeat center left/cover;
  }
  .camera {
    padding: 0 20px;
    font-size: 40px;
  }
  .text {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
}
.head {
  position: fixed;
  z-index: 2;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 64px;
  width: calc(100% - 200px);
  padding: 0;
  transition: all 0.2s;
  background: #fff;
  box-shadow: 0 0px 3px 0 rgba(0, 0, 0, 0.2);
  .item {
    padding: 0 12px;
  }
}

.width {
  width: calc(100% - 80px);
}
.body {
  padding-top: 64px;
  margin: 10px;
}
</style>
