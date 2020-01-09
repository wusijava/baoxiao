<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>新增报销记录</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'merchantList'}">报销列表</BreadcrumbItem>
            <BreadcrumbItem>报销详情</BreadcrumbItem>
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
                                        <p>商品名称<span>{{detail.productName}}</span></p>
                                        <p>商品总价<span>{{detail.totalPrice}}</span></p>
                                        <p>购买渠道<span>{{detail.buyChannel}}</span></p>
                                        <p>购买日期<span>{{detail.buyDate}}</span></p>

                                        <p>备注<span>{{detail.remark}}</span></p>
                                    </div>
                                    <div class="detailsInfo" v-if="edit == 1">
                                        <p>商品名称<span><Input type="text" v-model="detail.productName" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>商品总价<span><Input type="text" v-model="detail.totalPrice" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>购买渠道<span><Input type="text" v-model="detail.buyChannel" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>购买日期<span><Input type="text" v-model="detail.buyDate" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>上交单据时间<span><Input type="text" v-model="detail.reimbursementDate" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>报销到账时间<span><Input type="text" v-model="detail.remitDate" size="small"
                                                                style="width: 250px"/></span></p>
                                        <p>状态<span><Input type="text" v-model="detail.state"
                                                          size="small" style="width: 250px"/></span></p>
                                        <p>备注<span><Input type="text" v-model="detail.remark" size="small"
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
    import {detail,updateMerchant} from "../../api/merchant";
    export default {
        name: "Add",
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