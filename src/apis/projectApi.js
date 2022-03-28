import Ajax from './ajax'

export const projectListApi = params => {
    return Ajax({
        url: '/project/list',
        params
    })
}