<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>家庭记账</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'spend'}">家庭开支</BreadcrumbItem>
            <BreadcrumbItem>开支明细</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right" v-if="edit == 1" @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="开支明细" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" v-if="edit == 0">
                                        <p>消费明细<span>{{detail.item}}</span></p>
                                        <p>支出<span>{{detail.price}}</span></p>
                                        <p>消费者<span>{{detail.consumer}}</span></p>
                                        <p>消费日期<span>{{detail.date}}</span></p>
                                        <p>备注<span>{{detail.remark}}</span></p>
                                    </div>
                                    <div class="detailsInfo" v-if="edit == 1">
                                        <p>消费明细<span><Input type="text" v-model="detail.item" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>支出<span><Input type="text" v-model="detail.price" size="small"
                                                            style="width: 250px"/></span></p>

                                        <p>消费者<span><Input type="text" v-model="detail.consumer" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>消费日期<span><Input type="text" v-model="detail.date" size="small"
                                                              style="width: 250px"/></span></p>
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
    import {detail,spendUpdate} from "../../api/spend";
    export default {
        name: "spenddetail",
        data() {
            return {
                detail:{},
                edit:0,
                stateList: [
                    {value:'吴思',label:'吴思'},
                    {value:'张明霞',label:'张明霞'},
                    {value:'吴艺橙',label:'吴艺橙'},
                    {value:'小力',label:'小力'},
                    {value:'家庭',label:'家庭'},
                    {value:'其他',label:'其他'},
                ],
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
                const result = await spendUpdate(query)
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