import { EnumRole } from "./../constants/index";
import { defineStore } from "pinia";

export interface IUserInfo {
  /** id */
  id: number;
  value: string;
  code: string;
  number: string;
  /** 用户名 */
  name: string;
  /** 手机号 */
  mobile: string;
  password: string;
  /** 角色 */
  role: number;
  /** 角色名称 */
  roleName: string;
  classCode: string;
  /** 班级名称 */
  className: string;
  kgCode: string;
  kgName: string;
  createBy: number;
  /** 创建者 */
  createByName: string;
  createTime: number;
  updateBy: number;
  /** 修改着 */
  updateByName: string;
  updateTime: number;
  /** 状态 */
  status: number;
}

export const useUserStore = defineStore({
  id: "user",

  state: (): {
    userInfo: IUserInfo;
    currRole: EnumRole;
    currPageRole: EnumRole;
    currDeviceCode: string;
  } => ({
    userInfo: {} as IUserInfo,
    currRole: EnumRole.Student, // 全局
    currPageRole: EnumRole.Student, // 我的页面
    currDeviceCode: "",
  }),

  getters: {
    getUserInfo(state): IUserInfo {
      return state.userInfo;
    },
    getCurrRole(state): EnumRole {
      return state.currRole;
    },
    getCurrPageRole(state): EnumRole {
      return state.currPageRole;
    },
    getCurrDeviceCode(state): string {
      return state.currDeviceCode;
    },
  },

  actions: {
    setUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo;
      // this.currRole = userInfo.role;
    },

    setCurrRole(role: EnumRole) {
      this.currRole = role;
    },
    setCurrPageRole(role: EnumRole) {
      this.currPageRole = role;
    },
    setCurrDeviceCode(deviceCode: string) {
      this.currDeviceCode = deviceCode;
    },
  },
});
