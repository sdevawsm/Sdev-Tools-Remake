import './bootstrap';


import { createApp } from 'vue';

import Register from './components/v1/Register.vue'
import Login from './components/v1/Login.vue'
import Profile from './components/v1/Profile.vue'
import Workspace  from './components/v1/Workspace.vue'


const app = createApp();
app.component('login', Login);
app.component('register', Register);
app.component('profile',  Profile);
app.component('workspace', Workspace);
app.mount('#app');

