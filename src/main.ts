import {createApp} from 'vue'
import '@/style.css';
import "@/utils/extend";
import 'tailwindcss/tailwind.css';
import '@/assets/fonts/iconfont.css';

import App from './App.vue'
import router from './router';
import {createPinia} from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus';
import {ElIcon} from 'element-plus';

import 'element-plus/dist/index.css';
// 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/index.css';
import {
    ActionSheet, AddressEdit, AddressList, Area,
    Button,
    Card, Cell, CellGroup, Checkbox, CheckboxGroup, Col, ContactCard, ContactEdit, ContactList,
    CountDown, CouponCell, CouponList,
    Divider, Field, Form,
    Grid,
    GridItem,
    Loading, NavBar, Popup, Radio, RadioGroup, Row, Search, Sidebar, SidebarItem, Stepper, SubmitBar,
    Swipe,
    SwipeItem, Tab,
    Tabbar,
    TabbarItem, Tabs,
    Toast, Dialog, Notify, ImagePreview,
    ActionBar, ActionBarIcon, ActionBarButton,
    BackTop,
    PullRefresh,
    List,
    Image,
    Icon,
    Space,
    Barrage, Tag, Uploader,
    Calendar,
    DatePicker,
    Signature,
    ShareSheet,
    TextEllipsis,
    FloatingPanel,
    DropdownMenu,
    DropdownItem,
    Slider, Switch, Progress, Picker
} from 'vant';

import 'vant/lib/index.css';
import "vant/es/toast/style";
// 使用 es 目录导入语言包
import locale from 'element-plus/es/locale/lang/zh-cn';

const app = createApp(App);
// element-plus
app.use(ElementPlus, {locale});
// 全局注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.use(pinia);
app.use(router);

app.use(Toast);
app.use(Dialog);
app.use(Notify);
app.use(ImagePreview);
// Tabbar底部
app.use(Tabbar);
app.use(TabbarItem);
// loading组件
app.use(Loading);
// 轮播组件
app.use(Swipe);
app.use(SwipeItem);
// 栅栏宫格
app.use(Grid);
app.use(GridItem);
// icon图标
app.use(Icon);
// panel面板
// app.use(Panel);
// 倒计时
app.use(CountDown);
// 分割线
app.use(Divider);
// // image
// app.use(Image);
// 商品卡片
app.use(Card);
// 按钮
app.use(Button);
// 导航栏
app.use(NavBar);
// 上拉菜单
app.use(ActionSheet);
// 布局
app.use(Cell).use(CellGroup).use(Col).use(Row);
// tab标签
app.use(Tab).use(Tabs);
// 表单
app.use(Form).use(Field);
// 复选框
app.use(Checkbox).use(CheckboxGroup);
// 提交栏
app.use(SubmitBar);
// 步进器
app.use(Stepper);
// 联系人卡片
app.use(ContactCard).use(ContactList).use(ContactEdit);
// 收货人地址
app.use(AddressList).use(AddressEdit);
// 省市区选择
app.use(Area);
// 单选框
app.use(RadioGroup).use(Radio);
// 弹出层
app.use(Popup);
// 优惠券
app.use(CouponCell).use(CouponList);
// 商品搜索
app.use(Search);
// 边框
app.use(Sidebar).use(SidebarItem);
// 下拉搜索
app.use(PullRefresh);
// 列表组件
app.use(List);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
// 回到顶部
app.use(BackTop);
app.use(Image);
app.use(Space);
// 弹幕
app.use(Barrage);
// 标签
app.use(Tag);
// 上传组件
app.use(Uploader);
// 使用日历组件
app.use(Calendar);
// 使用日期组件
app.use(DatePicker);
// 使用签名组件
app.use(Signature);
// 分享sheet
app.use(ShareSheet);
// 文本省略
app.use(TextEllipsis);
// 浮动面板
app.use(FloatingPanel);
// 向下弹出的菜单列表
app.use(DropdownMenu);
// 向下弹出的菜单列表
app.use(DropdownItem);
// 增加滑块
app.use(Slider);
// Switch 开关
app.use(Switch);
// Progress 进度条
app.use(Progress);
// 选择框
app.use(Picker);

app.mount('#app');
