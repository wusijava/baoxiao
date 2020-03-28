import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.refundApply.list,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.refundApply.batchExport,params);
    return result.data;
}
export async function refundApply(params){
    const result = await axios.post(api.refundApply.refundApply,params);
    return result.data;
}
export async function refundByAuto(params){
    const result = await axios.post(api.refundApply.refundByAuto,params);
    return result.data;
}
export async function refundByPerson(params){
    const result = await axios.post(api.refundApply.refundByPerson,params);
    return result.data;
}
export async function update(params){
    const result = await axios.post(api.refundApply.update,params);
    return result.data;
}
export async function urgent(params){
    const result = await axios.post(api.refundApply.urgent,params);
    return result.data;
}
export async function selectRefundCount(params){
    const result = await axios.post(api.refundApply.selectRefundCount,params);
    return result.data;
}
export async function save(params){
    const result = await axios.post(api.refund.save,params);
    return result.data;
}
export async function del(params){
    const result = await axios.post(api.refund.del,params);
    return result.data;
}
export async function countProfit(params){
    const result = await axios.post(api.refund.countProfit,params);
    return result.data;
}