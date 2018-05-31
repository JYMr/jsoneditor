// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.use(ElementUI);
Vue.config.productionTip = false

const instance = axios.create();

/**
*axios 全局 拦截器
*用于token验证返回跳转
*网络错误提示
*/
instance.interceptors.response.use(function (response) {
	//Token 非法时，重新登录
	if(response.data.status == -2){
		return response;
	}else{
		return response;	
	}
}, function (error) {
	console.log('axios request error: ' + error);
	return Promise.reject(error);
});

//注入axios
Vue.prototype.$axios = instance;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
