import axios from 'axios'
// 如果页面要使用store来获取vuex数据，需要直接引入store实例
import store from '../store'

// 可以使用axios的拦截功能，总共有两个拦截：请求前，请求后
// axios的拦截器使用，可以使用请求前拦截，需要给请求体添加一个中间件，业务如果通过中间件处理，会继续执行请求业务
// use方法的回调函数，会入参一个AxiosRequestConfig对象
// 回调函数要求必须返回一个AxiosRequestConfig对象或则事一个Promise.reject方法
axios.interceptors.request.use(function(config) {
    let token = store.getters["common/token"],
        otherPath = ['/user/validate/code']
        
    if (otherPath.includes(config.url)) {
        return config
    } else {
        config.headers.token = token
        return config
    }
    // 如果在拦截器中返回一个reject方法，会在axios.request方法的catch中捕获到
    // return Promise.reject({code: 400, message: '前端请求必须有token数据'})
})

// function ajax(req = {}) {
// const ajax = (req = {}) => {
// export default function(req = {}) {
export default (req = {}) => {
    if (!req.url) throw new Error('请求接口，url参数必传')

    return new Promise(resolve => {
        axios.request({
            // 请求地址
            url: req.url,
            // 请求类型
            method: req.method || 'GET',
            // 地址传参，使用params
            params: req.params || {},
            // 请求体传参，使用data
            data: req.data || {},
            // 超时设置为：5s
            timeout: req.timeout || 5000,
            // 可以给请求地址添加通用的路径字符，在执行请求的时候，baseURL会和url进行拼接
            // baseURL: 'http://www.shuiyue.info:16800'
            // 因为要使用代理配置才能访问后端接口，因此需要配置统一的代理字段
            baseURL: '/apis'
            // 给请求头添加参数
            // headers: {'X-Token': 'xxxxxx'}
        }).then(({data}) => {
            resolve(data)
        }).catch(e => {
            console.log(e);
            resolve({code: 500, message: '后端接口问题，请联系后端进行处理'})
        })
        // 这个是AxiosRequestConfig可以进行配置的属性定义
        // export interface AxiosRequestConfig<D = any> {
        //     url?: string;
        //     method?: Method;
        //     baseURL?: string;
        //     transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
        //     transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
        //     headers?: AxiosRequestHeaders;
        //     params?: any;
        //     paramsSerializer?: (params: any) => string;
        //     data?: D;
        //     timeout?: number;
        //     timeoutErrorMessage?: string;
        //     withCredentials?: boolean;
        //     adapter?: AxiosAdapter;
        //     auth?: AxiosBasicCredentials;
        //     responseType?: ResponseType;
        //     xsrfCookieName?: string;
        //     xsrfHeaderName?: string;
        //     onUploadProgress?: (progressEvent: any) => void;
        //     onDownloadProgress?: (progressEvent: any) => void;
        //     maxContentLength?: number;
        //     validateStatus?: ((status: number) => boolean) | null;
        //     maxBodyLength?: number;
        //     maxRedirects?: number;
        //     socketPath?: string | null;
        //     httpAgent?: any;
        //     httpsAgent?: any;
        //     proxy?: AxiosProxyConfig | false;
        //     cancelToken?: CancelToken;
        //     decompress?: boolean;
        //     transitional?: TransitionalOptions;
        //     signal?: AbortSignal;
        //     insecureHTTPParser?: boolean;
        // }
    })
}

// export default ajax