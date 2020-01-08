<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>商户管理</BreadcrumbItem>
            <BreadcrumbItem>结算配置列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.sellerNo" placeholder="输入收款账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.name" placeholder="输入收款账号名称" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Select v-model="query.type" clearable style="width: 150px; margin-right: 10px" placeholder="请选择级别">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="edit">新增</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="error" size="small" @click="deleteInfo(row)">删除</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

        <Modal :closable="false" :mask-closable="false" v-model="shiftModal" title="新增不可领红包收款账号">
            <Form :model="formItem" :label-width="140">
                <FormItem label="收款账号">
                    <Input v-model="formItem.sellerNo" placeholder="请输入收款账号" style="width: 240px" :maxlength="20"/>
                </FormItem>
                <FormItem label="收款名称">
                    <Input v-model="formItem.name" placeholder="请输入收款名称" style="width: 240px" :maxlength="20"/>
                </FormItem>
                <FormItem label="结款类型">
                    <Select v-model="formItem.type" clearable style="width: 150px; margin-right: 10px" placeholder="请选择结款类型">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="shiftModal = false">取消</Button>
                <Button type="info" :loading="addLoading" @click="toEdit()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {list,deleteBlack,shiftAdd} from "../../api/blacklist";
    import util from '../../util'
    export default {
        name: "blacklist",
        data() {
            return {
                addLoading: false,
                shiftModal: false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '收款账号',
                        key: 'sellerNo',
//                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '账号名称',
                        key: 'name',
//                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '结款类型',
                        key: 'type',
//                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
//                        width: 200,
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
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                typeList: [
                    {value:'',label:'请选择状态'},
                    {value:'1',label:'日结'},
                    {value:'2',label:'周结'},
                    {value:'3',label:'月结'},
                ],
                formItem: {}
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
        },
        methods: {
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.name){
                    query.name = this.query.name;
                }
                if(this.query.type){
                    query.type = this.query.type;
                }
                const result = await list(query)
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
                        const result = await deleteBlack(param)
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
                this.formItem.sellerNo = ''
                this.formItem.name = ''
            },

            toEdit: async function() {
                if (!this.formItem || util.isEmpty(this.formItem.sellerNo)) {
                    this.$Message.warning('请输入收款账号');
                    return;
                }
                if (util.isEmpty(this.formItem.name)) {
                    this.$Message.warning('请输入收款名称');
                    return;
                }
                if (util.isEmpty(this.formItem.type)){
                    this.$Message.warning('请选择结款类型');
                    return;
                }
                let query = new Object()
                query.name = this.formItem.name
                query.sellerNo = this.formItem.sellerNo
                query.type = this.formItem.type
                this.addLoading = true;
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