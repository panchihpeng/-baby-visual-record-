<template>
  <view class="tab-item-wrapper">
    <view class="tab-item">
      <span
        v-for="tab in tabsList"
        :key="tab.value"
        class="item"
        :class="{ 'is-active': tab.value === selected }"
        @click="selectTab(tab)"
      >
        {{ tab.text }}
      </span>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from "vue";
import { ITabItem } from "./types";
const props = defineProps({
  tabsList: {
    type: Array as PropType<ITabItem[]>,
    default: () => [],
  },
  selected: {
    type: String,
    default: "",
  },
});

const { tabsList, selected } = toRefs(props);

const emit = defineEmits(["change"]);

const selectTab = (value) => {
  emit("change", value);
};
</script>

<style lang="scss">
.tab-item-wrapper {
  .tab-item {
    .item {
      display: inline-block;
      padding: 10rpx 10rpx;
      background-color: #f3f3f3;
      border-radius: 10rpx;
      margin: 15rpx;
    }
    .is-active {
      background-color: #ff983d;
      color: #fff;
    }
  }
}
</style>
