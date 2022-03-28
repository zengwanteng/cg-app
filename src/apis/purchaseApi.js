import Ajax from './ajax'

export const purchaseListApi = params => {
    return Ajax({
        url: '/purchase/list',
        params
    })
}

export const purchaseDeleteApi = id => {
    return Ajax({
        // 因为这是一个动态路由，因此在使用的时候，需要把动态部分":id"替换为参数
        // url: '/purchase/delete/:id' 错误的写法
        url: '/purchase/delete/' + id,
        method: 'POST'
    })
}

export const purchaseFlowApi = data => {
    return Ajax({
        url: '/purchase/flow',
        method: 'POST',
        data
    })
}

export const purchaseInfoApi = id => {
    return Ajax({
        url: '/purchase/info',
        params: {id}
    })
}

export const projectListApi = params => {
    return Ajax({
        url: '/project/list',
        params
    })
}

export const supplierListApi = params => {
    return Ajax({
        url: '/supplier/list',
        params
    })
}

export const userListApi = () => {
    return Ajax({
        url: '/user/list',
        params: {page: 1, size: 10000}
    })
}

export const productListApi = () => Ajax({url: '/material/list'})

export const purchaseSaveApi = data => {
    return Ajax({
        url: '/purchase/save',
        method: 'POST',
        data
    })
}

export const purchaseUpdateApi = data => {
    return Ajax({
        url: '/purchase/update',
        method: 'POST',
        data
    })
}