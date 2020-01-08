<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>结算管理</BreadcrumbItem>
            <BreadcrumbItem>红包结算</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.name" placeholder="输入收款人" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.sellerNo" placeholder="输入收款账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择结算周期">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="请选择时间段"></DatePicker>&nbsp;&nbsp;
                <Button type="primary" @click="beginSearch(0)">核算</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button size="small" style="margin-right: 5px" @click="toDetail(row)">详情</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toSettlement(row)">结算</Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <Modal
                :closable="false"
                v-model="settlementModal"
                title="操作提醒"
                @on-ok="settlement">

                <Row style="line-height: 24px;">
                    <Col span="9" style="text-align: right">
                        <h5>结算人姓名：</h5>
                        <h5>结算账号：</h5>
                        <h5>结算时间段：</h5>
                        <h5>结算红包数：</h5>
                        <h5>结算总金额：</h5>
                        <h5>打款账号：</h5>
                    </Col>
                    <Col span="15">
                        <p>{{settlementInfo.contactName}}</p>
                        <p>125894416544</p>
                        <p>125894416544</p>
                        <p>200</p>
                    </Col>
                </Row>

            </Modal>
        </div>

    </div>
</template>

<script>
    import moment from 'moment'
    import {list} from "../../api/merchant";

    export default {
        name: "settlement-list",
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
                        title: '收款人',
                        key: 'name',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '收款账号',
                        key: 'sellerNo',
                        width: 150
                    },
                    {
                        title: '结算人',
                        key: 'contactName',
                        width: 100
                    },
                    {
                        title: '结算账号',
                        key: 'contactPhone',
                        width: 150
                    },{
                        title: '联系人',
                        key: 'contactName',
                        width: 100
                    },
                    {
                        title: '联系人手机',
                        key: 'contactPhone',
                        width: 150
                    },
                    {
                        title: '结算周期',
                        key: 'storeNo',
                    },
                    {
                        title: '上次结算时间',
                        key: 'storeName',
                        tooltip: true
                    },
                    {
                        title: '未结算单数',
                        key: 'storeSubjectName',
                        tooltip: true
                    },
                    {
                        title: '未结算金额',
                        key: 'storeSubjectCertNo'
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
                    {value:'',label:'全部'},
                    {value:'-1',label:'周'},
                    {value:'0',label:'日'},
                    {value:'1',label:'月'},
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query:{},
                settlementModal: false,
                settlementInfo: {}
            }
        },
        mounted() {

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
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            toSettlement(row) {
                this.settlementModal = true
                this.settlementInfo = row
            },
            toDetail(){
                this.$router.push({path: '/redpackSettlement/detail'})
            },
            settlement: async function() {

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