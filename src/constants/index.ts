export enum EnumRole {
  /** 上课者 */
  Student = 1,
  /** 记录者 */
  Recorder,
  /** 评价者 */
  Evaluator,
}

export const roleOptions = [
  {
    text: "上课者",
    value: EnumRole.Student,
  },
  {
    text: "记录者",
    value: EnumRole.Recorder,
  },
  {
    text: "评价者",
    value: EnumRole.Evaluator,
  },
];

/* 儿童情感 */

export const kidsEmotionsList = [
  {
    text: "进取",
    value: "1",
  },
  {
    text: "平和",
    value: "2",
  },
  {
    text: "畏惧",
    value: "3",
  },
];

export const teacherResponsesList = [
  {
    text: "正向",
    value: "1",
  },
  {
    text: "中性",
    value: "2",
  },
  {
    text: "负向",
    value: "3",
  },
];

export const emotionTendencyList = [
  {
    text: "正向",
    value: "1",
  },
  {
    text: "中性",
    value: "2",
  },
  {
    text: "负向",
    value: "3",
  },
];

export const kidsResponseList = [
  {
    text: "接受",
    value: "1",
  },
  {
    text: "拒绝",
    value: "2",
  },
];

export const actionsPartnersList = [
  {
    text: "班级",
    value: "1",
  },
  {
    text: "小组",
    value: "2",
  },
  {
    text: "个人",
    value: "3",
  },
];
