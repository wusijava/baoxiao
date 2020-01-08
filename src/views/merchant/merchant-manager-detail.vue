<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>商户管理</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'merchantList'}">商户列表</BreadcrumbItem>
            <BreadcrumbItem>商户详情</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right" v-if="edit == 1" @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="商户信息" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" v-if="edit == 0">
                                        <p>渠道编码<span>{{detail.wayId}}</span></p>
                                        <p>收款账号<span>{{detail.sellerNo}}</span></p>
                                        <p>收款人名称<span>{{detail.name}}</span></p>
                                        <p>联系人<span>{{detail.contactName}}</span></p>
                                        <p>联系电话<span>{{detail.contactPhone}}</span></p>
                                        <p>门店名称<span>{{detail.storeName}}</span></p>
                                        <p>门店编号<span>{{detail.storeNo}}</span></p>
                                        <p>营业执照名称<span>{{detail.storeSubjectName}}</span></p>
                                        <p>营业执照编码<span>{{detail.storeSubjectCertNo}}</span></p>
                                        <p>门店省<span>{{detail.storeProvince}}</span></p>
                                        <p>门店市<span>{{detail.storeCity}}</span></p>
                                        <p>门店区<span>{{detail.storeCounty}}</span></p>
                                    </div>
                                    <div class="detailsInfo" v-if="edit == 1">
                                        <p>渠道编码<span><Input type="text" v-model="detail.wayId" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>收款账号<span><Input type="text" v-model="detail.sellerNo" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>收款人名称<span><Input type="text" v-model="detail.name" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>联系人<span><Input type="text" v-model="detail.contactName" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>联系电话<span><Input type="text" v-model="detail.contactPhone" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>门店名称<span><Input type="text" v-model="detail.storeName" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>门店编号<span><Input type="text" v-model="detail.storeNo"
                                                              size="small" style="width: 250px"/></span></p>
                                        <p>营业执照名称<span><Input type="text" v-model="detail.storeSubjectName" size="small"
                                                                style="width: 250px"/></span></p>
                                        <p>营业执照编码<span><Input type="text" v-model="detail.storeSubjectCertNo" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>门店省<span><Input type="text" v-model="detail.storeProvince" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>门店市<span><Input type="text" v-model="detail.storeCity" size="small"
                                                           style="width: 250px"/></span></p>
                                        <p>门店区<span><Input type="text" v-model="detail.storeCounty" size="small"
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
        name: "merchantDetail",
        data() {
            return {
                detail:{},
                edit:0,
            }
        },
        mounted() {
            this.getDetail();
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
                if (query.id == null || query.id == undefined){
                    return;
                }
                const result = await detail(query)
                if (result.code == 20000) {
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