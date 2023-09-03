export enum InviteReadStatusEnum {
  /** 未读 */
  UNREAD = 0,
  /** 已读 */
  READ = 1,
}

export interface IInvitationItem {
  className: string;
  teacherName: string;
  status: InviteReadStatusEnum;
  presetsCode: string;
  teacherCode: string;
  id: number;
  pTime: string;
}
