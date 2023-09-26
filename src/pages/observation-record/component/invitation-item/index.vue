<template>
  <view class="invitaion-item__wrapper">
    <view class="invitaion-item__container">
      <!-- @click.stop="handleNavigateToComments" -->
      <view class="invitaion-item__left">
        <view class="invitaion-item__left--class-name">{{
          item.className
        }}</view>
        <view class="invitaion-item__left--teacher-name"
          >{{ item.teacherName }}邀请</view
        >
        <view class="invitaion-item__left--teacher-name">{{
          dayjs(item.createTime).format("MM-DD HH:mm")
        }}</view>
      </view>

      <view class="invitaion-item__right">
        <span
          v-if="item.status === InviteReadStatusEnum.READ"
          style="color: #ff983d"
          @click="handleNavigateToComments"
        >
          进行
        </span>
        <view v-else style="display: flex; align-items: center">
          <span
            style="color: #5ea734; margin-right: 50rpx"
            class="join-btn"
            @click="handleUpdateInviteStatus(InviteStatusEnum.ON_GOING)"
          >
            参加
          </span>
          <span
            style="color: #c11c16"
            @click="handleUpdateInviteStatus(InviteStatusEnum.REJECTED)"
            >拒绝</span
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { updateInviteStatus } from "@/services/record";
import Taro from "@tarojs/taro";
import { PropType } from "vue";
import { InviteStatusEnum } from "../../type";
import { IInvitationItem, InviteReadStatusEnum } from "./type";
import dayjs from "dayjs";
const props = defineProps({
  item: {
    type: Object as PropType<Partial<IInvitationItem>>,
    required: true,
  },
  refreshInviteList: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
});

const handleNavigateToComments = () => {
  Taro.navigateTo({
    url: `/pages/invite-comments/index?presetsCode=${props.item.presetsCode}&inviteId=${props.item.id}`,
  });
};

const handleUpdateInviteStatus = async (inviteStatus) => {
  await updateInviteStatus({
    inviteId: props.item.id!,
    status: inviteStatus,
  });
  if (inviteStatus === 3) {
    return;
  }
  handleNavigateToComments();

  props.refreshInviteList();
};
</script>

<style lang="scss">
.invitaion-item {
  &__wrapper {
    padding: 24rpx 12rpx;
    border-radius: 12rpx;
    background-color: #fff;
    font-size: 28rpx;
    margin-bottom: 16rpx;
    border: 2rpx solid #ff983d;
  }

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nut-button {
      padding: 16rpx;
      min-width: 120rpx;
      font-size: 24rpx;
    }
  }

  &__left {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    &--class-name {
      color: #333333;
      font-weight: bold;
    }

    &--teacher-name {
      color: #666666;
      padding-left: 16rpx;
    }
  }

  &__right {
    display: flex;
    justify-content: center;
    align-items: center;

    .nut-button.join-btn {
      margin-right: 24rpx;
    }
  }
}
</style>
