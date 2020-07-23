import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.spend.list,params);
    return result.data;
}
export async function detail(params){
    const result = await axios.post(api.spend.detail,params);
    return result.data;
}

export async function spendUpdate(params){
    const result = await axios.post(api.spend.spendUpdate,params);
    return result.data;
}
del
export async function del(params){
    const result = await axios.post(api.spend.del,params);
    return result.data;
}

export async function save(params){
    const result = await axios.post(api.spend.save,params);
    return result.data;
}
//out
export async function out(params){
    const result = await axios.post(api.spend.out,params);
    return result.data;
}
export async function getUploadToken(params){
    const result = await axios.postForUrl(api.spend.getUploadToken,params);
    return result;
}
//getMonth submitAddSame
export async function getMonth(params){
    const result = await axios.postForUrl(api.spend.getMonth,params);
    return result;
}
export async function submitAddSame(params){
    const result = await axios.postForUrl(api.spend.submitAddSame,params);
    return result;
}