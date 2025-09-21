import './bootstrap';


import { createApp } from 'vue';

import Login from './Login.vue'


const app = createApp();
app.component('login', Login);
app.mount('#app');

