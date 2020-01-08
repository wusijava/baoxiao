<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>退款管理</BreadcrumbItem>
            <BreadcrumbItem>退款列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.outTradeNo" placeholder="输入订单号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.outOrderNo" placeholder="输入外部订单号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
               <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 150px" placeholder="请选择时间"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.refundState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择操作状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="batchExport">导出</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.refundState==0" @click="refund(row)" >退款</Button>
                        <!--<Button type="primary" size="small" style="margin-right: 5px" v-if="row.refundState==-1">重新退款</Button>-->
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.refundState==0" @click="toCancel(row)">取消 </Button>
                        <!--<Button disabled size="small" style="margin-right: 5px">退款完成</Button>-->
                        <Button type="error" size="small" style="margin-right: 5px" v-if="row.urgentState==0&&row.refundState==2"  @click="urgent(row)">申请加急</Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <!--取消退款-->
            <Modal v-model="cancelRefundModal" title="操作提醒">
                <p>确定是否取消退款？</p>
                <div slot="footer">
                    <!--<Button @click="reject">驳回</Button>-->
                    <Button type="default" @click="cancelRefundModal = false">取消</Button>
                    <Button type="primary" @click="cancel">确定</Button>
                </div>
            </Modal>
            <!-- 自动退款 -->
            <modal v-model="automaticRefundModal" :mask-closable="false" :footer-hide="true">
                <h1 style="text-align: center;line-height: 34px">请打开支付宝扫一扫付款</h1>
                <div class="code" v-if="url">
                    <QrCode
                            :width="290"
                            :height="232"
                            :url="url"
                    />
                </div>
                <h2 style="text-align: center">付款金额{{refundInfo.transferAmount}}元</h2>
                <p style="text-align: center;line-height: 24px">转账完成之后系统将自动解冻顾客冻结资金</p>
            </modal>
            <!-- 人工退款 -->
            <modal v-model="artificiaRefundModal" :mask-closable="false"   :loading="modalLoading">
                <h1 style="text-align: center;line-height: 40px">请打开支付宝进行转账</h1>
                <h2 style="text-align: center;line-height: 40px">转账支付宝账号：133123456789</h2>
                <h2 style="text-align: center;line-height: 40px">转账金额{{refundInfo.transferAmount}}元</h2>
                <p style="text-align: center;line-height: 22px;width: 450px;padding-left: 50px;margin-bottom: 20px">转账完成之后请复制流水单号填写至下方文本框内并点击提交，客服人员将会在
                    72小时内完成退款解冻操作，处理退款时间9:00-20:00</p>
                <Form :model="formItem" :label-width="80">
                    <FormItem>
                        <Input v-model="formItem.alipayTransferOrderNo" placeholder="请输入支付宝转账流水单号" style="width: 320px"/>
                    </FormItem>
                    <FormItem>
                        <Input v-model="formItem.alipayName" placeholder="请输入转账支付宝实名" style="width: 320px"/>
                    </FormItem>
                    <FormItem>
                        <Input v-model="formItem.alipayAccount" placeholder="请输入转账支付宝账号" style="width: 320px"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="submitRefund">提交退款申请</Button>
                </div>
            </modal>
        </div>

    </div>
</template>

<script>
    import moment from 'moment';
    import QrCode from "../../components/QrCode";
    import {list,refundByPerson,urgent,update,batchExport} from "../../api/refundApply";

    export default {
        name: "refund-list",
        data() {
            return {
                url:null,
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '订单编号',
                        key: 'outTradeNo',
                        width:200,
                    },
                    {
                        title: '订单金额',
                        key: 'amount',
                        align: 'center',
                        width:150,
                    },
                    {
                        title: '红包金额',
                        key: 'redPackAmount',
                        width:150,
                    },
                    {
                        title: '红包领取状态',
                        key: 'redPackStateDesc',
                        width:150,
                    },
                    {
                        title: '退款金额',
                        key: 'transferAmount',
                        width:100,
                    },
                    {
                        title: '交易时间',
                        key: 'dealTime',
                        width:200,
                    },
                    {
                        title: '退款方式',
                        key: 'refundTypeDesc',
                        width:150,
                    },
                    {
                        title: '加急状态',
                        key: 'urgentStateDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '退款状态',
                        key: 'refundStateDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'reason',
                        width: 150,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                    },
                ],
                refundCount:"",
                refundInfo:{},
                list: [],
                stateList: [
                    {value:'',label:'全部状态'},
                    {value:'0',label:'等待支付'},
                    {value:'-1',label:'退款失败'},
                    {value:'1',label:'退款成功'},
                    {value:'2',label:'退款中'},
                    {value:'3',label:'取消退款'},
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query:{},
                automaticRefundModal: false,
                artificiaRefundModal: false,
                cancelRefundModal: false,
                formItem: {
                    alipayTransferOrderNo: '',
                    alipayName:'',
                    alipayAccount:''
                }
            }
        },
        components:{
            QrCode
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
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.refundState){
                    query.refundState = this.query.refundState;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            refund(row){
                this.refundInfo=row;

                if(row.refundType==0){
                    this.automaticRefundModal = true
                }else if (row.refundType==1){
                    this.artificiaRefundModal = true
                }
            },
            toCancel(row){
                this.refundInfo=row;
                this.cancelRefundModal=true
            },
            async cancel() {
                //取消
                let obj =new Object();
                obj.outTradeNo=this.refundInfo.outTradeNo
                obj.refundState=3
                update(obj).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("退款已取消")
                        this.cancelRefundModal = false
                        this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            async  submitRefund() {
                if(!this.formItem.alipayTransferOrderNo){
                    this.$Message.error('请填写支付宝转账流水单号');
                    this.cancelLoading();
                    return;
                }
                if(!this.formItem.alipayAccount){
                    this.$Message.error('请填写支付宝实名');
                    this.cancelLoading();
                    return;
                }
                if(!this.formItem.alipayName){
                    this.$Message.error('请填写支付宝账号');
                    this.cancelLoading();
                    return;
                }
                 let obj = this.formItem;
                obj.outTradeNo=this.refundInfo.outTradeNo;
                obj.refundState=2
                refundByPerson(obj).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("添加支付宝信息成功，请等待管理员审核")
                        this.getList(this.page.currentPage, this.page.count)
                        this.cancelLoading()
                        this.artificiaRefundModal=false
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            async urgent(row){
                let outTradeNo=row.outTradeNo;
                urgent({"outTradeNo":outTradeNo}).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("加急成功，请耐心等待")
                        this.artificiaRefundModal=false
                        this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            batchExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.refundState){
                    query.refundState = this.query.refundState;
                }
                if (this.query.redPackState){
                    query.redPackState = this.query.redPackState;
                }
                if (this.query.repaymentState){
                    query.repaymentState = this.query.repaymentState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await batchExport(query)
                if (result.code == 20000) {
                    location.href = result.data;
                }else {
                    this.$Message.error(result.msg);
                }
            },
            cancelLoading(){
                this.modalLoading = false
                setTimeout(() =>{
                    this.$nextTick(() =>{
                        this.modalLoading = true
                    })
                },100)
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