<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>淘宝记账</BreadcrumbItem>
            <BreadcrumbItem>销售记录</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.myOrderNo" placeholder="输入销售订单号" style="width: 150px" @on-clear="beginSearch(0)"/>
                <Input clearable v-model="query.buyerName" placeholder="买家姓名" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.amyOrderNo" placeholder="输入购买订单号" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.product" placeholder="输入商品名称" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 150px" placeholder="订单时间范围"></DatePicker>&nbsp;&nbsp;
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="batchExport">导出Excel</Button>&nbsp;&nbsp;
                <Button type="primary" @click="add">新增销售记录</Button>&nbsp;
                <a style="font-size:20px;color:red">2020年 :{{this.count.no}}元 &nbsp; 本月利润 RMB:{{this.count.ing}}元&nbsp;  本年利润 RMB:{{this.count.yes}}元</a>
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toDetail(row)" >详情</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toDel(row)" >删除</Button>

                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <!--删除提示-->
            <Modal v-model="cancelRefundModal" title="操作提醒">
                <p>确定删除？</p>
                <div slot="footer">
                    <Button type="default" @click="cancelRefundModal = false">取消</Button>
                    <Button type="primary" @click="submitDel">确定</Button>
                </div>
            </Modal>
        </div>

    </div>

</template>

<script>
    import moment from 'moment'
    import {list,batchExport,update,del,countProfit} from "../../api/refundApply";

    export default {
        name: "orderAdd",
        data() {
            return {
                dateRange: [],
                count: {no:'',
                    ing: '',
                    yes: ''},
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'product',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '买家姓名',
                        key: 'buyerName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '销售订单号',
                        key: 'myOrderNo',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '销售金额',
                        key: 'sellMoney',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '购买订单号',
                        key: 'amyOrderNo',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '购买金额',
                        key: 'buyMoney',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '利润',
                        key: 'profit',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '退款',
                        key: 'refund',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'orderDate',
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
                delInfo: {},
                loading:true,
                confirmModal:false,
                confirmTitle:"",
                confirmContent:"",
                row:null,
                cancelRefundModal : false,
            }
        },
        mounted() {
             this.getList(this.page.currentPage, this.page.count);
             this.countProfit();
        },

        methods: {
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            toDetail(row){
                this.$router.push({path: '/refundRecord/detail', query: {id: row.id}})
                console.log(row.id)
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.myOrderNo){
                    query.myOrderNo = this.query.myOrderNo;
                }
                if (this.query.amyOrderNo){
                    query.amyOrderNo = this.query.amyOrderNo;
                }
                if (this.query.product){
                    query.product = this.query.product;
                }
                if (this.query.buyerName){
                    query.buyerName = this.query.buyerName;
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
            add(){
                this.$router.push({path: '/order/add'})
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
                if (this.query.myOrderNo){
                    query.myOrderNo = this.query.myOrderNo;
                }
                if (this.query.amyOrderNo){
                    query.amyOrderNo = this.query.amyOrderNo;
                }
                if (this.query.product){
                    query.product = this.query.product;
                }
                if (this.query.buyerName){
                    query.buyerName = this.query.buyerName;
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
            toDel:function (row) {
                this.delInfo=row;
                this.cancelRefundModal = true
            },
            submitDel:function (){
                let obj = new Object();
                obj.id=this.delInfo.id;
                del(obj).then(result => {
                    if (result.code == 20000) {
                        this.$Message.success(`${result.data}`)
                        this.cancelRefundModal = false
                        this.getList(this.page.currentPage, this.page.count)
                    } else {
                        this.$Message.error(`${result.data}`)
                    }
                })
            },
            countProfit: async function () {
            const result = await countProfit();
            console.log(result.data);
            if (result.code == 20000) {
                console.log(result.data.productName)
                this.count.no = result.data.remark;
                this.count.ing = result.data.buyChannel;
                this.count.yes = result.data.productName;
            }
        }
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