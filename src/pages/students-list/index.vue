<template>
  <Container hidden-header>
    <view class="students-wrapper">
      <nut-checkbox-group v-model="checkBoxGroup" ref="group">
        <nut-checkbox
          v-for="item in studentList"
          :key="item.value"
          :label="item.value"
          >{{ item.text }}</nut-checkbox
        >
      </nut-checkbox-group>
    </view>

    <view class="button-wrapper">
      <nut-button
        size="large"
        color="linear-gradient(to right, #FF983D, #FFAC63)"
        type="info"
        @click="handleSubmit"
        :style="{ margin: 'auto' }"
        >提交</nut-button
      >
    </view>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Taro from "@tarojs/taro";
import { getStudentList } from "@/services/preset";
import { deviceSentCommand } from "@/services/record";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const checkBoxGroup = ref([]);
const studentList = ref();

const userStore = useUserStore();
const { userInfo, currDeviceCode } = storeToRefs(userStore);

onMounted(() => {
  handleGetStudentList(userInfo.value.classCode);
});

const handleGetStudentList = (classCode: string) => {
  if (classCode) {
    getStudentList(classCode).then((res: any) => {
      studentList.value = res.data?.map((el) => ({
        text: el.name,
        value: el.value,
      }));
    });
  }
};

const sentCommand = async () => {
  for (const item in checkBoxGroup.value) {
    await deviceSentCommand({
      code: currDeviceCode.value,
      command: checkBoxGroup.value[item],
    });
  }
};

const handleSubmit = async () => {
  await sentCommand();
  await Taro.navigateBack({
    delta: 1,
  });
};
</script>

<style lang="scss">
.students-wrapper {
  .nut-checkbox-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .nut-checkbox__label {
      margin-left: 10rpx;
    }
    .nut-checkbox {
      width: 25%;
      margin: 20rpx;
    }
  }
}
</style>
