import { request } from "./request";

export const homeApiMaps = {
  qualityListByStudent: "/byh/presets/listByTeacher",
  qualityListByRecorder: "/byh/presets/listByClass",
  qualityListByEvaluator: "/byh/presetsInvite/listByTeacher",
  presetsChartChildren: "/byh/presetsChart/children",
  presetsChartDevelop: "/byh/presetsChart/develop",
  presetsChartEvaluate: "/byh/presetsChart/evaluate",
};

/** 儿童 */
export const getPresetsChartChildren = (teacherCode: string) => {
  return request(homeApiMaps.presetsChartChildren, {
    method: "POST",
    data: { teacherCode },
  });
};

/** 专业发展 */
export const getPresetsChartDevelop = (teacherCode: string) => {
  return request(homeApiMaps.presetsChartDevelop, {
    method: "POST",
    data: { teacherCode },
  });
};

/** 评价 */
export const getPresetsChartEvaluate = (teacherCode: string) => {
  return request(homeApiMaps.presetsChartEvaluate, {
    method: "POST",
    data: { teacherCode },
  });
};

/***
 * 19.质量反馈列表读取（上课者）
 */
export const getQualityListByStudent = (data: {
  teacherCode: string;
  offset?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return request(homeApiMaps.qualityListByStudent, {
    method: "GET",
    data,
  });
};

/**
 * 20.质量反馈列表读取（记录者）
 */
export const getQualityListByRecorder = (data: {
  classCode: string;
  offset?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return request(homeApiMaps.qualityListByRecorder, {
    method: "GET",
    data,
  });
};

/**
 * 21.质量反馈列表读取（评价者）
 */
export const getQualityListByEvaluator = (data: {
  teacherCode: string;
  offset?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return request(homeApiMaps.qualityListByEvaluator, {
    method: "GET",
    data,
  });
};
