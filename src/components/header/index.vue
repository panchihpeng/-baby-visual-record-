<template>
  <view class="header">
    <view class="header-left">
      <view class="header-label"> 用户信息:</view>
      <view>{{ userInfo.className }}{{ userInfo.name }}</view>
    </view>
    <view class="header-right" v-if="!hiddenRoleSelect">
      <view class="header-label">角色选择 &nbsp; </view>
      <view @click="show = true" class="role-select">
        {{ roleDesc }}
        <IconFont name="rect-down" color="#666666" />
      </view>
    </view>
  </view>
  <nut-popup position="bottom" v-model:visible="show">
    <nut-picker
      v-model="popupValue"
      :columns="roleOptions"
      @confirm="popupConfirm"
      @cancel="show = false"
    />
  </nut-popup>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { IconFont } from "@nutui/icons-vue-taro";
import { useUserStore } from "@/stores/user";
import { roleOptions, EnumRole } from "@/constants";

const show = ref(false);
const roleDesc = ref("");

const userStore = useUserStore();
const { userInfo, currPageRole } = storeToRefs(userStore);
const popupValue = ref([currPageRole.value ?? EnumRole.Student]);

const { hiddenRoleSelect } = defineProps({
  hiddenRoleSelect: {
    type: Boolean,
  },
});

watch(currPageRole, (val) => {
  popupValue.value = [val || EnumRole.Student];
});

onMounted(() => {
  roleDesc.value =
    roleOptions.find((op) => op.value === popupValue.value?.[0])?.text || "";
});

const popupConfirm = ({ selectedValue }) => {
  show.value = false;
  popupValue.value = selectedValue;
  roleDesc.value =
    roleOptions.find((op) => op.value === popupValue.value?.[0])?.text || "";

  userStore.setCurrPageRole(selectedValue[0]);
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 32rpx;
  font-size: 28rpx;
}

.header-left,
.header-right {
  display: flex;
  gap: 6rpx;
  padding: 12rpx;
  border-radius: 6rpx;
}
.header-left {
  color: #fff;
  background: #ff983d;
}
.header-right {
  background: rgba(161, 161, 161, 0.35);
  color: #666;
}
.header-label {
  display: flex;
}

.role-select {
  display: flex;
}
</style>
