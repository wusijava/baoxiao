<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>淘宝记账</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'sellLog'}">销售记录</BreadcrumbItem>
            <BreadcrumbItem>添加销售记录</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" class="tab-right" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" class="tab-right"  @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="订单信息" name="a" tab="tab">
                    <div class="content">
             <!--           <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" v-model="detail">
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
                                        &lt;!&ndash; <modal width="650px" v-model="artificiaRefundModal" :mask-closable="false">&ndash;&gt;
                                        <h3 style="text-align: center;margin-bottom: 20px">点击方框上传消费截图</h3>
                                        <div style="display: flex;justify-content: center;align-items: center;height: 80px;">
                                            <Upload
                                                    :before-upload="beforeReada"
                                                    v-model="alipays"
                                                    style="text-align: center"
                                                    action="#"
                                                    :show-upload-list="false"
                                            >
                                                <div style="width: 100px;height:80px;border:1px solid #ccc;text-align: center;line-height: 80px">
                                                    <img :src="alipays" alt="" style="width: 100%;height:100%">
                                                    &lt;!&ndash;<span>点击上传图片</span>&ndash;&gt;
                                                    &lt;!&ndash;<Icon type="md-add" size="20" v-if="iconShows"></Icon>&ndash;&gt;
                                                </div>
                                            </Upload>
                                            <img src="../../assets/demo.jpg"
                                                 style="width:100px;height:80px;margin-left: 20px;"
                                                 @click="photoModal = true"
                                            />

                                        </div>
                                        &lt;!&ndash;</modal>&ndash;&gt;
                                        &lt;!&ndash;放大图片&ndash;&gt;
                                        <Modal v-model="photoModal" :footer-hide="true" title="示例图片">
                                            <div style="padding: 0 10px">
                                                <img src="../../assets/demo.jpg"/>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </Col>
                        </Row>-->
                        <Form :model="formItem" style="text-align: center">
                            <FormItem>
                                商品名称:<Input v-model="formItem.product" placeholder="请输入商品名称"
                                       style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                买家姓名:<Input v-model="formItem.buyerName" placeholder="请输入买家姓名" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                销售订单号:<Input v-model="formItem.myOrderNo" placeholder="请输入销售订单号" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                销售金额	:<Input v-model="formItem.sellMoney" placeholder="请输入销售金额" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                购买订单号:<Input v-model="formItem.amyOrderNo" placeholder="请输入购买订单号" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                购买金额	:<Input v-model="formItem.buyMoney" placeholder="请输入购买金额" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                利润:<Input v-model="formItem.profit" placeholder="请输入利润" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                              退款:<Input v-model="formItem.refund" placeholder="请输入退款金额" style="width: 320px"/>
                            </FormItem>
                            <p style="height: 200px">交易日期<DatePicker type="date" v-model="formItem.orderDate" style="width: 200px" placeholder="选择交易时间"></DatePicker></p>
                            <FormItem>
                                备注: <Input v-model="formItem.remark" placeholder="输入备注" style="width: 320px"/>
                            </FormItem>
                        </Form>
                        <h3 style="text-align: center;margin-bottom: 20px">点击上传订单截图</h3>
                        <div style="display: flex;justify-content: center;align-items: center;height: 80px;">
                            <Upload
                                    :before-upload="beforeReada"
                                    v-model="alipays"
                                    style="text-align: center"
                                    action="#"
                                    :show-upload-list="false"
                            >
                                <div style="width: 100px;height:80px;border:1px solid #ccc;text-align: center;line-height: 80px">
                                    <img :src="alipays" alt="" style="width: 100%;height:100%">
                                    <Icon type="md-add" size="20" v-if="iconShows"></Icon>
                                </div>
                            </Upload>
                            <img src="../../assets/demo.jpg"
                                 style="width:100px;height:80px;margin-left: 20px;"
                                 @click="photoModal = true"
                            />
                        </div>

                    </div>

                </TabPane>
            </Tabs>
        </div>
        <!--放大图片-->
        <Modal v-model="photoModal" :footer-hide="true" title="图片">
            <div style="padding: 0 50px">
                <img src="../../assets/demo.jpg"/>
            </div>
        </Modal>
    </div>


</template>

<script>
    import {getUploadToken} from "../../api/spend";
    import {detail,save} from "../../api/refundApply";
    import moment from 'moment';
    import * as qiniu from 'qiniu-js';
    export default {
        name: "spendAdd",
        data() {
            return {
                detail:{},
                edit:0,
                photoModal:false,
                iconShows: true,
                alipays: '',
                url:'',
                formItem: {
                    product: '',
                    buyerName: '',
                    myOrderNo: '',
                    sellMoney:'',
                    amyOrderNo:'',
                    buyMoney:'',
                    profit:'',
                    remark:'',
                    orderDate:'',
                    url:'',


                },
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
                if (this.formItem.orderDate != '') {
                    //为什么非要写成this.detail.date
                    this.formItem.orderDate = moment(this.formItem.orderDate).format('YYYY-MM-DD')

                }

                let query =this.formItem;
                query.url=this.alipays;

                const result = await save(query)
                if (result.code == 20000) {
                    this.$Message.success("添加成功！")
                    this.$router.push({path: '/refundRecord/list'})
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
            async beforeReada(file) {
                if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/bmp') {
                    this.$Message.info('请上传正确的图片格式');
                    return false;
                }
                if (file.size > 2097152) {
                    this.$Message.info('请上传小于2M大小图片');
                    return false;
                }
                //this.iconShows = false
                //console.log("2")
                // 此时可以自行将文件上传至服务器
                let data = await this.getUploadToken("alipays");
                console.log("2")
                if (data) {
                    let url = data.host + data.key;
                    //console.log(data.host)
                    this.uploadToQiniu(file, data.token, data.key, url, "alipays");
                }
                return false;
            },
            async getUploadToken(type) {
                let result = await getUploadToken({type: type});
               // console.log("3")
                let data = result.data;
                if (data.code == "20000") {
                    console.log("4")
                    return data.data;
                } else {
                    console.log("5")
                    this.$dialog.alert({
                        message: data.msg,
                    });
                }
            },
            async uploadToQiniu(file, token, key, url, type) {
                console.log("6")
                let config = {
                    useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    /*region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域*/
                };
                let putExtra = {
                    fname: file.name,  //文件原文件名
                    params: {}, //用来放置自定义变量
                    mimeType: null  //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                };
                let observable = qiniu.upload(file, key, token, putExtra, config);
                console.log("7")
                observable.subscribe({

                    next: (result) => {
                        // 主要用来展示进度
                    },
                    error: (errResult) => {
                        // 失败报错信息
                    },
                    complete: (result) => {
                        // 接收成功后返回的信息

                        this[type] = url;
                        console.log("222222"+url)

                    }
                })
            }
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