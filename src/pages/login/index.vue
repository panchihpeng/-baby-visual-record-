<template>
  <view class="index">
    <view class="logo-icon-wrapper">
      <image class="logo-icon" src="../../resource/big-logo.png"> </image>
    </view>
    <nut-form ref="formRef" :model-value="userInfo" class="user-info">
      <nut-form-item  style="display: flex; align-items: center">
<!--        <view @click="show = true" class="role-select-wrapper">-->
<!--          <view class="role-select">-->
<!--            <view style="margin-right: 10rpx"> {{ roleDesc }}</view>-->
<!--            <view>-->
<!--              <IconFont name="rect-down" color="#666666" />-->
<!--            </view>-->
<!--          </view>-->
<!--        </view>-->
        <template v-slot:label style="">
          <text>角色选择</text>
        </template>
        <TabItem
            class="tab-item"
            :tabsList="roleOptions"
            :selected="selectedRole"
            @change="changeSelectedRole"
        ></TabItem>

      </nut-form-item>

      <nut-form-item
        label="用户名"
        prop="username"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <nut-input
          v-model="userInfo.username"
          class="nut-input-text"
          placeholder="请输入账号"
          type="text"
        />
      </nut-form-item>

      <nut-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '请输入登录密码' }]"
      >
        <nut-input
          placeholder="请输入登录密码"
          v-model="userInfo.password"
          type="password"
        />
      </nut-form-item>

    </nut-form>




    <view class="button-wrapper">
      <nut-button
        size="large"
        color="linear-gradient(to right, #FF983D, #FFAC63)"
        type="info"
        @click="handleLogin"
        :style="{ margin: 'auto' }"
        >登录</nut-button
      >
    </view>
  </view>

<!--  <nut-popup position="bottom" v-model:visible="show">-->
<!--    <nut-picker-->
<!--      v-model="popupValue"-->
<!--      :columns="roleOptions"-->
<!--      @confirm="popupConfirm"-->
<!--      @cancel="show = false"-->
<!--    />-->
<!--  </nut-popup>-->
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import Taro from "@tarojs/taro";
import { IconFont } from "@nutui/icons-vue-taro";
import { reactive, onMounted, ref, watch } from "vue";
import { getAuthToken, login } from "@/services/login";
import { useUserStore } from "@/stores/user";
import { roleOptions, EnumRole } from "@/constants";
import TabItem from "@/components/tab-item/index.vue";


const show = ref(false);
const roleDesc = ref("");
const selectedRole = ref(EnumRole.Student);

const clientId = "wx_1";
const password = "12345678";

const formRef = ref<any>(null);
const userInfo = reactive({
  // username: "18757570701",
  // password: "666666",
  username: "",
  password: "",
});

const userStore = useUserStore();

const { setUserInfo } = userStore;
const { currRole } = storeToRefs(userStore);
// const popupValue = ref([currRole.value ?? EnumRole.Student]);
//
// watch(currRole, (val) => {
//   popupValue.value = [val || EnumRole.Student];
// });

onMounted(() => {
  // getRoleDesc();
  const userInfoStorage = Taro.getStorageSync("userInfo");
  userInfo.username = userInfoStorage?.username;
  userInfo.password = userInfoStorage?.password;

  getAuthTokenWrapper();
});


const changeSelectedRole = (value) => {
  selectedRole.value = value.value;
  userStore.setCurrRole(value.value)
};

const handleLogin = () => {

  const roleValue = selectedRole.value;

  formRef.value?.validate?.().then(({ valid }) => {
    if (valid) {
      login(userInfo).then((res: any) => {
        setUserInfo(res.data);
        Taro.setStorageSync("userInfo",userInfo);
        Taro.switchTab({
          url: "/pages/preset/index",
        });
        if (roleValue === EnumRole.Student) {
          Taro.setTabBarItem({
            index: 0,
            text: "活动预设",
          });
          Taro.setTabBarItem({
            index: 3,
            text: "退出",
          });
        } else if (roleValue === EnumRole.Recorder) {
          Taro.setTabBarItem({
            index: 0,
            text: "开始工作",
          });
          Taro.setTabBarItem({
            index: 3,
            text: "记录设置",
          });
        } else if (roleValue === EnumRole.Evaluator) {
          Taro.setTabBarItem({
            index: 0,
            text: "开始评价",
          });
          Taro.setTabBarItem({
            index: 3,
            text: "退出",
          });
        }
      });
    }
  });
};

const getAuthTokenWrapper = () => {
  getAuthToken({
    clientId,
    password,
  }).then((res: any) => {
    Taro.setStorageSync("accessToken", res.data.access_token);
  });
};


// const getRoleDesc = () => {
//   roleDesc.value =
//     roleOptions.find((op) => op.value === popupValue.value?.[0])?.text || "";
// };
//
//
// const popupConfirm = ({ selectedValue }) => {
//   show.value = false;
//   popupValue.value = selectedValue;
//   roleDesc.value =
//     roleOptions.find((op) => op.value === popupValue.value?.[0])?.text || "";
//
//   userStore.setCurrRole(selectedValue[0]);
// };
</script>

<style lang="scss">
.index {
  text-align: center;
  padding: 20rpx;
  padding-top: 50rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fff7ed 100%);
  min-height: 100vh;
  .logo-icon-wrapper {
    margin: 80rpx auto 60rpx;
    .logo-icon {
      width: 328rpx;
      height: 236rpx;
    }
  }
}

.user-info {
  margin: 40rpx auto 80rpx;
}

.role-select-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-right: 20rpx;
}
.button-wrapper {
  margin: 160rpx auto 40rpx;
}
</style>
