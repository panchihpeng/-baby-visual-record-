<template>
  <div class="date-picker__container" @click="showTimePicker = true">
    <span v-if="!dateDesc">{{ placeholder }}</span>
    <span v-else>
      {{ dateDesc }}
    </span>
    <RectRight />
  </div>
  <nut-popup position="bottom" v-model:visible="showTimePicker">
    <nut-date-picker v-model="currentDate" title="日期时间选择" type="datetime" :min-date="dateConfig.minDate"
      :max-date="dateConfig.maxDate" @confirm="handleConfirm" @cancel="showTimePicker = false" />
  </nut-popup>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRefs, onMounted } from "vue";
import { ISelectItem } from "@/components/select/type";
import { RectRight } from "@nutui/icons-vue-taro";
import dayjs from "dayjs";

const props = defineProps({
  placeholder: {
    type: String,
    default: "请选择",
  },
  value: {
    type: [String, Number],
    default: new Date().getTime(),
  },
});

const { placeholder, value } = toRefs(props);
const emit = defineEmits(["update:value"]);

const showTimePicker = ref(false);
const currentDate = ref(new Date());
const dateConfig = reactive({
  minDate: new Date(2020, 0, 1),
  maxDate: new Date(2100, 10, 1),
});
const dateDesc = ref("");

const handleConfirm = ({ selectedOptions }) => {
  const yearMonth = selectedOptions
    .slice(0, 3)
    .map((item: ISelectItem) => item.text)
    .join("-");
  const time = selectedOptions
    .slice(3)
    .map((item: ISelectItem) => item.text)
    .join(":");

  dateDesc.value = yearMonth + " " + time;
  currentDate.value = new Date(dateDesc.value);
  showTimePicker.value = false;
  emit("update:value", currentDate.value.getTime());
};

watch(
  value,
  () => {
    currentDate.value = new Date(value.value);
    dateDesc.value = dayjs(new Date(value.value)).format('YYYY-MM-DD hh:mm:ss')
  }
);

onMounted(() => {
  currentDate.value = new Date(value.value);
  dateDesc.value = dayjs(new Date(value.value)).format('YYYY-MM-DD hh:mm:ss')
})
</script>

<style lang="scss">
.date-picker__container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28rpx;
}
</style>
