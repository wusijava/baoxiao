<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>结算管理</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'settlementDetail'}">红包结算</BreadcrumbItem>
            <BreadcrumbItem>红包详情</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Button type="primary">导出</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toSettlement(row)">不结算</Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>

            <Modal
                :closable="false"
                v-model="settlementModal"
                title="结算操作"
                @on-ok="settlement">
                <p>该红包是否不予结算？</p>
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
                        title: '订单编号',
                        key: 'name'
                    },
                    {
                        title: '套餐金额',
                        key: 'sellerNo'
                    },
                    {
                        title: '结算金额',
                        key: 'contactName'
                    },
                    {
                        title: '捆绑周期',
                        key: 'contactPhone'
                    },{
                        title: '红包金额',
                        key: 'contactName'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center'
                    }
                ],
                list: [],
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