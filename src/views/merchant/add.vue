<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>新增报销记录</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'merchantList'}">报销列表</BreadcrumbItem>
            <BreadcrumbItem>报销详情</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right"  @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="报销信息" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" >
                                        <p>商品名称<span><Input type="text" v-model="detail.productName" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>商品总价<span><Input type="text" v-model="detail.totalPrice" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p>购买渠道<span><Select v-model="detail.buyChannel" clearable style="width: 250px; margin-right: 10px" placeholder="选择购买渠道">
                                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select></span></p>
                                        <p style="height: 200px">购买日期<DatePicker type="date" v-model="detail.buyDate" style="width: 200px" placeholder="选择购买日期"></DatePicker></p>
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
    import {detail,save} from "../../api/merchant";
    import moment from 'moment';
    export default {
        name: "Add",
        data() {
            return {
                detail:{},
                edit:0,
                stateList: [
                    {value:'淘宝',label:'淘宝'},
                    {value:'京东',label:'京东'},
                    {value:'线下',label:'线下'},
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
                if (this.detail.buyDate != '') {
                    //console.log(date)

                    //为什么moment后面的非要写成this.detail.date 不然不会成功赋值
                    this.detail.buyDate = moment(this.detail.buyDate).format('YYYY-MM-DD')

                }
                let query = this.detail;
                const result = await save(query)
                if (result.code == 20000) {
                    this.$Message.success("添加成功！")
                    this.$router.push({path: '/merchant/list'})
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