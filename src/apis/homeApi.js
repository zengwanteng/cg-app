import Ajax from './ajax'

// export function collectionApi() {
//     return Ajax({
//         url: '/analysis/collection'
//     })
// }

export const collectionApi = () => Ajax({url: '/analysis/collection'})
export const paymentApi = () => Ajax({url: '/analysis/payable'})