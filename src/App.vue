<template>
  <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default {
  data() {
    return {
      zhCN
    };
  },

  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      } else {
        return document.body;
      }
    }
  }
};
</script>
