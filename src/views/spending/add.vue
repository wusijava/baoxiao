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
                                消费明细:<Input v-model="formItem.item" placeholder="请输入消费明细"
                                       style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                                支出:<Input v-model="formItem.price" placeholder="请输入支出金额" style="width: 320px"/>
                            </FormItem>
                            <FormItem>
                            <p style="height:200px">消费者<span><Select v-model="formItem.consumer" clearable style="width: 250px; margin-right: 10px" placeholder="消费者">
                                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select></span></p></FormItem>
                            <p style="height: 200px">消费日期<DatePicker type="date" v-model="formItem.date" style="width: 200px" placeholder="选择消费时间"></DatePicker></p>
                            <FormItem>
                                备注: <Input v-model="formItem.remark" placeholder="输入备注" style="width: 320px"/>
                            </FormItem>
                        </Form>
                        <h3 style="text-align: center;margin-bottom: 20px">点击上传消费截图</h3>
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
    import {detail,save,getUploadToken} from "../../api/spend";
    import moment from 'moment';
    import * as qiniu from 'qiniu-js';
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
                photoModal:false,
                iconShows: true,
                alipays: '',
                url:'',
                formItem: {
                    item: '',
                    price: '',
                    remark: '',
                    consumer:'',
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
                if (!this.formItem.item) {
                    this.$Message.error('请填写消费明细');
                    return;
                }
                if (!this.formItem.price) {
                    this.$Message.error('请填写支出金额');
                    return;
                }
                if (!this.formItem.consumer) {
                    this.$Message.error('请选择消费者');
                    return;
                }
                if (!this.formItem.date) {
                    this.$Message.error('请选择消费时间');
                    return;
                }
                if (this.formItem.date != '') {
                    //为什么非要写成this.detail.date
                    this.formItem.date = moment(this.formItem.date).format('YYYY-MM-DD')

                }

                let query =this.formItem;
                query.url=this.alipays;

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
                    //console.log("4")
                    return data.data;
                } else {
                    //console.log("5")
                    this.$dialog.alert({
                        message: data.msg,
                    });
                }
            },
            async uploadToQiniu(file, token, key, url, type) {
                //console.log("6")
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
                //console.log("7")
                observable.subscribe({

                    next: (result) => {
                        // 主要用来展示进度
                        console.log(result)
                    },
                    error: (errResult) => {
                        // 失败报错信息
                        console.log(errResult)
                    },
                    complete: (result) => {
                        // 接收成功后返回的信息

                        this[type] = url;
                        //console.log("222222"+result)

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