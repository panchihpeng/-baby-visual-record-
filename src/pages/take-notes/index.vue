<template>
  <Container hidden-header>
    <view class="recorder-wrapper">
      <view class="card-wrapper">
        <view class="gap-margin">
          <Dot>记录活动</Dot>
          <TabItem
            :tabsList="recordActivitiesList"
            :selected="selectedRecordActivity"
            @change="changeRecordActivity"
          ></TabItem>
        </view>

        <view class="gap-margin">
          <Dot>环节预设</Dot>

          <view class="interactive-wrapper">
            <InteractiveSessionSteps :interactive-list="linksList" />
          </view>
        </view>

        <view class="gap-margin">
          <Dot>活动记录开始</Dot>
          <TabItem
            :tabsList="activityStartList"
            :selected="selectedRecordStartActivity"
            @change="changeActivityStart"
          ></TabItem>
        </view>
      </view>

      <view class="card-wrapper">
        <Dot>互动记录</Dot>
        <nut-tabs v-model="state.tabValue">
          <nut-tab-pane title="教师发起">
            <view class="gap-margin">
              <Dot>互动内容</Dot>
              <TabItem
                :tabsList="teacherInteractionsList"
                :selected="selectedTeacherInteraction"
                @change="changeTeacherInteraction"
              ></TabItem>
            </view>

            <view class="gap-margin">
              <Dot>儿童情感</Dot>
              <TabItem
                :tabsList="kidsEmotionsList"
                :selected="selectedKidsEmotion"
                @change="changeKidsEmotion"
              ></TabItem>
            </view>

            <view class="gap-margin">
              <Dot>教师回应</Dot>
              <TabItem
                :tabsList="teacherResponsesList"
                :selected="selectedTeacherResponse"
                @change="changeTeacherResponse"
              ></TabItem>
            </view>
            <view class="button-wrapper">
              <nut-button
                size="large"
                color="linear-gradient(to right, #FF983D, #FFAC63)"
                type="info"
                @click="handleTeacherSubmit"
                :style="{ margin: 'auto' }"
                >提交本次记录</nut-button
              >
            </view>
          </nut-tab-pane>

          <nut-tab-pane title="儿童发起">
            <view class="gap-margin">
              <Dot>互动内容</Dot>
              <TabItem
                :tabsList="studentInteractionsList"
                :selected="selectedStudentInteraction"
                @change="changeStudentInteraction"
              ></TabItem>
            </view>

            <view class="gap-margin">
              <Dot>互动对象</Dot>
              <TabItem
                :tabsList="actionsPartnersList"
                :selected="selectedActionsPartner"
                @change="changeActionsPartner"
              ></TabItem>
            </view>

            <view class="gap-margin">
              <Dot>儿童态度</Dot>
              <TabItem
                :tabsList="emotionTendencyList"
                :selected="selectedEmotionTendency"
                @change="changeEmotionTendency"
              ></TabItem>
            </view>

            <view class="gap-margin">
              <Dot>教师情感</Dot>
              <TabItem
                :tabsList="kidsResponseList"
                :selected="selectedKidsResponse"
                @change="changeKidsResponse"
              ></TabItem>
            </view>

            <view class="button-wrapper">
              <nut-button
                size="large"
                color="linear-gradient(to right, #FF983D, #FFAC63)"
                type="info"
                @click="handleKidsSubmit"
                :style="{ margin: 'auto' }"
                >提交本次记录</nut-button
              >
            </view>
          </nut-tab-pane>
        </nut-tabs>
      </view>
    </view>
  </Container>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import TabItem from "@/components/tab-item/index.vue";
import Dot from "@/components/dot/index.vue";
import { ref, watch, reactive, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import InteractiveSessionSteps from "@/components/interactive-session-steps/index.vue";
import Container from "@/components/container/index.vue";
import {
  getPresetsDetailListByClass,
  getPresetsTopic,
  presetsActivitySave,
  getInteractionsList,
  presetsInteractionSave,
} from "@/services/record";
import { getActivityCategory, getLinkList } from "@/services/preset";
import { useUserStore } from "@/stores/user";
import {
  useDidShow,
  usePullDownRefresh,
  getCurrentInstance,
} from "@tarojs/taro";
import {
  kidsEmotionsList,
  teacherResponsesList,
  actionsPartnersList,
  emotionTendencyList,
  kidsResponseList,
} from "@/constants";

const presetsCode = ref("");

// 记录活动
const recordActivitiesList = ref([]);
const selectedRecordActivity = ref("");

// 环节预设
const linksList = ref<any>([]);

// 活动记录开始
const activityStartList = ref([]);
const selectedRecordStartActivity = ref("");

const state = reactive({
  tabValue: "0",
});

// 教师互动内容
const teacherInteractionsList = ref([]);
const selectedTeacherInteraction = ref("");

// 儿童情感
const selectedKidsEmotion = ref("");

//教师回应
const selectedTeacherResponse = ref("");

// 儿童互动内容
const studentInteractionsList = ref([]);
const selectedStudentInteraction = ref("");

// 互动对象
const selectedActionsPartner = ref("");

// 情感趋向

const selectedEmotionTendency = ref("");

// 儿童回应
const selectedKidsResponse = ref("");

const studentsCode = ref("");

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

usePullDownRefresh(() => {});

useDidShow(() => {
  const currentPages = Taro.getCurrentPages();
  const currPage = currentPages[currentPages.length - 1];

  studentsCode.value = currPage.__data__.studentsCode;
});

onMounted(() => {
  run();
});

const run = async () => {
  await handleGetPresetsDetailListByClass();
  await getActivityCategoryListData();
  await getDefaultPresetsTopic();
  await getDefaultActivityStart();
  await handleGetInteractionsList();
};

// 环节预设
const handleGetPresetsDetailListByClass = async () => {
  await getPresetsDetailListByClass(userInfo.value.classCode).then(
    (res: any) => {
      presetsCode.value = res?.data?.presetsCode;
      linksList.value = [
        {
          linkName: "开始",
        },
        ...res.data?.presetsDetailList?.map((el: any) => ({
          // linkName: el.linkName,
          linkName: el.actionName,
          duration: el.duration,
        })),
      ];
    }
  );
};

// 记录活动----->开始

// 记录活动列表
const getActivityCategoryListData = async () => {
  await getActivityCategory().then((res: any) => {
    if (res.data) {
      recordActivitiesList.value = res.data.map((el) => {
        return {
          text: el.name,
          value: el.value,
        };
      });
    }
  });
};

// 记录活动默认选择值
const getDefaultPresetsTopic = async () => {
  await getPresetsTopic(presetsCode.value).then((res: any) => {
    selectedRecordActivity.value = res.data.category;
  });
};

// 记录活动更改
const changeRecordActivity = (value) => {
  selectedRecordActivity.value = value.value;
};

// 记录活动------>结束

// 活动记录开始 ----->开始

const getDefaultActivityStart = async () => {
  await getLinkList(selectedRecordActivity.value).then((res: any) => {
    activityStartList.value = res.data.map((el) => {
      return {
        text: el.name,
        value: el.value,
      };
    });
  });
};

const changeActivityStart = (value) => {
  selectedRecordStartActivity.value = value.value;
  handlePresetsActivitySave();
};

const handlePresetsActivitySave = () => {
  const queryParams = getCurrentInstance().router?.params;

  if (queryParams?.deviceCode) {
    presetsActivitySave({
      presetsCode: presetsCode.value,
      link: selectedRecordStartActivity.value,
      teacherCode: userInfo.value.code,
      status: 1,
      devcieCode: queryParams?.deviceCode,
    }).then(() => {
      Taro.showToast({
        title: "提交成功",
        icon: "success",
      });
    });
  }
};

//  活动记录开始----->结束

//  互动记录

//  教师与儿童基础数据
const handleGetInteractionsList = () => {
  getInteractionsList("i_teacher").then((res: any) => {
    teacherInteractionsList.value = res.data.map((el) => {
      return {
        text: el.name,
        value: el.value,
      };
    });
  });
  getInteractionsList("i_student").then((res: any) => {
    studentInteractionsList.value = res.data.map((el) => {
      return {
        text: el.name,
        value: el.value,
      };
    });
  });
};

// tab-01
// 教师互动内容
const changeTeacherInteraction = (value) => {
  selectedTeacherInteraction.value = value.value;
};

// 儿童情感
const changeKidsEmotion = (value) => {
  selectedKidsEmotion.value = value.value;
};

// 教师回应
const changeTeacherResponse = (value) => {
  selectedTeacherResponse.value = value.value;
};

// tab-02
// 儿童互动内容
const changeStudentInteraction = (value) => {
  selectedStudentInteraction.value = value.value;
};
// 儿童互动对象
const changeActionsPartner = (value) => {
  selectedActionsPartner.value = value.value;
  if (value.value === 4) {
    Taro.navigateTo({
      url: "/pages/students-list/index",
    });
  }
};

// 情感趋向
const changeEmotionTendency = (value) => {
  selectedEmotionTendency.value = value.value;
};

// 儿童回应
const changeKidsResponse = (value) => {
  selectedKidsResponse.value = value.value;
};

// 提交记录
const handleTeacherSubmit = () => {
  const teacherCheckList = [
    {
      text: "教师互动",
      value: selectedTeacherInteraction.value,
    },
    {
      text: "儿童情感",
      value: selectedKidsEmotion.value,
    },
    {
      text: "教师回应",
      value: selectedTeacherResponse.value,
    },
  ];

  for (const item of teacherCheckList) {
    if (!item.value) {
      Taro.showToast({
        title: `请填写${item.text}`,
        icon: "error",
      });
      return;
    }
  }

  presetsInteractionSave({
    presetsCode: presetsCode.value,
    action: selectedTeacherInteraction.value,
    emotion: ~~selectedKidsEmotion.value,
    response: ~~selectedTeacherResponse.value,
    teacherCode: userInfo.value.code,
    role: 1,
  }).then((res) => {
    console.log(res);
    Taro.showToast({
      title: "保存成功",
      icon: "success",
    });
  });

  selectedTeacherInteraction.value = "";
  selectedKidsEmotion.value = "";
  selectedTeacherResponse.value = "";
};

const handleKidsSubmit = () => {
  const kidsCheckList = [
    {
      text: "儿童互动",
      value: selectedStudentInteraction.value,
    },
    {
      text: "互动对象",
      value: selectedActionsPartner.value,
    },
    {
      text: "情感趋向",
      value: selectedEmotionTendency.value,
    },
    {
      text: "儿童回应",
      value: selectedKidsResponse.value,
    },
  ];

  for (const item of kidsCheckList) {
    if (!item.value) {
      Taro.showToast({
        title: `请填写${item.text}`,
        icon: "error",
      });
      return;
    }
  }

  presetsInteractionSave({
    obj: selectedActionsPartner.value,
    studentCode: studentsCode.value,
    presetsCode: presetsCode.value,
    action: selectedStudentInteraction.value,
    emotion: ~~selectedEmotionTendency.value,
    response: ~~selectedKidsResponse.value,
    teacherCode: userInfo.value.code,

    role: 2,
  }).then(() => {
    Taro.showToast({
      title: "保存成功",
      icon: "success",
    });

    selectedActionsPartner.value = "";
    selectedStudentInteraction.value = "";
    selectedEmotionTendency.value = "";
    selectedKidsResponse.value = "";
  });
};

//  TODO: 1. 页面写成组件 2，提交记录写成一个函数  3，校验写成一个函数 4，tab-item 写成对象赋值
</script>

<style lang="scss">
.gap-margin {
  margin: 20rpx;
}
.nut-tab-pane {
  padding: 0;
  background-color: #c7c6d0;
}
.button-wrapper {
  width: 80%;
  margin: 40rpx auto;
}
</style>
