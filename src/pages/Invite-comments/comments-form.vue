<template>
  <view class="invite-page-wrapper">
    <view
      style="
        background-color: #e1d4c8;
        padding: 20rpx;
        margin-bottom: 10rpx;
        border-radius: 5rpx;
      "
    >
      <text class="title-item">{{ titleText }}</text>
      <Dot>预设互动环节</Dot>
      <interactive-session-steps
        :interactive-list="presetList"
        style="margin-left: 12rpx"
      />
    </view>

    <view
      style="background-color: #e1d4c8; padding: 20rpx; border-radius: 5rpx"
    >
      <Dot> 互动环节质量评价 </Dot>
      <view style="margin: 20rpx 0">
        <text> 评价环节选择 </text>
        <TabItem
          :tabsList="linkList"
          :selected="selectedLink"
          @change="changeLink"
        ></TabItem>
      </view>

      <view
        style="display: flex; align-items: center; margin: 20rpx 0"
        @click="showCamera = true"
      >
        <text>现场拍摄</text>
        <image
          src="../../resource/camera-icon.png"
          style="width: 50rpx; height: 40rpx; margin: 10rpx 20rpx"
        ></image>
      </view>
      <UploadCamera v-model:visible="showCamera" v-model:value="cameraValue" />

      <view style="margin: 20rpx 0 20rpx 12rpx !important; width: 98%">
        <nut-form>
          <nut-form-item>
            <template v-slot:label style="width: 200rpx">
              <text>一级自定义指标</text>
            </template>
            <Select v-model:value="one" :options="oneList" />
          </nut-form-item>
        </nut-form>
        <view style="margin: 20rpx 0">
          <TabItem
            :tabsList="twoList"
            :selected="two"
            @change="changeTwo"
          ></TabItem>
        </view>
      </view>

      <view style="margin: 20rpx 0 20rpx 12rpx !important; width: 98%">
        <nut-form style="margin: 0 auto">
          <nut-form-item label="评价等级">
            <nut-radio-group direction="horizontal" v-model="formData.respond">
              <nut-radio label="5">高</nut-radio>
              <nut-radio label="3">中</nut-radio>
              <nut-radio label="1">低</nut-radio>
            </nut-radio-group>
          </nut-form-item>
        </nut-form>
      </view>
      <view>
        <Dot>评价描述</Dot>
        <view style="margin: 20rpx 0 20rpx 12rpx; width: 98%">
          <nut-textarea
            placeholder="请输入评价内容(100字以内)"
            :rows="2"
            :max-length="200"
            show-word-limit
            v-model="formData.qualityDescription"
          />
        </view>
      </view>
    </view>

    <view class="invite__bottom">
      <nut-button
        color="linear-gradient(to right, #FF983D, #FFAC63)"
        type="info"
        @click="handleSave"
        >提交评价</nut-button
      >
      <nut-button
        plain
        type="info"
        @click="handleEnd"
        style="margin-left: 32rpx"
        v-if="currRole === EnumRole.Evaluator"
        >结束活动</nut-button
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, toRefs } from "vue";
import interactiveSessionSteps from "@/components/interactive-session-steps/index.vue";
import Select from "@/components/select/index.vue";
import UploadCamera from "@/components/camera/index.vue";

import {
  getLinkList,
  getActivityCategory,
  presetsApiMaps,
  saveInviteComments,
  getOneList,
  getTwoList,
} from "@/services/preset";
import { getCurrentInstance } from "@tarojs/taro";
import {
  getPresetsDetailListByInvite,
  getPresetsTopic,
} from "@/services/record";
import Taro from "@tarojs/taro";
import { baseUrl } from "@/services/request";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { EnumRole } from "@/constants";
import { updateInviteStatus } from "@/services/record";
import Dot from "@/components/dot/index.vue";

const props = defineProps({
  presetsCode: String,
  classCode: String,
});

const { presetsCode } = toRefs(props);

type presetItem = {
  linkName: string;
  actionName?: string;
  duration?: number;
};

// 预览
const presetList = ref<presetItem[]>([]);

const showCamera = ref(false);
const cameraValue = ref();

const one = ref("");

const formData = ref<any>({
  respond: "",
  qualityDescription: "",
});

// 抬头
const titleText = ref("");

// 评价选择
const linkList = ref();
const selectedLink = ref("");
const category = ref("");

// 一级自定义
const oneList = ref([]);

// 二级自定义
const twoList = ref([]);
const two = ref("");

const userStore = useUserStore();
const { userInfo, currRole } = storeToRefs(userStore);

onMounted(() => {
  run();
});

watch(one, () => {
  getTwoListData();
});

const run = async () => {
  await handleGetPresetsDetailListByInvite();
  await getParentId();
  await getLinkListData();
  await getActivityCategoryList();
  await getOneListData();
};

const handleGetPresetsDetailListByInvite = async () => {
  await getPresetsDetailListByInvite(presetsCode?.value!).then((res: any) => {
    if (res.data.length > 0) {
      presetList.value = [
        {
          linkName: "开始",
        },
        ...res.data.map((el: any) => ({
          linkName: el.linkName,
          actionName: el.actionName,
          duration: el.duration,
        })),
      ];
    }
  });
};

//  评价环节选择

// parentId=通过接口37获取category
const getParentId = async () => {
  await getPresetsTopic(presetsCode?.value!).then((res: any) => {
    category.value = res.data.category;
  });
};
// 评价环节选择
const getLinkListData = async () => {
  await getLinkList(category.value).then((res: any) => {
    linkList.value = res.data.map((el) => ({
      text: el.name,
      value: el.value,
    }));
  });
};

// 抬头显示

const getActivityCategoryList = async () => {
  if (!category.value) {
    titleText.value = "暂无活动";
  } else {
    getActivityCategory().then((res: any) => {
      const list = res.data.map((el) => ({
        text: el.name,
        value: el.value,
      }));
      titleText.value = list.filter(
        (item) => item.value === category.value
      )[0].text;
    });
  }
};
// 选择tab
const changeLink = (value) => {
  selectedLink.value = value.value;
};
//  一级指标
const getOneListData = () => {
  getOneList().then((res: any) => {
    oneList.value = res.data.map((el) => ({
      text: el.name,
      value: el.value,
    }));
  });
};

// 二级指标

const getTwoListData = () => {
  getTwoList(one.value).then((res: any) => {
    twoList.value = res.data.map((el) => ({
      text: el.name,
      value: el.value,
    }));
  });
};

const changeTwo = (value) => {
  two.value = value.value;
};

const handleUpload = (filePath, params) => {
  const accessToken = Taro.getStorageSync("accessToken");

  Taro.uploadFile({
    url: baseUrl + presetsApiMaps.inviteCommentsSave,
    filePath: filePath,
    name: "files",
    header: {
      accessToken,
    },
    formData: params,
    success(result) {
      if (result.data) {
        const { code } = JSON.parse(result.data);
        if (code === 0) {
          Taro.showToast({
            icon: "success",
            title: "保存成功",
            mask: true,
          });
          handleReset();
        }
      }
    },
    fail() {
      Taro.showToast({
        icon: "error",
        title: "保存失败，请重试",
        mask: true,
      });
    },
  });
};

const handleSave = async () => {
  const { photoSrc = "", videoSrc = "" } = cameraValue.value || {};
  const filePath = photoSrc || videoSrc || "";

  const hasOneAddFlag = [
    selectedLink.value,
    filePath,
    two.value,
    formData.value.respond,
    formData.value.qualityDescription,
  ].some((el) => el);

  if (!hasOneAddFlag) {
    Taro.showToast({
      icon: "error",
      title: "至少选择一项",
    });
    return;
  }

  Taro.showLoading();

  const params = {
    link: selectedLink.value,
    action: two.value,
    qualityLevel: formData.value.respond,
    qualityDescription: formData.value.qualityDescription,
    presetsCode: presetsCode?.value!,
    role: currRole.value,
    teacherCode: userInfo.value.code,
  };

  if (!filePath) {
    try {
      const res = (await saveInviteComments(params)) as any;
      if (res && res.code === 0) {
        Taro.showToast({
          icon: "success",
          title: "保存成功",
          mask: true,
        });
        handleReset();
      }
    } catch (error) {
      Taro.showToast({
        icon: "error",
        title: "保存失败，请重试",
        mask: true,
      });
    }
    return;
  }

  handleUpload(filePath, params);
};

const handleEnd = () => {
  const inviteId = getCurrentInstance().router?.params?.inviteId;
  updateInviteStatus({
    inviteId: Number(inviteId),
    status: 3,
  }).then(() => {
    Taro.showToast({
      title: "活动结束成功",
      icon: "success",
    });
  });
};
const handleReset = () => {
  formData.value = {};
  cameraValue.value = {};
  selectedLink.value = "";
  one.value = "";
  two.value = "";
  twoList.value = [];
};
</script>

<style lang="scss">
.invite-page-wrapper {
  .nut-cell-group__wrap {
    margin: 0 !important;
  }
}
.invite {
  &__title {
    font-size: 28rpx;
    // font-weight: bold;
    // color: #333333;
    padding: 16rpx 0rpx;
  }

  &__bottom {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.activities-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-item {
  display: inline-block;
  padding: 10rpx 20rpx;
  background-color: #ff983d;
  color: #fff;
  border-radius: 10rpx;
  margin: 15rpx;
}

.nut-form-item__label {
  width: 200rpx;
}
</style>
