<template>
  <div>
    <div class="select__area" @click="handleOpenPopup">
      <span class="select__area--value" v-if="popupDesc">{{ popupDesc }}</span>
      <span v-else>
        {{ placeholder }}
      </span>
      <RectRight class="icon" />
    </div>
    <nut-popup
      class="popup__container"
      position="bottom"
      :visible="true"
      v-if="show"
      @clickOverlay="show = false"
    >
      <div class="popup__top--bar" :class="multiple ? 'multiple' : ''">
        <div class="popup__top--left" v-if="multiple" @click="show = false">取消</div>
        <view class="popup__top__title">{{ title }}</view>
        <div class="popup__top--right" v-if="multiple" @click="handleConfirmPopup">
          确认
        </div>
      </div>
      <div class="popup__value--block">
        <template v-if="multiple">
          <nut-checkbox-group v-model="multipleSelectValue">
            <nut-checkbox
              v-for="option in options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.text }}
            </nut-checkbox>
          </nut-checkbox-group>
        </template>
        <template v-else>
          <nut-radio-group v-model="singleSelectValue" @change="handleSingleSelectChange">
            <nut-radio
              v-for="option in options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.text }}
            </nut-radio>
          </nut-radio-group>
        </template>
      </div>
    </nut-popup>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch, toRefs, computed } from "vue";
import { ISelectItem } from "./type";
import { RectRight } from "@nutui/icons-vue-taro";

const props = defineProps({
  title: {
    type: String,
    default: "请选择",
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  options: {
    type: Array as PropType<ISelectItem[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  onConfirm: {
    type: Function as PropType<(value: string | string[] | number | number[]) => void>,
    default: () => {},
  },
  value: {
    type: [String, Number, Array] as PropType<
      ISelectItem["value"] | Array<ISelectItem["value"]>
    >,
  },
});

const { placeholder, options, disabled, value, multiple } = toRefs(props);
const emit = defineEmits(["update:value", "change"]);

const show = ref(false);
const singleSelectValue = ref<ISelectItem["value"]>("");
const multipleSelectValue = ref<Array<ISelectItem["value"]>>([]);

watch(value!, (newVal) => {
  if (multiple.value) {
    multipleSelectValue.value = (newVal as unknown) as Array<ISelectItem["value"]>;
  } else {
    singleSelectValue.value = (newVal as unknown) as ISelectItem["value"];
  }
});

const popupDesc = computed(() => {
  if (multiple.value && !show.value) {
    return options.value
      .filter((el) => multipleSelectValue.value.includes(el.value))
      .map((el) => el.text)
      .join("、");
  } else {
    return props.options.find((el) => el.value === props.value)?.text;
  }
});

const handleOpenPopup = () => {
  show.value = true;
  if (!disabled.value) {
    if (multiple.value) {
      multipleSelectValue.value = (props.value as unknown) as Array<ISelectItem["value"]>;
    } else {
      singleSelectValue.value = (props.value as unknown) as ISelectItem["value"];
    }
  }
};

const handleConfirmPopup = () => {
  if (props.multiple) {
    emit("update:value", multipleSelectValue.value);
    emit("change", multipleSelectValue.value);
    props?.onConfirm?.(multipleSelectValue.value as string[]);
  } else {
    emit("update:value", singleSelectValue.value);
    emit("change", singleSelectValue.value);
    props.onConfirm?.(singleSelectValue.value);
  }

  show.value = false;
};

const handleSingleSelectChange = (value) => {
  emit("update:value", value);
  emit("change", multipleSelectValue.value);
  props.onConfirm?.(value);
  show.value = false;
};
</script>

<style lang="scss">
.select__area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28rpx;

  &--value {
    color: #666;
  }
}

.popup__container {
  .nut-popup {
    box-sizing: border-box;
  }

  .popup__title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 84rpx;
    color: #333;
  }

  .popup__top {
    &--bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      height: 68rpx;
      color: #666666;
      padding: 0 32rpx;
      box-shadow: 0px 1px 7px 0px rgb(237, 238, 241);

      &:not(.multiple) {
        justify-content: center;
      }
    }
  }

  .popup__value {
    &--block {
      padding: 20rpx 20rpx 56rpx;
      max-height: 60vh;
      overflow: auto;

      .nut-radio-group {
        width: 100%;
      }

      .nut-radio__label {
        padding: 12rpx 0;
        border-bottom: 1px solid #ebedf0;
      }
    }
  }
}
</style>
