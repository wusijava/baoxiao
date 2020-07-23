const method = {
    merchant:{
        list: '/productList',
        detail: '/toDetails',
        update: '/update',
        batchExport: '/Export',
        batchImport: '/Import',
        save: '/save',
        del: '/del',
        down:"/fileDownload",
        getCount: "/countReimbursement"

    },
    spend:{
        list:'/spendList',
        detail:'/spendDetail',
        spendUpdate:'/spendUpdate',
        del: '/spendDel',
        save: '/saveSpend',
        out: '/out',
        getUploadToken:"upload/getToken",
        getMonth: "spendMonth",
        submitAddSame: "/submitAddSame"
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
        logDetail:'/logDetail',
        updateLog:'/updateLog',
        settle:'/api/web/pay/refund/order/settle',
        batchExport:'/api/web/pay/refund/order/batchExport',
        save:'order/save',
        del:"order/del",
        countProfit: "/countProfit"
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
        list:'/logList',
        refundApply: '/api/web/pay/refund/apply/refundApply',
        refundByPerson: '/api/web/pay/refund/apply/refundByPerson',
        refundByAuto: '/api/web/pay/refund/apply/refundByAuto',
        update: '/api/web/pay/refund/apply/update',
        urgent: '/api/web/pay/refund/apply/urgent',
        batchExport: '/logExport',
        selectRefundCount: '/api/web/pay/refund/apply/selectRefundCount',
    },
}
export default method;