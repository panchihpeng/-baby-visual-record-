import { request } from "./request";

export const qualityApiMaps = {
  presetsDetailListByPresetsCode: "/byh/presetsDetail/listByPresetsCode",
  presetsDetailListByTeacherCode: "/byh/presetsDetail/listByteacherCode",
};

export const getPresetsDetailListByPresetsCode = (presetsCode: string) => {
  return request(qualityApiMaps.presetsDetailListByPresetsCode, {
    data: {
      presetsCode,
    },
  });
};

export const getPresetsDetailListByTeacherCode = (data: {
  teacherCode: string;
  role: any;
}) => {
  return request(qualityApiMaps.presetsDetailListByTeacherCode, {
    data,
  });
};
