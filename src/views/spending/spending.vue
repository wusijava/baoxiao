<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>家庭记账</BreadcrumbItem>
            <BreadcrumbItem>家庭开支</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.item" placeholder="费用名称" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="消费时间范围"></DatePicker>
                <Select v-model="query.consumer" clearable style="width: 150px; margin-right: 10px" placeholder="消费者">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
               <!-- <Button type="primary" @click="batchExport">导出报表</Button>&nbsp;-->&nbsp;
                <Button type="primary" @click="add">新增消费记录</Button>&nbsp;
                <Button type="primary" @click="out">导出Excel</Button>&nbsp;

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



    </div>
</template>

<script>
    import moment from 'moment'
    import storage from '../../storage'
    import {list,out,del} from "../../api/spend";
    import axios from "../../config/axios";
    import batchImportUrl from "../../api/index";

    export default {
        name: "spend",
        data() {
            return {
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '消费明细',
                        key: 'item',
                        width: 200
                    },
                    {
                        title: '支出',
                        key: 'price',
                        width: 410,
                        align: 'center'
                    },
                    {
                        title: '消费人',
                        key: 'consumer',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '消费时间',
                        key: 'date',
                        width: 200
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 200
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }

                ],
                list: [],
                stateList: [
                    {value:'吴思',label:'吴思'},
                    {value:'张明霞',label:'张明霞'},
                    {value:'吴艺橙',label:'吴艺橙'},
                    {value:'小力',label:'小力'},
                    {value:'家庭',label:'家庭'},
                    {value:'其他',label:'其他'},
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
            toDetail(row){
                this.$router.push({path: '/spend/detail', query: {id: row.id}})
            },
            add(){
                this.$router.push({path: '/spend/add'})
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
                if (this.query.item){
                    query.item = this.query.item;
                }
                if (this.query.consumer){
                    query.consumer = this.query.consumer;
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

            out: async function () {
                let query = new Object()
                if (this.query.item){
                    query.item = this.query.item;
                }

                if (this.query.consumer){
                    query.consumer = this.query.consumer;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await out(query)
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