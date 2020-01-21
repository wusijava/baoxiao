<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>交易列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.outTradeNo" placeholder="输入订单号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.outOrderNo" placeholder="输入外部订单号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.phoneNumber" placeholder="输入办理手机号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="datetimerange" v-model="dateRange" style="width: 150px"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择交易状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.dealState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择操作状态">
                    <Option v-for="item in settleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="exports">导出</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <!--<Button size="small" style="margin-right: 5px" @click="toDetail(row)" >详情</Button>-->
                        <Button type="primary" size="small"  style="margin-right: 5px" v-if="row.state!=3&&row.state!=2&&row.overTimeState!=1" @click="apply(row)">申请退款</Button>
                        <!--<Button type="primary" size="small" style="margin-right: 10px;background-color: darkgray;color: white;border: none"  >已申请</Button>-->

                        <!--<Button type="primary" size="small" v-if="refundState!=0" style="margin-right: 5px" @click="apply(row)">申请退款</Button>-->
                        <!--<Button type="primary" size="small" v-if="refundState!=0" style="margin-right: 5px" @click="apply(row)">申请退款</Button>-->
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <Modal v-model="refundModal" title="操作提醒">
                <h3 style="text-align: center;line-height: 34px">请选择退款方式</h3>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" @click="automaticRefundBtn"  >自动退款</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" @click="artificiaRefundBtn">人工退款</Button>
                </div>
            </Modal>

            <Modal v-model="applyModal" title="操作提醒">
                <h3 style="text-align: center;line-height: 34px">请选择退款方式</h3>
                <p style="text-align: center; color: red;line-height: 30px">注：由于之前有人工退款记录，故不能选择自动退款</p>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" @click="automaticRefundBtn" :disabled="true" >自动退款</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" @click="artificiaRefundBtn">人工退款</Button>
                </div>
            </Modal>

            <Modal v-model="automaticRefundModal" title="自动退款">
                <h2 style="text-align: center;line-height: 34px">需转金额   {{((refundinfo.amount-0)+(redAmount-0))*1.01}} </h2>
                <p style="text-align: center;line-height: 24px">直降金额   {{refundinfo.amount}} 元</p>
                <p style="text-align: center;line-height: 24px">红包金额   {{redAmount}} 元</p>
                <p style="text-align: center;line-height: 24px">手续费   {{((refundinfo.amount-0)+(redAmount-0))*0.01}} 元</p>
                <p style="text-align: center; color: red;line-height: 30px">注：实时退款包含1%手续费</p>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" size="large"  @click="automaticRefund">确定</Button>
                </div>
            </Modal>

            <Modal v-model="artificiaRefundModal" title="人工退款" @click="artificiaRefund">
                <h2 style="text-align: center">需转金额   {{(refundinfo.amount-0)+(redAmount-0)}} </h2>
                <p style="text-align: center;line-height: 24px">直降金额   {{refundinfo.amount}} 元</p>
                <p style="text-align: center;line-height: 24px">红包金额   {{redAmount}} 元</p>
                <p style="text-align: center; color: red;line-height: 30px">注：人工退款申请提交后客服将会在72小时内处理，处理时间为：9:00-20:00</p>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" size="large" style="width: 100px" @click="artificiaRefund">确定</Button>
                </div>
            </Modal>

            <modal v-model="selectExport" width="550px"  :mask-closable="false">
                <p slot="header" style="color:#000000;text-align:center">
                    是否对以下敏感字段进行加密
                </p>
                <CheckboxGroup  v-model="hidden" @on-change="checkAllGroupChange" style="height: 50px;text-align: center;margin-top: 25px">
                    <Checkbox label="hiddenPhone" style="margin-right: 60px">办理手机号</Checkbox>
                    <Checkbox label="hiddenSellerNo" style="margin-right: 60px">收款账户</Checkbox>
                    <Checkbox label="hiddenSellerName" style="margin-right: 20px">收款人</Checkbox>
                </CheckboxGroup>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" size="large" style="width: 100px" @click="batchExport">确定</Button>
                </div>
            </modal>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {list,batchExport} from "../../api/spend";
    import {refundApply,selectRefundCount} from "../../api/refundApply";
    export default {
        name: "trade-list",
        data() {
            return {
                hiddenPhone:false,
                hiddenSellerNo:false,
                hiddenSellerName:false,
                selectExport:false,
                hidden:['hiddenPhone','hiddenSellerNo','hiddenSellerName'],
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '门店名称',
                        key: 'storeName',
                        width: 200,
                        tooltip: true,
                        align: 'center'
                    },
                    {
                        title: '渠道编码',
                        key: 'wayId',
                        width: 150
                    },
                    {
                        title: '订单号',
                        key: 'outTradeNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '授权订单号',
                        key: 'authNo',
                        width: 250,
                        align: 'center'
                    },
                    {
                        title: '外部订单号',
                        key: 'outOrderNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '套餐金额',
                        key: 'amount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '结算金额',
                        key: 'settleAmount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '办理手机',
                        key: 'phoneNumber',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '捆绑期数',
                        key: 'num',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '套餐标题',
                        key: 'title',
                        width: 200,
                        tooltip: true,
                        align: 'center'
                    },
                    {
                        title: '收款账号',
                        key: 'sellerNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '收款人',
                        key: 'name',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '红包金额',
                        key: 'redPacketAmount',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '红包领取状态',
                        key: 'redPacketStateDesc',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包结算类型',
                        key: 'redPacketTypeDesc',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包领取账号',
                        key: 'redPacketSellerNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'createTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'finishTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '当前状态',
                        key: 'dealStateStr',
                        width: 100,
                        render: (h, params) => {
                            return h('Tooltip', {
                                props: { placement: 'top',transfer: true }
                            }, [
                                params.row.dealStateStr,
                                h('div', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },
                                    [h('p',params.row.reason)])
                            ])
                        }
                    },
                    {
                        title: '订单状态',
                        key: 'stateStr',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                list: [],
                stateList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '0',
                        label: '等待支付'
                    },
                    {
                        value: '1',
                        label: '交易成功'
                    },
                    {
                        value: '2',
                        label: '交易退款'
                    },
                    {
                        value: '-1',
                        label: '交易关闭'
                    },
                    {
                        value: '3',
                        label: '退款中'
                    }
                ],
                settleList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '4',
                        label: '等待通知'
                    },
                    {
                        value: '0',
                        label: '通知失败'
                    },
                    {
                        value: '2',
                        label: '等待打款'
                    },
                    {
                        value: '1',
                        label: '打款失败'
                    },
                    {
                        value: '3',
                        label: '当天签约'
                    },
                    {
                        value: '5',
                        label: '打款成功'
                    },
                    {
                        value: '6',
                        label: '还款成功'
                    },
                ],
                refundinfo:{},
                redAmount:"",
                query:{
                },
                loading:true,
                confirmModal:false,
                confirmTitle:"",
                confirmContent:"",
                type:null,
                row:null,
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                applyModal:false,
                refundModal: false,
                automaticRefundModal: false,
                artificiaRefundModal: false
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
        },
        methods: {
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.dealState){
                    query.dealState = this.query.dealState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.phoneNumber){
                    query.phoneNumber = this.query.phoneNumber;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            checkAllGroupChange(data){
                for(let i=0;i<this.hidden.length;i++){
                    let name = this.hidden[i];
                    this.query[name] = true;
                }

            },
            exports(){
                this.selectExport = true
            },
            batchExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.dealState){
                    query.dealState = this.query.dealState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                for(let i=0;i<this.hidden.length;i++){
                    let name = this.hidden[i];
                    query[name] = true;
                }
                console.log(query)
                const result = await batchExport(query)
                if (result.code == 20000) {
                    location.href = result.data;
                    this.selectExport = false;
                }else {
                    this.$Message.error(result.msg);
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            automaticRefundBtn() {
                this.refundModal = false
                this.automaticRefundModal = true
            },
            artificiaRefundBtn() {
                this.refundModal = false
                this.applyModal=false
                this.artificiaRefundModal = true
            },
            async apply(row){
                this.refundinfo=row;
                selectRefundCount({"outTradeNo":this.refundinfo.outTradeNo}).then(result=>{
                    if(result.data >=1){
                        this.applyModal=true;
                    }else {
                        this.refundModal = true;
                    }
                })
                if (this.refundinfo.redPacketStateDesc=="未领取"){
                    this.redAmount="0";
                }else{
                    this.redAmount=this.refundinfo.redPacketAmount
                }
                console.log(this.refundCount)
            },
            async automaticRefund() {
                //自动
                let refund = this.refundinfo;
                refund.refundType=0;
                this.$delete(refund,'_index')
                this.$delete(refund,'_rowKey')
                refundApply(refund).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("退款已申请，亲前往退款列表付款")
                        this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
                this.automaticRefundModal=false;
                console.log(this.refundinfo)
            },
            async artificiaRefund() {
                //人工
                let refund = this.refundinfo;
                refund.refundType=1;
                this.$delete(refund,'_index')
                this.$delete(refund,'_rowKey')
                refundApply(refund).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("退款已申请，亲前往退款列表付款")
                         this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
                this.artificiaRefundModal= false
            },

        }
    }
</script>

<style lang="stylus" scoped>
    .box
        width 100%
        .form-box
            margin 20px
            .list
                margin-top 20px
                .image-style
                    width 100px
                    height 80px
                    margin 5px
                    .image-item
                        width 100%
                        height 100%
                        border-radius 5px
            .Page
                text-align: center
                padding: 20px
</style>