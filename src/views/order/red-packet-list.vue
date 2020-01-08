<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>红包列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.outTradeNo" placeholder="输入订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.outOrderNo" placeholder="输入外部订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.receiveNo" placeholder="输入支付宝账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择交易状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="packetExport">导出</Button>&nbsp;&nbsp;

            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {list,packetExport} from "../../api/packet";

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
                        title: '红包金额',
                        key: 'amount',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '渠道编码',
                        key: 'wayId',
                        width: 250,
                        align: 'center'
                    },
                    {
                        title: '到账账号',
                        key: 'receiveNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '领取时间',
                        key: 'createTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '领取状态',
                        key: 'stateDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '原因',
                        key: 'reason',
                        width: 200,
                        tooltip: true,
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
                        value: '1',
                        label: '领取成功'
                    },
                    {
                        value: '0',
                        label: '等待领取'
                    },
                    {
                        value: '-1',
                        label: '领取失败'
                    }
                ],
                query:{
                },
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
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
                if (this.query.receiveNo){
                    query.receiveNo = this.query.receiveNo;
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
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            packetExport: async function () {
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
                if (this.query.receiveNo){
                    query.receiveNo = this.query.receiveNo;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await packetExport(query)
                if (result.code == 20000) {
                    location.href = result.data;
                }else {
                    this.$Message.error(result.msg);
                }
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