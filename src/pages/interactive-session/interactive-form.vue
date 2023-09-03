<template>
  <view class="index">
    <nut-form :model-value="dynamicForm.state.value" ref="dynamicRefForm">
      <div v-for="(item, index) in dynamicForm.state.value" :key="index">
        <nut-form-item
          :prop="index + '.link'"
          :rules="[{ required: true, message: '请选择活动环节' }]"
        >
          <template v-slot:label>
            <Dot>活动环节</Dot>
          </template>
          <br />
          <Select
            title="活动环节"
            v-model:value="item.link"
            :options="linkList"
            placeholder="请选择"
          />
        </nut-form-item>

        <nut-form-item
          :prop="index + '.duration'"
          :rules="[{ required: true, message: '请选择环节时长' }]"
        >
          <template v-slot:label>
            <Dot>环节时长</Dot>
          </template>

          <Select
            title="环节时长"
            v-model:value="item.duration"
            :options="durationList"
            placeholder="请选择"
          />
        </nut-form-item>
        <nut-cell class="btns-box">
          <nut-button
            size="small"
            type="info"
            color="linear-gradient(to right, #FF983D, #FFAC63)"
            style="margin-right: 10px"
            @click="dynamicForm.methods.add(index)"
            >添加</nut-button
          >
          <nut-button
            size="small"
            type="info"
            style="margin-right: 10px"
            @click="dynamicForm.methods.remove(index)"
            v-if="dynamicForm.state.value.length > 1"
            >删除</nut-button
          >
        </nut-cell>
      </div>
    </nut-form>

    <view class="button-wrapper">
      <nut-button
        size="large"
        color="linear-gradient(to right, #FF983D, #FFAC63)"
        type="info"
        @click="dynamicForm.methods.submit"
        :style="{ margin: 'auto' }"
        >提交</nut-button
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, PropType, onMounted } from "vue";
import Taro, { getCurrentInstance, useDidShow } from "@tarojs/taro";
import Select from "@/components/select/index.vue";
import Dot from "@/components/dot/index.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { getLinkList, batchSavePresetsDetail } from "@/services/preset";
import { getPresetsDetailListByClass } from "@/services/record";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const durationList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
  (el) => ({
    text: `${el}分钟`,
    value: el,
  })
);
const linkList = ref([]);

const presetsCode = ref("");
const loading = ref(true);

interface IFormItem {
  link: string;
  action: string;
  duration: string;
  code: string;
}
const dynamicRefForm = ref<any>(null);

const props = defineProps({
  refreshDetailList: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
});

const dynamicForm = {
  state: ref<Array<IFormItem>>([
    {
      link: "",
      action: "",
      duration: "",
      code: "",
    },
  ]),
  methods: {
    async submit() {
      try {
        dynamicRefForm.value.validate().then(({ valid, errors }: any) => {
          if (valid) {
            batchSavePresetsDetail({
              presetsCode: presetsCode.value,
              presetsDetails: JSON.stringify(dynamicForm.state.value),
            }).then(() => {
              Taro.showToast({
                title: "保存成功",
                icon: "success",
              });
              props.refreshDetailList?.();
            });
          } else {
            console.log(errors[0].message);
            console.log("error submit!!", errors);
          }
        });
      } catch (error) {
        console.log("error", error);
        Taro.showToast({
          title: "请完善必填项",
          icon: "error",
        });
      }
    },
    remove(index: number) {
      dynamicForm.state.value.splice(index, 1);
    },
    add(_index?: number) {
      dynamicForm.state.value.push({
        link: "",
        action: "",
        duration: "",
        code: "",
      });
    },
  },
};

onMounted(() => {
  const queryParams = getCurrentInstance().router?.params;

  if (queryParams?.category) {
    getLinkList(queryParams.category).then((res: any) => {
      if (res.data) {
        linkList.value =
          res.data.map((el) => ({
            text: el.name,
            value: el.value,
          })) || [];
      }
    });
  }

  if (queryParams?.presetsCode) {
    presetsCode.value = queryParams.presetsCode;
    getPresetsDetailListByClass(userInfo.value.classCode).then((res: any) => {
      if (res.data.presetsDetailList.length) {
        loading.value = false;
        dynamicForm.state.value = [];
        res.data.presetsDetailList.forEach((el: any) => {
          dynamicForm.state.value.push({
            link: el.link,
            action: el.action,
            duration: el.duration,
            code: el.code,
          });
          dynamicRefForm?.value?.$forceUpdate();
        });
      }
    });
  } else {
    loading.value = false;
  }
});

useDidShow(() => {});
</script>

<style>
.submit-box,
.btns-box {
  display: flex;
  justify-content: center;
}
</style>
