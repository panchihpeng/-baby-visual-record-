import { request } from "./request";

export const apiAuthToken = "/system/auth/token";

export const getAuthToken = (data: { clientId: string; password: string }) => {
  return request(apiAuthToken, {
    data,
    method: 'POST'
  });
};


export const apiLogin = "/login";

export const login = (data: {username: string; password: string}) => {
  return request(apiLogin, {
    data,
    method: 'POST'
  })
}