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

export async function updateMerchant(params){
    const result = await axios.post(api.merchant.updateMerchant,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.merchant.batchExport, params)
    return result.data;
}

export async function getAreaListByLevelOrParentCode(params){
    const result = await axios.post(api.merchant.getAreaListByLevelOrParentCode, params)
    return result.data;
}