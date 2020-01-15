const method = {
    merchant:{
        list: '/productList',
        detail: '/toDetails',
        update: '/update',
        batchExport: '/Export',
        batchImport: '/Import',
        save: '/save',
        del: '/del',
        down:'/ok',
    },
    trade:{
        list:'/api/web/pay/order/list',
        settle:'/api/web/pay/order/settle',
        refund:'/api/web/pay/order/refund',
        batchExport: '/api/web/pay/order/batchExport',
        getAreaListByLevelOrParentCode: '/api/web/area/getAreaListByLevelOrParentCode',
    },
    packet:{
        list:'/api/web/red/packet/list',
        batchExport:'/api/web/red/packet/batchExport',

        configlist:'/api/web/authorize/redpackconfiguration/list',
        configAdd:'/api/web/authorize/redpackconfiguration/insertConfiguration',
        findConfigById:'/api/web/authorize/redpackconfiguration/getConfiguration',
        updateConfig:'/api/web/authorize/redpackconfiguration/updateConfiguration',
        deleteConfig:'/api/web/authorize/redpackconfiguration/deleteConfiguration',
        changeState:'/api/web/authorize/redpackconfiguration/changeState',
        getAreaList:'/api/web/area/areaList',
    },
    refund:{
        list:'/api/web/pay/refund/order/list',
        changeRedPacketState:'/api/web/pay/refund/order/changeRedPacketState',
        changeRepaymentState:'/api/web/pay/refund/order/changeRepaymentState',
        settle:'/api/web/pay/refund/order/settle',
        batchExport:'/api/web/pay/refund/order/batchExport',
    },
    user:{
        login:'/login',
        permissionList:'/list',
        changePassword:'/api/web/user/changePassword',
    },
    blacklist:{
        list:'/api/web/authorize/redpackblacklist/list',
        deleteBlack:'/api/web/authorize/redpackblacklist/deleteBlacklist',
        add:'/api/web/authorize/redpackblacklist/insertBlacklist',
    },
    meal:{
        list:'/api/web/setMeal/list',
        detail:'/api/web/setMeal/detail',
        update:'/api/web/setMeal/update',
        updateDetail:'/api/web/setMeal/updateDetail'
    },
    refundApply:{
        list:'/api/web/pay/refund/apply/list',
        refundApply: '/api/web/pay/refund/apply/refundApply',
        refundByPerson: '/api/web/pay/refund/apply/refundByPerson',
        refundByAuto: '/api/web/pay/refund/apply/refundByAuto',
        update: '/api/web/pay/refund/apply/update',
        urgent: '/api/web/pay/refund/apply/urgent',
        batchExport: '/api/web/pay/refund/apply/batchExport',
        selectRefundCount: '/api/web/pay/refund/apply/selectRefundCount',
    },
}
export default method;