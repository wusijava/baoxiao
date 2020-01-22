<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>家庭记账</BreadcrumbItem>
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
                                        <p style="height:50px">消费明细<span><Input type="text" v-model="detail.item" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p style="height:50px">支出<span><Input type="text" v-model="detail.price" size="small"
                                                            style="width: 250px"/></span></p>
                                        <p style="height:200px">消费者<span><Select v-model="detail.consumer" clearable style="width: 250px; margin-right: 10px" placeholder="消费者">
                                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select></span></p>
                                        <p></p>
                                        <p style="height: 200px">消费日期<DatePicker type="date" v-model="detail.date" style="width: 200px" placeholder="选择消费时间"></DatePicker></p>
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
    import moment from 'moment';
    export default {
        name: "spendAdd",
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
        },
        methods: {
            toEdit: async function () {
                this.edit =1;
            },
            save: async function () {
                if (this.detail.date != '') {
                    //为什么非要写成this.detail.date
                    this.detail.date = moment(this.detail.date).format('YYYY-MM-DD')

                }

                let query =this.detail;
                //console.log("1"+query.date)

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
                   // console.log(2)
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