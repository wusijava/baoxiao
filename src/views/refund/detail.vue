<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>淘宝记账</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'sellLog'}">销售记录</BreadcrumbItem>
            <BreadcrumbItem>销售详情</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right" v-if="edit == 1" @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="报销信息" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" v-if="edit == 0">
                                        <p>商品名称<span>{{detail.product}}</span></p>
                                        <p>买家姓名<span>{{detail.buyerName}}</span></p>
                                        <p>销售订单号<span>{{detail.myOrderNo}}</span></p>
                                        <p>销售金额<span>{{detail.sellMoney}}</span></p>
                                        <p>购买订单号<span>{{detail.amyOrderNo}}</span></p>
                                        <p>购买金额<span>{{detail.buyMoney}}</span></p>
                                        <p>利润<span>{{detail.profit}}</span></p>
                                        <p>退款金额<span>{{detail.refund}}</span></p>
                                        <p>备注<span>{{detail.remark}}</span></p>
                                        <p>购买日期<span>{{detail.orderDate}}</span></p>
                                    </div>
                                    <div class="detailsInfo" v-if="edit == 1">
                                        <p>商品名称<span><Input type="text" v-model="detail.product" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>买家姓名<span><Input type="text" v-model="detail.buyerName" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>销售订单号<span><Input type="text" v-model="detail.myOrderNo" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>销售金额<span><Input type="text" v-model="detail.sellMoney" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>购买订单号<span><Input type="text" v-model="detail.amyOrderNo" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>购买金额<span><Input type="text" v-model="detail.buyMoney" size="small"
                                                                style="width: 250px"/></span></p>
                                        <p>利润<span><Input type="text" v-model="detail.profit"
                                                          size="small" style="width: 250px"/></span></p>
                                        <p>退款金额<span><Input type="text" v-model="detail.refund" size="small"
                                                          style="width: 250px"/></span></p>
                                        <p>备注<span><Input type="text" v-model="detail.remark" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>购买日期<span><Input type="text" v-model="detail.orderDate" size="small"
                                                            style="width: 250px"/></span></p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import {detail,updateLog} from "../../api/refund";
    export default {
        name: "logDetail",
        data() {
            return {
                detail:{},
                edit:0,
            }
        },
        mounted() {
            this.getDetail();
            console.log()
        },
        methods: {
            toEdit: async function () {
                this.edit =1;
            },
            save: async function () {
                let query = this.detail;
                const result = await updateMerchant(query)
                if (result.code == 20000) {
                    this.$Message.success("修改成功")
                    this.getDetail();
                    this.edit =0;
                }else {
                    this.$Message.error(result.msg);
                }
            },
            getDetail: async function () {
                let query = new Object()
                query.id = this.$route.query.id;
                console.log(query.id)
                if (query.id == null || query.id == undefined){
                    return;
                }
                const result = await detail(query)
                if (result.code == 20000) {
                    console.log(2)
                    this.detail = result.data;
                }
            },
            save: async function () {
                let query = this.detail;
                const result = await updateLog(query)
                if (result.code == 20000) {
                    this.$Message.success("修改成功")
                    this.getDetail();
                    this.edit =0;
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
            .tab-right
                position absolute
                right 40px
                top 90px
                z-index 99
            .content
                border 1px solid #ccc
                border-top none
                margin-top -17px
                .box-left
                    padding 20px
                    height 700px
                    h4
                        font-size 16px
                        color #666
                        margin-bottom 10px
                    .imgView img
                        width auto
                        height auto
                        max-width 100%
                        max-height 600px

                .box-right
                    /*padding 30px 0*/
                    margin-left 20px
                    padding-bottom 10px
                    h4
                        font-size 16px
                        color #666
                        margin-bottom 20px
                    .detailsInfo
                        p
                            font-size 14px
                            line-height 27px
                            text-align left
                        span
                            float right
                            text-align right

</style>