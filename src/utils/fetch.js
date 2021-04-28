import axios from 'axios';
import router from '../router'
import qs from 'qs'

const baseUrl = process.env.NODE_ENV == 'development' ? '/API' : 'http://meinian.qs110.com/webadmin.php';

axios.interceptors.request.use(
    config => {
        config.headers['admin_token']=localStorage.getItem('tk');
        if (config.headers['Content-Type'] == 'multipart/form-data') {
            return config;
        }
        if (config.method == 'post') {
            config.data = {
                ...config.data,
                admin_token: localStorage.getItem('tk'),
            }
        } else if (config.method == 'get') {
            config.params = {
                admin_token: localStorage.getItem('tk'),
                ...config.params
            }
        }

        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.data.respCode == 100001) {
            if (router.history.current.path != '/user/login') {
                router.replace({
                    path: "/user/login",
                })
            }
        }
        return response;
    },
    error => {
        return console.log(error)
    }
)

export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + url, params)
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const upload = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: url,
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err);
            })
    })
}

export const exportData = (url, name, params = {}) => {//导出表格
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: baseUrl + url,
            data: qs.stringify(params),
            responseType: 'blob'
        })
            .then((res) => {
                const content = res.data;
                const blob = new Blob([content])
                const fileName = name + '.xls'
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}