import { request } from "./request";

export const presetsApiMaps = {
  save: "/byh/presets/save",
  readPresets: "/byh/presets/classCode",
  dictList: "/common/dict/list",
  teacherList: "/byh/teacher/list",
  savePresetsInvite: "/byh/presetsInvite/save",
  presetDetailList: "/byh/presetsDetail/listByInvite",
  batchSavePresetsDetail: "/byh/presetsDetail/batchSave",
  studentList: "/byh/student/list",
  /** 文件上传 */
  upload: "/byh/file/upload",
  /** 大文件分片上传 */
  multipartUpload: "/byh/file/uploadFile",
  inviteCommentsSave: "/byh/presetsRecord/save",
};

const dictCodeMap = {
  category_1: "cmd_c1",
  category: "cmd_c2",
  linkList: "cmd_link",
  moveList: "cmd_move",
  oneList: "one",
  twoList: "two",
};

export interface ISavePersetsInfoData {
  subject: string;
  category: string;
  teacherCode: string;
  classCode: string;
  pTime: string;
  ptime: any;
}

/** 预设保存 */
export const savePersetsInfo = (data: ISavePersetsInfoData) => {
  return request(presetsApiMaps.save, {
    method: "POST",
    data,
  });
};

/** 观察活动列表 */
export const getActivityCategory = (parentId?: string) => {
  if (parentId) {
    return request(`${presetsApiMaps.dictList}/${dictCodeMap.category_1}`, {
      method: "GET",
      data: {
        parentId,
      },
    });
  } else {
    return request(`${presetsApiMaps.dictList}/${dictCodeMap.category_1}`, {
      method: "GET",
    });
  }
};

export interface IReadPresetsInfoData {
  classCode: string;
}

/** 读取预设 */
export const readPresetsInfo = (data: IReadPresetsInfoData) => {
  return request(presetsApiMaps.readPresets, {
    method: "POST",
    data,
  });
};

export interface ITeacherListData {
  kgCode: string;
}

/** 获取观摩评价者 */
export const getTeacherList = (data: ITeacherListData) => {
  return request(presetsApiMaps.teacherList, {
    method: "GET",
    data,
  });
};

export interface ISavePresetsInviteData {
  presetsCode: string;
  teacherCodes: string[];
}

/** 邀请观摩评价者 */
export const savePresetsInvite = (data: ISavePresetsInviteData) => {
  return request(presetsApiMaps.savePresetsInvite, {
    method: "POST",
    data,
  });
};

/** 活动环节 */
export const getLinkList = (parentId) => {
  return request(`${presetsApiMaps.dictList}/${dictCodeMap.category}`, {
    method: "GET",
    data: {
      parentId,
    },
  });
};

/** 互动策略 */
export const getMoveList = () => {
  return request(`${presetsApiMaps.dictList}/${dictCodeMap.moveList}`, {
    method: "GET",
  });
};

/** 获取互动环节 */
export const getPresetsDetailList = (presetsCode: string) => {
  return request(presetsApiMaps.presetDetailList, {
    method: "GET",
    data: { presetsCode },
  });
};

export const getStudentList = (classCode: string) => {
  return request(presetsApiMaps.studentList, {
    method: "POST",
    data: { classCode },
  });
};

export interface IPresetsDetailData {
  presetsCode: string;
  presetsDetails: any;
}

/** 互动环节保存 */
export const batchSavePresetsDetail = (data: IPresetsDetailData) => {
  return request(presetsApiMaps.batchSavePresetsDetail, {
    method: "POST",
    data,
  });
};

export const saveInviteComments = (data) => {
  return request(presetsApiMaps.inviteCommentsSave, {
    method: "POST",
    data,
  });
};

// 一级指标
export const getOneList = () => {
  return request(`${presetsApiMaps.dictList}/${dictCodeMap.oneList}`, {
    method: "GET",
  });
};

// 二级指标
export const getTwoList = (parentId) => {
  return request(`${presetsApiMaps.dictList}/${dictCodeMap.twoList}`, {
    method: "GET",
    data: {
      parentId,
    },
  });
};
