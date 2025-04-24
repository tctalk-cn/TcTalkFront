import http from "@/utils/http.ts";

/**
 * 登入
 * @param phone 电话好吗
 * @param password 密码
 */
export async function usePhoneLogin(phone: string, password: string) {
    return await http.get<{
        code: number,
        cookie: string,
        token: string,
    }>("login/cellphone", {phone: phone, password: password})
}

/**
 * 登入
 * @param username 用户名
 * @param password 密码
 * @param captchaUuid uuid
 * @param captchaCode 验证码
 */
export async function useLogin(username: string, password: string, captchaUuid: string, captchaCode: string) {
    return await http.post<{
        code: number,
        data: {
            token: string,
            tokenHead: string,
        },
    }>("/member_api/member/login", {
        username: username,
        password: password,
        captchaUuid: captchaUuid,
        captchaCode: captchaCode
    })
}

/**
 * 获取验证码
 */
export async function useCaptcha() {
    return await http.get<{
        uuid: string,
        image: string,
    }>("/member_api/captcha")
}
