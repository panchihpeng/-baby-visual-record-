import taro from "@tarojs/taro";

export const baseUrl = "https://open.bbsjjl.com";

const makeUrl = (url: string) => {
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

export const request = (
  url: string,
  {
    data,
    method = "GET",
  }: {
    data?: Record<string, any>;
    method?: "GET" | "POST";
  }
) => {
  return new Promise((resolve, reject) => {
    const requestUrl = makeUrl(url);
    const accessToken = taro.getStorageSync("accessToken");

    const header =
      method === "POST"
        ? {
            "content-type": "application/x-www-form-urlencoded",
            accessToken,
          }
        : {
            accessToken,
          };

    taro
      .request({
        url: requestUrl,
        data,
        method,
        header,
      })
      .then((res) => {
        if (res.data?.code === 0) {
          resolve(res.data);
        } else if (res.data?.code === 401) {
          taro.showToast({
            title: "AccessToken验证失败/过期",
            icon: "error",
          });
          setTimeout(() => {
            taro.navigateTo({
              url: "/pages/login/index",
            });
          });
        } else {
          taro.showToast({
            title: res.data?.msg || "接口错误",
            icon: "error",
          });
          reject(res.data);
        }
      })
      .catch((rej) => {
        resolve(rej);
      });
  });
};
