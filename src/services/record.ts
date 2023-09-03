import { InviteStatusEnum } from "@/pages/observation-record/type";
import { request } from "./request";

export const presetsInviteApiMap = {
  list: "/byh/presetsInvite/list",
  updateStatus: "/byh/presetsInvite/update",
  presetsDetailListByClass: "/byh/presetsDetail/listByClass",
  presetsDetailListByInvite: "/byh/presetsDetail/listByInvite",
  devicesList: "/byh/device/list",
  loginDevice: "/byh/device/loginDevice",
  recordInfosList: "/common/dict/list",
  deviceSentCommand: "/byh/device/sendCommand",
  presetsCodeToTopic: "/byh/presets/code",
  presetsActivitySave: "/byh/presetsActivity/save",
  presetsInteractionSave: "/byh/presetsInteraction/save",
};

export interface IGetPresetsInviteListRequest {
  teacherCode: string;
  offset: number;
  limit: number;
}

/** 获取邀请列表 */
export const getPresetsInviteList = (data: IGetPresetsInviteListRequest) => {
  return request(presetsInviteApiMap.list, {
    method: "GET",
    data,
  });
};

export interface IUpdateInviteStatusRequest {
  inviteId: number;
  status: InviteStatusEnum;
}

/** 更新邀请状态 */
export const updateInviteStatus = (data: IUpdateInviteStatusRequest) => {
  return request(presetsInviteApiMap.updateStatus, {
    method: "POST",
    data,
  });
};

/** 主题详情列表读取（本班） */
export const getPresetsDetailListByClass = (classCode: string) => {
  return request(presetsInviteApiMap.presetsDetailListByClass, {
    method: "GET",
    data: {
      classCode,
    },
  });
};

/** 主题详情列表读取（邀请） */
export const getPresetsDetailListByInvite = (presetsCode: string) => {
  return request(presetsInviteApiMap.presetsDetailListByInvite, {
    method: "GET",
    data: {
      presetsCode,
    },
  });
};

/*记录场所列表*/

export const getLocationsList = (kgCode: string) => {
  return request(presetsInviteApiMap.devicesList, {
    method: "GET",
    data: {
      kgCode,
    },
  });
};

// 设备登陆
export interface ILoginDeviceRequest {
  deviceCode: string;
  teacherCode: string;
}

export const bindLoginDevice = (data: ILoginDeviceRequest) => {
  return request(presetsInviteApiMap.loginDevice, {
    method: "POST",
    data,
  });
};

/* 录像列表 */

export const getRecordInfosList = () => {
  return request(`${presetsInviteApiMap.recordInfosList}/video_mode`, {
    method: "GET",
  });
};

/* 设备发送  */
export interface IDeviceSentCommandRequest {
  code: string;
  command: string;
}

export const deviceSentCommand = (data: IDeviceSentCommandRequest) => {
  return request(`${presetsInviteApiMap.deviceSentCommand}`, {
    method: "POST",
    data,
  });
};

/* 记录活动选中值 */

export const getPresetsTopic = (code: string) => {
  return request(`${presetsInviteApiMap.presetsCodeToTopic}`, {
    method: "POST",
    data: {
      code,
    },
  });
};

/* 活动记录选择 */
export interface IPresetsActivitySave {
  presetsCode: string;
  link: string;
  teacherCode: string;
  status: number;
  devcieCode: string;
}

export const presetsActivitySave = (data: IPresetsActivitySave) => {
  return request(`${presetsInviteApiMap.presetsActivitySave}`, {
    method: "POST",
    data,
  });
};

/* 互动记录 */
export const getInteractionsList = (type) => {
  return request(`${presetsInviteApiMap.recordInfosList}/${type}`, {
    method: "GET",
  });
};

/*  互动记录保存   */

export interface IPresetsInteractionSave {
  presetsCode: string;
  action: string;
  obj?: string;
  studentCode?: string;
  emotion: number;
  response: number;
  teacherCode: string;
  role: number;
}

export const presetsInteractionSave = (data: IPresetsInteractionSave) => {
  return request(`${presetsInviteApiMap.presetsInteractionSave}`, {
    method: "POST",
    data,
  });
};
