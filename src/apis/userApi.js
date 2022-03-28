import ajax from './ajax'

export function autoLoginApi() {
    return ajax({
        url: '/user/auto/login',
        method: 'POST'
    })
}

export function loginApi(data) {
    return ajax({
        url: '/user/app/login',
        method: 'POST',
        data
    })
}

function vdtCodeApi(phone) {
    return ajax({
        url: '/user/validate/code',
        method: 'POST',
        data: {phone}
    })
}

export function userInfoApi(id) {
    return ajax({
        url: '/user/info',
        params: {id}
    })
}

export function userRoleApi(ids) {
    return ajax({
        url: '/role/list/byids',
        params: {ids}
    })
}

export {
    vdtCodeApi
}