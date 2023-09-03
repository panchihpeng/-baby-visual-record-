<template>
  <Container hidden-header>
    <view class="evaluate-list-wrapper">
      <view v-for="evaluateItem in evaluateList" :style="{ marginBottom: '24rpx' }">
        <quality-item :evaluate-content-list="evaluateItem.evaluateContent" :evaluator="evaluateItem.evaluator" />
      </view>
      <view class="evaluate-summary">
        <view class="evaluate-summary-title">互动环节与质量评价小结</view>
        <view class="evaluate-content-desc">1、预设与实际差异: 从环节增加减少、时长变化、儿童回应率等自动比对
        </view>
        <view class="evaluate-content-desc">
          <view class="evaluation-feedback">
            2、评价反馈:
          </view>
          <view class="evaluation-feedback-item">
            <view class="evaluation-feedback-evaluator">李明：</view>
            <view  class="evaluation-feedback-content">
              <view :style="{marginBottom: '12rpx'}">
                **环节，质量较好，+文字描述附照片和短视频
              </view>
              <view :style="{marginBottom: '12rpx'}">
                ***环节，质量一般，+文字描述 附照片和短视频
              </view>
            </view>
          </view>

        </view>
      </view>
    </view>
  </Container>
</template>

<script lang="ts" setup>
import Container from "@/components/container/index.vue";
import qualityItem from '@/pages/quality-feedback/quality-item/index.vue'

const evaluateList: any[] = [{
  evaluator: '李xxx',
  evaluateContent: [{
    linkName: "开始",
    showContent: false
  },
  {
    linkName: "播放卡通片",
    rate: 4,
    text: '这个环节挺不错，继续加油!!!',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  },
  {
    linkName: "示范表演",
    rate: 4.5,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  },
  {
    linkName: "提问问题",
    rate: 3,
    text: '巴拉巴拉，唧唧哇哇的',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  }]
}, {
  evaluator: '张xxx',
  evaluateContent: [{
    linkName: "开始",
    showContent: false
  },
  {
    linkName: "播放卡通片",
    rate: 4,
    text: '这个环节挺不错，继续加油!!!',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  },
  {
    linkName: "示范表演",
    rate: 4.5,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  },
  {
    linkName: "提问问题",
    rate: 3,
    text: '巴拉巴拉，唧唧哇哇的',
    imgSrc: 'https://thumbs.dreamstime.com/b/%E6%95%99%E5%B8%88%E5%9C%A8%E6%95%99%E5%AE%A4%E9%87%8C%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF-%E6%95%99%E5%AE%A4%E9%87%8C%E8%80%81%E5%B8%88%E5%92%B3%E5%97%BD%E7%9A%84%E5%9C%BA%E6%99%AF%E5%9B%BE-180868504.jpg'
  }]
}]

</script>
<style lang="scss">
  .evaluate-summary {
    background-color: #fff;
    padding: 24rpx;
    font-weight: 500;

    .evaluate-summary-title {
      font-weight: bold;
    }

    .evaluate-content-desc {
      margin: 12rpx 0;
    }

    .evaluation-feedback-item {
      display: flex;
      padding-left: 42rpx;
      padding-top: 12rpx;
    }

    .evaluation-feedback-content {
      flex: 1;
    }
  }
</style>