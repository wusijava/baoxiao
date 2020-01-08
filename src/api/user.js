import axios from '../config/axios'
import api from './'

export async function login(params){
    const result = await axios.post(api.user.login,params);
    return result;
}

export async function permissionList(params){
    const result = await axios.post(api.user.permissionList,params);
    return result.data;
}

export async function changePassword(params){
    const result = await axios.post(api.user.changePassword,params);
    return result.data;
}

