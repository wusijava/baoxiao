import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.meal.list,params);
    return result.data;
}

export async function detail(params){
    const result = await axios.post(api.meal.detail,params);
    return result.data;
}

export async function update(params){
    const result = await axios.post(api.meal.update,params);
    return result.data;
}

export async function updateDetail(params){
    const result = await axios.post(api.meal.updateDetail,params);
    return result.data;
}