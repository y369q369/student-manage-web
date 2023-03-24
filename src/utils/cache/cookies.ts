/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token, { expires: 7 })
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}

export const getUser = () => {
  const userStr = Cookies.get(CacheKey.USER)
  if (userStr != null) {
    return JSON.parse(<string>userStr)
  } else {
    return null
  }
}
export const setUser = (user: object) => {
  const userStr = JSON.stringify(user)
  Cookies.set(CacheKey.USER, userStr, { expires: 7 })
}
export const remove = (key: string) => {
  Cookies.remove(key)
}
