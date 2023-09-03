<template>
  <view class="dot-wrapper">
    <icon class="dot"></icon>
    <view>
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.dot-wrapper {
  display: flex;
  align-items: center;
  .dot {
    display: inline-block;
    width: 16rpx;
    height: 16rpx;
    background: #ff983d;
    border-radius: 100%;
    margin-right: 10rpx;
  }
}
</style>
../tab-item/types../tab-item/types
