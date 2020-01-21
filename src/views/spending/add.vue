<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>新增消费记录</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'spend'}">家庭开支</BreadcrumbItem>
            <BreadcrumbItem>添加消费信息</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right"  @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="消息信息" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" >
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
    import {detail,save} from "../../api/spend";
    export default {
        name: "spendAdd",
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
                const result = await save(query)
                if (result.code == 20000) {
                    this.$Message.success("添加成功！")
                    this.$router.push({path: '/spend/list'})
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