<template>
  <Container hidden-role-select v-if="currRole === EnumRole.Student">
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
  </Container>

  <Container hidden-header v-if="currRole === EnumRole.Recorder">
    <view v-if="!currDeviceCode">
      <view class="recorder-wrapper">
        <view class="location-icon-wrapper">
          <image
            src="../../resource/location.png"
            class="location-icon"
          ></image>
        </view>
        <Dot>请选择记录场所</Dot>
        <view
          style="
            width: 90%;
            margin: 30rpx auto 30rpx auto;
            padding: 10rpx 5rpx;
            background-color: #f7f7f7;
          "
        >
          <Select
            title="请选择记录场所"
            :options="locationsList"
            placeholder="请选择场所"
            v-model:value="locationInfo.deviceCode"
          />
        </view>
        <Dot>选择录像模式</Dot>
        <TabItem
            class="tab-item"
            :tabsList="recodsList"
            :selected="selectedRecord"
            @change="changeSelectedRecord"
        ></TabItem>
        <view style="height: 20rpx"></view>
        <Dot>摄像头开关</Dot>
        <TabItem
            class="tab-item"
            :tabsList="[{
              text: '开启摄像头',
              value: 'cameraOn'
            }, {
              text: '关闭摄像头',
              value: 'cameraOff'
            }]"
            :selected="selectedCamera"
            @change="changeSelectedCamera"
        ></TabItem>
      </view>



      <view class="button-wrapper">
        <nut-button
          :loading="isLoading"
          size="large"
          color="linear-gradient(to right, #FF983D, #FFAC63)"
          type="info"
          @click="handleDeviceLogin"
          :style="{ margin: 'auto' }"
          >设备登录</nut-button
        >
      </view>


<!--      <view class="button-wrapper" style="margin-top: 60rpx">-->
<!--        <nut-button-->
<!--          size="large"-->
<!--          type="info"-->
<!--          @click="handleLogOut"-->
<!--          :style="{ margin: 'auto' }"-->
<!--          >退出登录</nut-button-->
<!--        >-->
<!--      </view>-->

    </view>
    <view v-else-if="currDeviceCode">
      <view>
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
            <view>
              <TabItem
                :tabsList="activityStartList"
                :selected="selectedRecordStartActivity"
                @change="changeActivityStart"
              ></TabItem>
              <span
                class="item"
                :class="{ 'is-active': selectKidsName }"
                @click="goToStudentsList"
              >
                儿童名单
              </span>
            </view>
          </view>
        </view>

        <view class="card-wrapper">
          <Dot>互动记录</Dot>
          <nut-tabs v-model="state.tabValue">
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
                  @click="handleKidsSubmit"
                  :style="{ margin: 'auto' }"
                  >提交本次记录</nut-button
                >
              </view>
            </nut-tab-pane>

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
                <Dot>互动对象</Dot>
                <view style="display: flex">
                  <TabItem
                    :tabsList="actionsPartnersList"
                    :selected="selectedActionsPartner"
                    @change="changeActionsPartner"
                  ></TabItem>
                </view>
              </view>

              <view class="gap-margin">
                <Dot>情感趋向</Dot>
                <TabItem
                  :tabsList="emotionTendencyList"
                  :selected="selectedEmotionTendency"
                  @change="changeEmotionTendency"
                ></TabItem>
              </view>

              <view class="gap-margin">
                <Dot>儿童反馈</Dot>
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
                  @click="handleTeacherSubmit"
                  :style="{ margin: 'auto' }"
                  >提交本次记录</nut-button
                >
              </view>
            </nut-tab-pane>
          </nut-tabs>
        </view>
      </view>
    </view>
  </Container>

  <Container hidden-header v-if="currRole === EnumRole.Evaluator">
    <view v-if="invitedList.length > 0">
      <view v-for="item in invitedList">
        <InvitationItem
          :key="item.id"
          :item="item"
          :refresh-invite-list="handleGetPresetsInviteList"
        />
      </view>
    </view>
  </Container>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/date-picker/index.vue";
import Container from "@/components/container/index.vue";
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

  if (currRole.value === EnumRole.Recorder && !currDeviceCode.value) {
    handleGetLocationsList();
    handleGetRecordInfosList();
  }
  if (currRole.value === EnumRole.Recorder && currDeviceCode.value) {
    // const currentPages = Taro.getCurrentPages();
    // const currPage = currentPages[currentPages.length - 1];
    // studentsCode.value = currPage.__data__.studentsCode;
    Taro.setNavigationBarTitle({
      title: `${userInfo.value.className} ${userInfo.value.name}`,
    });
  }

  if (currRole.value === EnumRole.Evaluator) {
    Taro.setNavigationBarTitle({
      title: `${userInfo.value.className} ${userInfo.value.name}`,
    });
    handleGetPresetsInviteList();
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
// 记录者
// import { getLocationsList, bindLoginDevice } from "@/services/record";

const locationsList = ref([]);
const locationInfo = reactive({
  deviceCode: "",
});

const recodsList= ref([])
const selectedRecord = ref("DA");

const selectedCamera = ref("cameraOn");


const handleGetLocationsList = () => {
  getLocationsList(userInfo.value.kgCode).then((res: any) => {
    if (res.data) {
      locationsList.value = res.data?.map((el) => ({
        text: el.remark,
        value: el.code,
      }));
    }
  });
};

const handleGetRecordInfosList = () => {
  getRecordInfosList().then((res: any) => {
    if (res.data) {
      recodsList.value = res.data?.map((el) => ({
        text: el.name,
        value: el.value,
      }));
    }
  });
};

const changeSelectedRecord = (value) => {

  selectedRecord.value = value.value;

};

const  changeSelectedCamera= (value)=>{
  selectedCamera.value = value.value;
  // === "cameraOn" ? "cameraOff" : "cameraOn";

}
const handleDeviceLogin = () => {
  if (!locationInfo.deviceCode) {
    Taro.showToast({
      title: "请选择记录场所",
      icon: "error",
    });
    return;
  }
  isLoading.value = true;
  if (locationInfo.deviceCode) {
    bindLoginDevice({
      teacherCode: userInfo.value.code,
      deviceCode: locationInfo.deviceCode,
    })
      .then(() => {
        isLoading.value = false;
        userStore.setCurrDeviceCode(locationInfo.deviceCode);
        run();
        // Taro.navigateTo({
        //   url: `/pages/take-notes/index?deviceCode=${locationInfo.deviceCode}`,
        // });
      })
      .catch((e) => {
        isLoading.value = false;
        console.log(e);
      });
  }
};

const handleLogOut = () => {
  userStore.setCurrDeviceCode("");
  Taro.removeStorageSync("accessToken");
  Taro.navigateTo({
    url: "/pages/login/index",
  });
};

// 评价者
import {
  getPresetsInviteList,
  getLocationsList,
  bindLoginDevice,
  deviceSentCommand, getRecordInfosList,
} from "@/services/record";

import { IInvitationItem } from "../observation-record/component/invitation-item/type";
import InvitationItem from "../observation-record/component/invitation-item/index.vue";
const invitedList = ref<IInvitationItem[]>([]);

const handleGetPresetsInviteList = () => {
  getPresetsInviteList({
    teacherCode: userInfo.value.code,
    limit: 1000,
    offset: 0,
  }).then((res: any) => {
    if (res.data) {
      invitedList.value = res.data?.rows || [];
    }
  });
};

import TabItem from "@/components/tab-item/index.vue";

import InteractiveSessionSteps from "@/components/interactive-session-steps/index.vue";

import {
  getPresetsDetailListByClass,
  getPresetsTopic,
  presetsActivitySave,
  getInteractionsList,
  presetsInteractionSave,
} from "@/services/record";
import { getLinkList } from "@/services/preset";

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
const selectedTeacherInteraction = ref("1");

// 儿童情感
const selectedKidsEmotion = ref("1");

//教师回应
const selectedTeacherResponse = ref("1");

// 儿童互动内容
const studentInteractionsList = ref([]);
const selectedStudentInteraction = ref("1");

// 互动对象
const selectedActionsPartner = ref("1");

// 情感趋向
const selectedEmotionTendency = ref("1");

// 儿童回应
const selectedKidsResponse = ref("1");
// 儿童名单
// const studentsCode = ref("");
//点击名单
const selectKidsName = ref(false);

const goToStudentsList = () => {
  selectKidsName.value = true;
  Taro.navigateTo({
    url: `/pages/students-list/index?deviceCode=${currDeviceCode.value}`,
  });
};
const run = async () => {

  await deviceSentRecordCommand()
  await deviceSentCameraCommand()

  await handleGetPresetsDetailListByClass();
  await _getActivityCategoryListData();
  await getDefaultPresetsTopic();
  await getDefaultActivityStart();
  await handleGetInteractionsList();


};
// 录像模式
const deviceSentRecordCommand = async ()=> {
  await  deviceSentCommand({
    code: currDeviceCode.value,
    command: selectedRecord.value,
  })
}


// 摄像开关
const deviceSentCameraCommand = async() => {
  await deviceSentCommand({
    code: currDeviceCode.value,
    command: selectedCamera.value,
  })
}


// 环节预设
const handleGetPresetsDetailListByClass = async () => {
  await getPresetsDetailListByClass(userInfo.value.classCode).then(
    (res: any) => {
      if (res.data) {
        presetsCode.value = res?.data?.presetsCode;
        linksList.value = [
          {
            linkName: "开始",
          },
          ...res.data?.presetsDetailList?.map((el: any) => ({
            // linkName: el.linkName,
            linkName: el.linkName,
            duration: el.duration,
          })),
        ];
      }
    }
  );
};

// 记录活动----->开始

// 记录活动列表
const _getActivityCategoryListData = async () => {
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
  deviceSentCommand({
    code: currDeviceCode.value,
    command: value.value,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
  getDefaultActivityStart(value.value);
};

// 记录活动------>结束

// 活动记录开始 ----->开始

const getDefaultActivityStart = async (
  value = selectedRecordActivity.value
) => {
  await getLinkList(value).then((res: any) => {
    activityStartList.value = res.data.map((el) => {
      return {
        text: el.name,
        value: el.value,
      };
    });
  });
};

const changeActivityStart = (value) => {
  if (value.value === selectedRecordStartActivity.value) {
    handlePresetsActivitySave(2);
  } else {
    selectedRecordStartActivity.value = value.value;
    handlePresetsActivitySave(1);
  }
};

const handlePresetsActivitySave = (status) => {
  // const queryParams = getCurrentInstance().router?.params;

  if (currDeviceCode.value) {
    presetsActivitySave({
      presetsCode: presetsCode.value,
      link: selectedRecordStartActivity.value,
      teacherCode: userInfo.value.code,
      status,
      devcieCode: currDeviceCode.value,
    }).then(() => {
      if (status === 1) {
        Taro.showToast({
          title: "提交成功",
          icon: "success",
        });
      } else {
        selectedRecordStartActivity.value = "";
        Taro.showToast({
          title: "取消成功",
          icon: "success",
        });
      }
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
  }).then(() => {
    Taro.showToast({
      title: "保存成功",
      icon: "success",
    });
  });

  selectedTeacherInteraction.value = "1";
  selectedKidsEmotion.value = "1";
  selectedTeacherResponse.value = "1";
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
    // studentCode: studentsCode.value,
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

    selectedActionsPartner.value = "1";
    selectedStudentInteraction.value = "1";
    selectedEmotionTendency.value = "1";
    selectedKidsResponse.value = "1";
  });
};

//  TODO: 1. 页面写成组件 2，提交记录写成一个函数  3，校验写成一个函数 4，tab-item 写成对象赋值
</script>

<style lang="scss">
.nut-cell-group__wrap {
  margin-top: 0 !important;
  background-color: #e1d4c8 !important;
}

.nut-form-item__label {
  width: 280rpx;
}

.recorder-wrapper {
  padding: 0 60rpx;
  .location-icon-wrapper {
    display: flex;
    justify-content: center;
    margin: 40rpx 0rpx;
    .location-icon {
      width: 274rpx;
      height: 274rpx;
    }
  }
}

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
</style>
