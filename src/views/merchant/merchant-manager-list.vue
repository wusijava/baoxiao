<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>商户管理</BreadcrumbItem>
            <BreadcrumbItem>商户列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.name" placeholder="输入收款人" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.sellerNo" placeholder="输入收款账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="请选择注册时间"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择注册状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.storeCityCode" clearable style="width: 150px; margin-right: 10px" placeholder="请选择地区">
                    <Option v-for="item in areaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="batchExport">导出</Button>&nbsp;&nbsp;
                <Button type="primary" @click="showImport">导入</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toDetail(row)" >详情</Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
        <Modal v-model="importModal" title="导入商户信息" :mask-closable="false" footer-hide @on-cancel="hideImport">
            <Upload ref="upload" :action="importUrl"
                    :format="['xls','xlsx']" :headers="header" :on-success="batchImport">
                <Button type="primary" icon="md-cloud-upload">导入商户信息</Button>
            </Upload>
            <div style="text-align: right" v-show="importData">{{tip}}</div>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment'
    import storage from '../../storage'
    import {list,batchExport,getAreaListByLevelOrParentCode} from "../../api/merchant";
    import axios from "../../config/axios";
    import batchImportUrl from "../../api/index";

    export default {
        name: "merchant-list",
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
                        title: '渠道编码',
                        key: 'wayId',
                        width: 150
                    },
                    {
                        title: '商户号',
                        key: 'merchantNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '收款人',
                        key: 'name',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '收款账号',
                        key: 'sellerNo',
                        width: 200
                    },
                    {
                        title: '联系人',
                        key: 'contactName',
                        width: 100
                    },
                    {
                        title: '联系电话',
                        key: 'contactPhone',
                        width: 150
                    },
                    {
                        title: '门店编码',
                        key: 'storeNo',
                        width: 200,
                    },
                    {
                        title: '门店名称',
                        key: 'storeName',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '营业执照名称',
                        key: 'storeSubjectName',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '营业执照编号',
                        key: 'storeSubjectCertNo',
                        width: 200
                    },
                    {
                        title: '省',
                        key: 'storeProvince',
                        width: 100
                    },
                    {
                        title: '市',
                        key: 'storeCity',
                        width: 100
                    },
                    {
                        title: '区',
                        key: 'storeCounty',
                        width: 100
                    },
                    {
                        title: '当前状态',
                        key: 'stateStr',
                        width: 100
                    },
                    {
                        title: '红包领取状态',
                        key: 'redPackState',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        width: 150
                    },
                    {
                        title: '原因',
                        key: 'reason',
                        width: 200,
                        tooltip: true
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