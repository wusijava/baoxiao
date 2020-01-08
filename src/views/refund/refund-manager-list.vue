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
                <DatePicker type="daterange" v-model="dateRange" style="width: 150px" placeholder="请选择发起时间"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.refundState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择退款状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.redPackState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择红包状态">
                    <Option v-for="item in rsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.repaymentState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择垫资状态">
                    <Option v-for="item in rpsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="batchExport">导出</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.refundState==2" @click="toCheck(row)" >审核</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.refundState==2" @click="toReject(row)" >驳回</Button>

                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <Modal v-model="checkModal" title="操作提醒">
                <p>是否解冻金额并结清贷款？</p>
                <div slot="footer">
                    <!--<Button @click="reject">驳回</Button>-->
                    <Button type="primary" @click="submit">确定</Button>
                </div>
            </Modal>

            <Modal v-model="rejectModal" title="操作提醒">
                <Form :model="formItem" :label-width="120">
                    <FormItem label="请输入驳回原因">
                        <Input v-model="formItem.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="驳回原因"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="reject">确定</Button>
                </div>
            </Modal>

            <modal v-model="selectExport" width="550px"  :mask-closable="false">
                <p slot="header" style="color:#000000;text-align:center">
                    是否对以下敏感字段进行加密
                </p>
            </modal>

            <Modal
                    v-model="confirmModal"
                    :loading="loading"
                    :title="confirmTitle"
                    @on-ok="settle"
                    @on-cancel="clearModal">
                <p>{{confirmContent}}</p>
            </Modal>
        </div>

    </div>
</template>

<script>
    import moment from 'moment'
    import {list,batchExport,update} from "../../api/refundApply";

    export default {
        name: "trade-list",
        data() {
            return {
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'outTradeNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '外部订单号',
                        key: 'outOrderNo',
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
                        title: '渠道编码',
                        key: 'wayId',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '发起时间',
                        key: 'createTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '退款时间',
                        key: 'refundTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'dealTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '直降金额',
                        key: 'amount',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '红包金额',
                        key: 'redPackAmount',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '应退金额',
                        key: 'transferAmount',
                        width: 150,
                    },
                    {
                        title: '支付/转账单号',
                        key: 'alipayTransferOrderNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '支付/转账单号',
                        key: 'alipayTransferOrderNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '转账支付宝实名',
                        key: 'alipayName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '转账支付宝账号',
                        key: 'alipayAccount',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包状态',
                        key: 'redPackStateDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '加急状态',
                        key: 'urgentStateDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '退款方式',
                        key: 'refundTypeDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '垫资回款状态',
                        key: 'repaymentStateDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '退款状态',
                        key: 'refundStateDesc',
                        width: 150,
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
                        value: '-1',
                        label: '退款失败'
                    },
                    {
                        value: '1',
                        label: '退款成功'
                    },
                    {
                        value: '2',
                        label: '退款中'
                    },
                    {
                        value: '3',
                        label: '取消退款'
                    },
                ],
                rpsList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '0',
                        label: '无需结清'
                    },
                    {
                        value: '3',
                        label: '回款成功'
                    },
                    {
                        value: '2',
                        label: '等待回款'
                    },
                    {
                        value: '1',
                        label: '结清贷款'
                    }
                ],
                rsList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '已领取'
                    },
                    {
                        value: '0',
                        label: '未领取'
                    },
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                refundInfo:{},
                query:{},
                selectExport: false,
                checkModal: false,
                rejectModal: false,
                formItem: {
                    reason: ''
                },
                loading:true,
                confirmModal:false,
                confirmTitle:"",
                confirmContent:"",
                row:null,
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
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            toCheck(row){
                this.refundInfo=row
                this.checkModal = true
                console.log(this.refundInfo)
            },
            async submit() {
                //确定退款
                let query = new Object()
                query.outTradeNo=this.refundInfo.outTradeNo
                query.refundState=1
                update(query).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("审核通过")
                        this.checkModal = false
                        this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            toReject(row) {
                this.refundInfo=row
                this.rejectModal = true

            },
            async reject() {
                //驳回
                let query =this.formItem
                query.outTradeNo=this.refundInfo.outTradeNo
                query.refundState=-1
                update(query).then(result=>{
                    if(result.code == 20000){
                        this.$Message.success("驳回成功")
                        this.rejectModal = false
                        this.getList(this.page.currentPage, this.page.count)
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            exports(){
                this.selectExport = true
            },
            toConfirm:async function (row) {
                this.confirmModal = true;
                this.row = row;
                this.confirmTitle = "确认结清";
                this.confirmContent = "是否确认结清贷款？";
            },
            clearModal(){
                this.confirmModal = false;
                this.confirmTitle = "";
                this.confirmContent = "";
                this.clearLoading();
                this.$Modal.remove();
                this.row = null;
            },
            clearLoading(){
                this.loading = false;
                this.$nextTick(() => {
                    this.loading = true;
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

            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
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