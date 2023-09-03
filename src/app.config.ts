export default defineAppConfig({
  pages: [
    "pages/login/index",
    "pages/preset/index",
    "pages/home/index",
    "pages/quality-feedback/index",
    "pages/evaluate-list/index",
    "pages/interactive-session/index",
    "pages/invite-comments/index",
    "pages/my-quality-feedback/index",
    "pages/observation-record/index",
    "pages/records-setting/index",
    "pages/take-notes/index",
    "pages/students-list/index",
  ],
  tabBar: {
    list: [
      {
        pagePath: "pages/preset/index",
        text: "开始",
        iconPath: "resource/record.png",
        selectedIconPath: "resource/record.png",
      },

      {
        pagePath: "pages/quality-feedback/index",
        text: "质量回馈",
        iconPath: "resource/comment.png",
        selectedIconPath: "resource/comment.png",
      },
      {
        pagePath: "pages/home/index",
        text: "我的工作",
        iconPath: "resource/my.png",
        selectedIconPath: "resource/my.png",
      },
      {
        pagePath: "pages/records-setting/index",
        text: "记录设置",
        iconPath: "resource/preset.png",
        selectedIconPath: "resource/preset.png",
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    backgroundColor: "#f7f8fa",
  },
});
