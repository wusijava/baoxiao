import axios from 'axios'
import util from '../util'
import Vue from 'vue'
import storage from '../storage'
import Router from "vue-router";

Vue.use(Router);

//const baseURL = 'http://116.62.11.124'
const baseURL = 'http://192.168.0.10:8083'
//const baseURL = 'http://49.233.192.222:8083'
const myAxios = {
    post: async function (url, param) {
        let result = await axios.post(url, param, {
            baseURL: baseURL,
            timeout: 1000 * 15,
            withCredentials: false,
            headers: setHeaders(),
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });

        if(!result || result.data.code == 40015){
            storage.remove("login_token")
        }
        return result;
    },
    getBaseUrl:function(){
        return baseURL;
    },
    postForUrl: async function(url,param){
        let result = await axios.post(url, param, {
            baseURL: baseURL,
            timeout: 1000 * 15,
            withCredentials: false,
            headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8",'Accept':'application/json'},
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });
        return result;
    }
}


function setHeaders() {
    const header = {}
    header['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    header['Accept'] = 'application/json'
    const Authorization = storage.get('login_token');
    if (!util.isEmpty(Authorization)) {
        header['authorization'] = Authorization
    }
    return header
}

export default myAxios