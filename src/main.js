import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import storage from "./storage";
import permissions from './permissions'
import 'iview/dist/styles/iview.css'
Vue.config.productionTip = false


import { Button, Table, Page, Breadcrumb, BreadcrumbItem, Row, Col, Form, FormItem, Input, Upload, Select, Option, Switch, Menu, Submenu,
    MenuItem, Message, Icon, Modal, DropdownMenu,Dropdown,DropdownItem,
    Progress,DatePicker,Tabs,TabPane,Tooltip,Badge,CheckboxGroup,Checkbox,InputNumber} from 'iview';
Vue.component('Button', Button);
Vue.component('Message', Message);
Vue.component('Table', Table);
Vue.component('Page', Page);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Input', Input);
Vue.component('Upload', Upload);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('ISwitch', Switch);
Vue.component('Submenu', Submenu);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Icon', Icon);
Vue.component('Modal', Modal);
Vue.component('DropdownMenu', DropdownMenu );
Vue.component('DropdownItem', DropdownItem );
Vue.component('Dropdown', Dropdown );
Vue.component('Progress', Progress );
Vue.component('DatePicker', DatePicker );
Vue.component('Tabs', Tabs );
Vue.component('TabPane', TabPane );
Vue.component('Tooltip', Tooltip );
Vue.component('Badge',Badge);
Vue.component('CheckboxGroup',CheckboxGroup);
Vue.component('Checkbox',Checkbox);
Vue.component('InputNumber',InputNumber);


Vue.prototype.$Message = Message;

Vue.prototype.$Modal = Modal;

Vue.prototype.$Message.config({
    duration: 2
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

new Vue({
  router, store,
  render: h => h(App)
}).$mount('#app')
