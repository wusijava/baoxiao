<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>报销管理</BreadcrumbItem>
            <BreadcrumbItem>报销列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.productName" placeholder="输入商品名称" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="购买时间范围"></DatePicker>
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="报销状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="batchExport">导出报表</Button>&nbsp;&nbsp;
                <Button type="primary" @click="showImport">导入数据</Button>&nbsp;&nbsp;
                <Button type="primary" @click="add">新增报销记录</Button>&nbsp;
                <Button type="primary" @click="down">下载导入模板</Button>
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toDetail(row)" >详情</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click="del(row)" >删除</Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
        <Modal v-model="importModal" title="导入报销信息" :mask-closable="false" footer-hide @on-cancel="hideImport">
            <Upload ref="upload" :action="importUrl"
                    :format="['xls','xlsx']" :headers="header" :on-success="batchImport">
                <Button type="primary" icon="md-cloud-upload">导入报销信息</Button>
            </Upload>
            <div style="text-align: right" v-show="importData">{{tip}}</div>
        </Modal>


    </div>
</template>

<script>
    import moment from 'moment'
    import storage from '../../storage'
    import {list,batchExport,del} from "../../api/merchant";
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
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'productName',
                        width: 450
                    },
                    {
                        title: '总价格',
                        key: 'totalPrice',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '购买渠道',
                        key: 'buyChannel',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '购买时间',
                        key: 'buyDate',
                        width: 150
                    },
                    {
                        title: '上交报销单时间',
                        key: 'reimbursementDate',
                        width: 150
                    },
                    {
                        title: '报销到账时间',
                        key: 'remitDate',
                        width: 150
                    },
                    {
                        title: '报销状态',
                        key: 'state',
                        width: 100,
                    },
                    {
                        title: '备注',
                        key: 'remark',
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
                    {value:'-1',label:'未报销'},
                    {value:'0',label:'报销中'},
                    {value:'1',label:'已报销'},
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query: {
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
            add(){
                this.$router.push({path: '/merchant/add'})
            },
            down:async function() {
                location.href = "http://49.233.192.222:8083/fileDownload";
               /* const result = await down();
                if (result.code == 20000) {

                }else {
                    this.$Message.error(result.msg);
                }*/
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
                if (this.query.productName){
                    query.productName = this.query.productName;
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

            batchExport: async function () {
                let query = new Object()
                if (this.query.productName){
                    query.productName = this.query.productName;
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
                    this.getList(this.page.currentPage, this.page.count);
                    this.$Message.success("导入成功")
                    this.hideImport();
                } else {
                    this.$Message.error(response.msg)
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },del:async function(row){
                let query = new Object()
                query.id =row.id;
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<p>您即将删除一条信息!</p><p>请您确认当前操作</p>',
                    loading: true,
                    onOk: () => {
                       del(query);
                        this.$Modal.remove();

                            this.$Message.success("删除成功!")
                        this.getList(this.page.currentPage, this.page.count);

                    },
                })
                console.log(666)
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