<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>商户管理</BreadcrumbItem>
            <BreadcrumbItem>红包配置列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.name" placeholder="输入名称" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择级别">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="edit">新增</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" @click="toEditConfig(row)" style="margin-right: 5px">配置</Button>
                        <Button type="error" size="small" @click="deleteInfo(row)">删除</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

        <Modal :closable="false" :mask-closable="false" v-model="shiftModal" title="新增红包配置" width="800">
            <Form :model="formItem" :label-width="140">
                <FormItem label="级别">
                    <Select v-model="formItem.level" clearable  style="width: 150px; margin-right: 10px" placeholder="请选择红包配置级别"
                            @on-change="selectFn($event)">
                        <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model="formItem.name" placeholder="请输入名称" style="width: 240px" :maxlength="20" v-if="shop"/>
                    <Select v-model="formItem.name" clearable style="width: 150px; margin-right: 10px" placeholder="请选择市"
                            @on-change="selectCity($event)" :label-in-value="true" v-if="city">
                        <!--<Option v-for="item in cityList" :value="item.value" :key="item.value" :label="item.label">{{ item.label }}</Option>-->
                        <Option v-for="item in cityInfo" :value="item.code" :key="item.code" :label="item.name">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="formItem.name" clearable style="width: 150px; margin-right: 10px" placeholder="请选择省"
                            @on-change="selectProvince($event)" :label-in-value="true" v-if="province">
                        <Option v-for="item in provinceInfo" :value="item.code" :key="item.code" :label="item.name">{{ item.name }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="状态">
                    <Select v-model="formItem.status" clearable style="width: 150px; margin-right: 10px" placeholder="请选择状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="红包配置">
                    <Table :columns="columns1" :data="data1">
                        <template slot-scope="{ row,index }" slot="money">
                            <InputNumber :max="100" :min="0" v-model="data1[index].money"></InputNumber>
                        </template>
                    </Table>
                </FormItem>
                <!--<FormItem label="收款名称">-->
                    <!--<Input v-model="formItem.name" placeholder="请输入收款名称" style="width: 240px" :maxlength="20"/>-->
                <!--</FormItem>-->
            </Form>
            <div slot="footer">
                <Button type="default" @click="shiftModal = false">取消</Button>
                <Button type="info" :loading="addLoading" @click="toAdd()">确定</Button>
            </div>
        </Modal>

        <Modal :closable="false" :mask-closable="false" v-model="editModal" title="配置红包" width="800">
            <Form :model="formItemEdit" :label-width="140">
                <FormItem label="级别">
                    <Input v-model="formItemEdit.level" style="width: 240px" :maxlength="20" :disabled="true" v-show="false"/>
                    <Input v-model="formItemEdit.levelnName" style="width: 240px" :maxlength="20" :disabled="true"/>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model="formItemEdit.name" style="width: 240px" :maxlength="20" :disabled="true"/>
                </FormItem>

                <FormItem label="状态" v-show="false">
                    <Input v-model="formItemEdit.status" style="width: 240px" :maxlength="20" :disabled="true" v-show="false"/>
                    <Input v-model="formItemEdit.statusName" style="width: 240px" :maxlength="20" :disabled="true"/>
                </FormItem>

                <FormItem label="红包配置">
                    <Table :columns="columns1" :data="formItemEdit.amountInfo">
                        <template slot-scope="{ row,index }" slot="money">
                            <InputNumber :max="100" :min="0" v-model="formItemEdit.amountInfo[index].money"></InputNumber>
                        </template>
                    </Table>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="editModal = false">取消</Button>
                <Button type="info" :loading="editLoading" @click="toEdit()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {configlist,shiftAdd,findConfigById,updateConfig,deleteConfig,getAreaList,onChangeState} from "../../api/packet";
    import util from '../../util'
    export default {
        name: "redpackconfig",
        data() {
            return {
                addLoading: false,
                editLoading: false,
                shiftModal: false,
                editModal:false,
                province:false,
                city:true,
                shop:false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '级别',
                        key: 'level',
                        align: 'center'
                    },
//                    {
//                        title: '状态',
//                        key: 'status',
////                        width: 200,
//                        align: 'center'
//                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('i-switch', {
                                props: {  //这里可以设置它的属性
                                    type: 'primary',
                                    size: 'large',
                                    value: params.row.status=='开启',
                                },
                                on: { //操作事件
                                    'on-change': (value) => {
                                        this.change(value,params.row.id)
                                    }
                                }
                            }, [
                                h('span', {
                                    slot: 'open',
                                    domProps: {
                                        innerHTML: '开启'
                                    }
                                }),
                                h('span', {
                                    slot: 'close',
                                    domProps: {
                                        innerHTML: '关闭'
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                list: [],
                query:{
                },
                money:0,
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                stateList: [
                    {value:'',label:'全部状态'},
                    {value:'1',label:'门店'},
                    {value:'2',label:'市'},
                    {value:'3',label:'省'},
                ],
                levelList: [
                    {value:'',label:'请选择级别'},
                    {value:'1',label:'门店'},
                    {value:'2',label:'市'},
                    {value:'3',label:'省'},
                ],
                statusList: [
                    {value:'',label:'请选择状态'},
                    {value:'0',label:'关闭'},
                    {value:'1',label:'启用'},
                ],
                formItem: {},
                formItemEdit:{},
                columns1: [
                    {
                        title: '最小值',
                        key: 'min'
                    },
                    {
                        title: '最大值',
                        key: 'max'
                    },
                    {
                        title: '期数',
                        key: 'num'
                    },
                    {
                        title: '红包金额',
                        slot: 'money',
                    }
                ],
                listState:0,
                provinceInfo:[],
                cityInfo:[],
                data1: [
                    {
                        min: 0,
                        max: 800,
                        num: 12,
                        money:0
                    },
                    {
                        min: 800,
                        max: 1000,
                        num: 12,
                        money:0
                    },
                    {
                        min: 1000,
                        max: '',
                        num: 12,
                        money:0
                    },
                    {
                        min: 0,
                        max: 800,
                        num: 24,
                        money:0
                    },
                    {
                        min: 800,
                        max: 1000,
                        num: 24,
                        money:0
                    },
                    {
                        min: 1000,
                        max: '',
                        num: 24,
                        money:0
                    }
                ]
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
            this.getAreaList();
        },
        methods: {
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getAreaList: async function () {
                let query = new Object()
                const result = await getAreaList(query)
                if (result.code == 20000) {
                    this.provinceInfo = result.data.provinceList
                    this.cityInfo = result.data.cityList;
                }
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.name){
                    query.name = this.query.name;
                }
                if(this.query.state){
                    query.level = this.query.state;
                }
                const result = await configlist(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            deleteInfo: async function(row) {
                const param = {
                    id: row.id
                }
                this.$Modal.confirm({
                    title: '操作提醒',
                    content: '<h4>确认删除这条信息吗？</h4>',
                    onOk: async () => {
                        const result = await deleteConfig(param)
                        if(result.code == 20000) {
                            this.$Message.success('删除成功');
                            this.getList(this.page.currentPage, this.page.count)
                        }else{
                            this.$Message.error(`${result.msg}`);
                        }
                    }

                })
            },
            edit: function (){
                this.shiftModal = true
                this.formItem.level = ''
                this.formItem.name = ''
                this.formItem.nameCode = ''
                this.formItem.status = ''
                this.data1.forEach(item =>{
                    item.money = 0
                })
            },

            toAdd: async function() {
                if (util.isEmpty(this.formItem.level)){
                    this.$Message.warning('请选择级别');
                    return;
                }
                if (util.isEmpty(this.formItem.name)) {
                    this.$Message.warning('请输入名称');
                    return;
                }
                if(this.formItem.level == 1){
                    this.formItem.nameCode = this.formItem.name
                }
                if (util.isEmpty(this.formItem.nameCode)) {
                    this.$Message.warning('请输入名称code');
                    return;
                }
                if (util.isEmpty(this.formItem.status)) {
                    this.$Message.warning('请输入状态');
                    return;
                }
                let query = new Object()
                query.name = this.formItem.name
                query.level = this.formItem.level
                query.nameCode = this.formItem.nameCode
                query.status = this.formItem.status
                query.amountInfo = JSON.stringify(this.data1)
                this.addLoading = true;
                console.log('nameCode',this.formItem)
                console.log('nameCode',query)
                const result = await shiftAdd(query)
                if(result.code == 20000) {
                    this.$Message.success('操作成功')
                    this.addLoading = false;
                    this.shiftModal = false;
                    this.getList(this.page.currentPage, this.page.count)
                }else {
                    this.addLoading = false;
                    this.$Message.error(`${result.msg}`)
                }
            },
            toEdit: async function() {
                if (util.isEmpty(this.formItemEdit.level)){
                    this.$Message.warning('请选择级别');
                    return;
                }
                if (util.isEmpty(this.formItemEdit.name)) {
                    this.$Message.warning('请输入名称');
                    return;
                }
                if(this.formItemEdit.level == 1){
                    this.formItemEdit.nameCode = this.formItemEdit.name
                }
                if (util.isEmpty(this.formItemEdit.nameCode)) {
                    this.$Message.warning('请输入名称code');
                    return;
                }
                if (util.isEmpty(this.formItemEdit.status)) {
                    this.$Message.warning('请输入状态');
                    return;
                }
                let query = new Object()
                query.id = this.formItemEdit.id
                query.name = this.formItemEdit.name
                query.level = this.formItemEdit.level
                query.nameCode = this.formItemEdit.nameCode
                query.status = this.formItemEdit.status
                query.amountInfo = JSON.stringify(this.formItemEdit.amountInfo)
                this.editLoading = true;
                const result = await updateConfig(query)
                if(result.code == 20000) {
                    this.$Message.success('修改成功')
                    this.editLoading = false;
                    this.editModal = false;
                    this.getList(this.page.currentPage, this.page.count)
                }else {
                    this.editLoading = false;
                    this.$Message.error(`${result.msg}`)
                }
            },
            selectFn: function(event){
                if(event==1){
                    this.formItem.nameCode = '',
                    this.shop = true,
                    this.city = false,
                    this.province = false;
                }else if(event==2){
                    this.formItem.nameCode = '',
                    this.shop = false,
                    this.city = true,
                    this.province = false;

                }else{
                    this.formItem.nameCode = '',
                    this.shop = false,
                    this.city = false,
                    this.province = true;
                }
            },
            selectCity: function(e){
                console.log('nameCode',e)
                this.formItem.nameCode = e.value;
                this.formItem.name = e.label;
//                let obj = {};
//                obj = this.cityInfo.find((item)=>{
//                    return item.code === e;
//                });
//                this.formItem.name = obj.name
            },
            selectProvince: function(e){
                console.log('nameCode',e)
                this.formItem.nameCode = e.value;
                this.formItem.name = e.label;
            },
            toEditConfig: async function (row) {//修改用户
                this.editModal = true
                this.formItemEdit = {}
                if (row.id == null || row.id == '' || row.id == undefined) {
                    this.$Message.error("操作失败!")
                } else {
                    let query = new Object()
                    query.id = row.id
                    const result = await findConfigById(query);
                    if (result.code == 20000) {
                        this.formItemEdit = result.data
                        this.formItemEdit.level = this.stateList[result.data.level].value;
                        this.formItemEdit.amountInfo = JSON.parse(result.data.amountInfo);
                        if(result.data.level == 1){
                            this.formItemEdit.levelnName = '门店'
                        }else if(result.data.level == 2){
                            this.formItemEdit.levelnName = '市'
                        }else{
                            this.formItemEdit.levelnName = '省'
                        }
                        if(result.data.status == 1){
                            this.formItemEdit.status = this.statusList[2].value
                            this.formItemEdit.statusName = '启用'
                        }else{
                            this.formItemEdit.status = this.statusList[1].value
                            this.formItemEdit.statusName = '关闭'
                        }
                    } else {
                        this.$Message.error("操作失败!")
                        this.editModal = false
                    }
                }

            },
            change (value,id) {
                if(value){
                    this.listState = 1
                }else {
                    this.listState = 0
                }
                this.clickChangeState(this.listState,id)
            },
            clickChangeState: async function(cp, c) {
                let param = new Object();
                param.status = cp;
                param.id=c;
                const result = await onChangeState(param);
                if(result.code == 20000) {
                    this.$Message.info(result.msg);
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