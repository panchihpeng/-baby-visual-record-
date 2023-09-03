<template>
  <view>

      <nut-form :disabled="isDisabled" v-if="!isHidden && isMounted">
        <nut-form-item>
          <template v-slot:label>
            <Dot>被观察活动</Dot>
          </template>
          <Select
              title="被观察活动"
              :options="categoryList"
              :disabled="isDisabled"
              placeholder="请选择"
              v-model:value="presetsInfo.category"
          />
        </nut-form-item>
        <nut-form-item>
          <template v-slot:label>
            <Dot>活动主题</Dot>
          </template>
          <nut-input
              class="nut-input-text"
              :disabled="isDisabled"
              placeholder="请输入活动主题"
              type="text"
              v-model="presetsInfo.subject"
          />
        </nut-form-item>
        <nut-form-item>
          <template v-slot:label>
            <Dot>子主题或活动名称</Dot>
          </template>
          <nut-input
              class="nut-input-text"
              v-model="presetsInfo.target"
              :disabled="isDisabled"
              placeholder="请输入活动子主题"
              type="text"
          />
        </nut-form-item>
        <nut-form-item label="互动环节与策略预设">
          <template v-slot:label>
            <Dot>互动环节与策略预设</Dot>
          </template>
          <nut-cell
              title="点击设置互动环节"
              :style="{ padding: 0 }"
              icon="rect-right"
              @click="handleJumpInteractiveSession"
          >
            <template v-slot:link>
              <RectRight />
            </template>
          </nut-cell>
        </nut-form-item>
        <nut-form-item>
          <template v-slot:label>
            <Dot>邀请观摩评价者</Dot>
          </template>
          <Select
              title="邀请观摩评价者"
              multiple
              v-model:value="selectedInvitedList"
              :options="teacherList"
              @confirm="handleInviteTeacher"
              placeholder="请选择"
          />
          <!-- :disabled="isDisabled || !isExistedPresetsInfo" -->
        </nut-form-item>
        <nut-form-item>
          <template v-slot:label>
            <Dot>活动时间</Dot>
          </template>
          <DatePicker v-model:value="presetsInfo.pTime" />
        </nut-form-item>
        <nut-cell>
          <nut-button
              size="large"
              color="linear-gradient(to right, #FF983D, #FFAC63)"
              type="info"
              :style="{ margin: 'auto' }"
              @click="handleSavePresetsInfo('')"
          >保存主题</nut-button
          >
        </nut-cell>
      </nut-form>
      <nut-empty description="无数据" v-else></nut-empty>

  </view>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/date-picker/index.vue";
import Dot from "@/components/dot/index.vue";
import { EnumRole } from "@/constants";
import Taro, { useDidShow, useDidHide, usePullDownRefresh } from "@tarojs/taro";
import { RectRight } from "@nutui/icons-vue-taro";
import dayjs from "dayjs";
import {
  getActivityCategory,
  getTeacherList,
  readPresetsInfo,
  savePersetsInfo,
  savePresetsInvite,
} from "@/services/preset";

const userStore = useUserStore();
const { userInfo, currRole, currDeviceCode } = storeToRefs(userStore);
const categoryList = ref([]);
const teacherList = ref([]);
const isExistedPresetsInfo = ref(false);
const selectedInvitedList = ref<string[]>([]);
const isMounted = ref(false);
const isLoading = ref(false);
// 邀请观摩评价者 需要分开保存
// 只有在有presetcode的时候才能邀请
// 时间加一个默认格式：00：00：00
const presetsInfo = ref({
  subject: "",
  category: "",
  pTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  target: "",
  code: "",
});

const isDisabled = computed(() => {
  return currRole.value === EnumRole.Recorder;
});

const isHidden = computed(() => {
  return currRole.value === EnumRole.Evaluator;
});

usePullDownRefresh(() => {
  getActivityCategoryListData();
  getTeacherListData();
  handleReadPresetsInfo();
});

useDidShow(() => {
  if (currRole.value === EnumRole.Student) {
    getActivityCategoryListData();
    getTeacherListData();
    handleReadPresetsInfo();
    isMounted.value = true;
    Taro.setNavigationBarTitle({
      title: `${userInfo.value.className} ${userInfo.value.name}`,
    });
  }


});

useDidHide(() => {
  isMounted.value = false;
});

const getActivityCategoryListData = () => {
  getActivityCategory().then((res: any) => {
    categoryList.value = res.data?.map((el) => ({
      text: el.name,
      value: el.value,
      parentId: el.parentId,
    }));
  });
};

const getTeacherListData = () => {
  getTeacherList({ kgCode: userInfo.value.kgCode }).then((res: any) => {
    if (res.data) {
      teacherList.value = res.data?.map((el) => ({
        text: el.name,
        value: el.code,
      }));
    }
  });
};

const handleReadPresetsInfo = () => {
  readPresetsInfo({ classCode: userInfo.value.classCode }).then((res: any) => {
    if (res.data) {
      if (res.data.code) {
        isExistedPresetsInfo.value = true;
        presetsInfo.value = res.data;
      }
    }
  });
};

const handleSavePresetsInfo = (showToastText) => {
  const { category, subject, target, pTime } = presetsInfo.value || {};
  if (!category) {
    Taro.showToast({
      title: "请填写观察活动",
      icon: "error",
    });
    return;
  }
  if (!subject) {
    Taro.showToast({
      title: "请填写活动主题",
      icon: "error",
    });
    return;
  }
  if (!target) {
    Taro.showToast({
      title: "请填写子主题",
      icon: "error",
    });
    return;
  }
  if (!pTime) {
    Taro.showToast({
      title: "请填写时间",
      icon: "error",
    });
    return;
  }

  const { classCode, code: teacherCode } = userInfo.value || {};

  savePersetsInfo({
    ...presetsInfo.value,
    ptime: pTime,
    pTime: dayjs(pTime).format("YYYY-MM-DD HH:mm:ss"),
    classCode,
    teacherCode,
  }).then((res: any) => {
    if (res.data) {
      if (!showToastText) {
        Taro.showToast({
          title: "预设主题保存成功",
          icon: "success",
        });
      }

      handleReadPresetsInfo();
    }
  });
};

const handleJumpInteractiveSession = () => {
  const { category, subject, target, pTime } = presetsInfo.value || {};
  if (!category) {
    Taro.showToast({
      title: "请填写观察活动",
      icon: "error",
    });
    return;
  }
  if (!subject) {
    Taro.showToast({
      title: "请填写活动主题",
      icon: "error",
    });
    return;
  }
  if (!target) {
    Taro.showToast({
      title: "请填写子主题",
      icon: "error",
    });
    return;
  }
  if (!pTime) {
    Taro.showToast({
      title: "请填写时间",
      icon: "error",
    });
    return;
  }

  const { classCode, code: teacherCode } = userInfo.value || {};

  savePersetsInfo({
    ...presetsInfo.value,
    ptime: pTime,
    pTime: dayjs(pTime).format("YYYY-MM-DD HH:mm:ss"),
    classCode,
    teacherCode,
  }).then((res: any) => {
    if (res.data) {
      handleReadPresetsInfo();
    }
  });

  if (presetsInfo.value.code && categoryList.value.length > 0) {
    Taro.navigateTo({
      url: `/pages/interactive-session/index?presetsCode=${presetsInfo.value.code}&category=${presetsInfo.value.category}`,
    });
  }
};

const handleInviteTeacher = (teacherCodes: string[]) => {
  const { category, subject, target, pTime } = presetsInfo.value || {};
  if (!category) {
    Taro.showToast({
      title: "请填写观察活动",
      icon: "error",
    });
    return;
  }
  if (!subject) {
    Taro.showToast({
      title: "请填写活动主题",
      icon: "error",
    });
    return;
  }
  if (!target) {
    Taro.showToast({
      title: "请填写子主题",
      icon: "error",
    });
    return;
  }
  if (!pTime) {
    Taro.showToast({
      title: "请填写时间",
      icon: "error",
    });
    return;
  }
  const { classCode, code: teacherCode } = userInfo.value || {};

  savePersetsInfo({
    ...presetsInfo.value,
    ptime: pTime,
    pTime: dayjs(pTime).format("YYYY-MM-DD HH:mm:ss"),
    classCode,
    teacherCode,
  }).then((res: any) => {
    if (res.data) {
      handleReadPresetsInfo();
    }
  });

  savePresetsInvite({
    presetsCode: presetsInfo.value.code,
    teacherCodes,
  }).then((res) => {
    if (res) {
      Taro.showToast({
        title: "邀请成功",
        icon: "success",
      });
    }
  });
};

</script>
