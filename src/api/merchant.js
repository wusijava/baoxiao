import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.merchant.list, params)
    return result.data;
}

export async function detail(params){
    const result = await axios.post(api.merchant.detail,params);
    return result.data;
}

export async function save(params){
    const result = await axios.post(api.merchant.save,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.merchant.batchExport, params)
    return result.data;
}

export async function batchImport(params){
    const result = await axios.post(api.merchant.batchImport, params)
    return result.data;
}

export async function updateMerchant(params){
    const result = await axios.post(api.merchant.update, params)
    return result.data;
}
export async function del(params){
    const result = await axios.post(api.merchant.del, params)
    return result.data;
}
export async function down(params){
    const result = await axios.post(api.merchant.down, params)
    return result.data;
}