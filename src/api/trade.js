import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.trade.list,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.trade.batchExport,params);
    return result.data;
}

export async function settle(params){
    const result = await axios.post(api.trade.settle,params);
    return result.data;
}

export async function refund(params){
    const result = await axios.post(api.trade.refund,params);
    return result.data;
}

export async function getAreaListByLevelOrParentCode(params){
    const result = await axios.post(api.trade.getAreaListByLevelOrParentCode,params);
    return result.data;
}