<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>退款管理</BreadcrumbItem>
            <BreadcrumbItem>退款记录</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.name" placeholder="输入订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.sellerNo" placeholder="输入外部订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="请选择发起时间"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择退款状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list"></Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

    </div>
</template>

<script>
    import moment from 'moment'
    import storage from '../../storage'
    import {list,batchExport,getAreaListByLevelOrParentCode} from "../../api/merchant";
    import axios from "../../config/axios";
    import batchImportUrl from "../../api/index";

    export default {
        name: "refund-record-list",
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
                        title: '订单编号',
                        key: 'wayId'
                    },
                    {
                        title: '外部订单编号',
                        key: 'wayId'
                    },
                    {
                        title: '渠道编号',
                        key: 'wayId'
                    },
                    {
                        title: '发起时间',
                        key: 'merchantNo'
                    },
                    {
                        title: '退款方式',
                        key: 'name'
                    },
                    {
                        title: '退款金额',
                        key: 'sellerNo'
                    },
                    {
                        title: '转账金额',
                        key: 'contactName'
                    },
                    {
                        title: '转账时间',
                        key: 'contactPhone'
                    },
                    {
                        title: '退款状态',
                        key: 'contactPhone',
                    }
                ],
                list: [],
                stateList: [
                    {value:'',label:'全部状态'},
                    {value:'-1',label:'注册失败'},
                    {value:'0',label:'等待注册'},
                    {value:'1',label:'注册成功'},
                ],
                areaList: [
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query:{

                },
                importModal:false,
                importData:false,
                tip: '',
                header:{authorization:storage.get('login_token')},
                importUrl:axios.getBaseUrl()+batchImportUrl.merchant.batchImport,
            }
        },
        mounted() {
             this.getList(this.page.currentPage, this.page.count);
             this.getAreaListByLevelOrParentCode();
        },
        methods: {
            showImport() {
                this.importModal = true;
            },
            hideImport(){
                this.importModal = false;
            },
            toDetail(row){
                this.$router.push({path: '/merchant/detail', query: {id: row.id}})
            },
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
                if (this.query.name){
                    query.name = this.query.name;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.storeCityCode){
                    query.storeCityCode = this.query.storeCityCode;
                }
                if (this.query.state){
                    query.state = this.query.state;
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
            getAreaListByLevelOrParentCode: async function() {
                let query = new Object();
                query.level = 2;
                const result = await getAreaListByLevelOrParentCode(query);
                if (result.code == 20000) {
                    this.areaList = result.data;
                }
            },
            batchExport: async function () {
                let query = new Object()
                if (this.query.name){
                    query.name = this.query.name;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.storeCityCode){
                    query.storeCityCode = this.query.storeCityCode;
                }
                if (this.query.state){
                    query.state = this.query.state;
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
            batchImport(response) {
                if (response.code == 20000) {
                    this.$Message.success("导入成功")
                    this.hideImport();
                    location.href = response.data;
                } else {
                    this.$Message.error(response.msg)
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