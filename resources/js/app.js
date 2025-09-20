import './bootstrap';


import { createApp } from 'vue';

import Login from './components/v1/Login.vue'
import Register from './components/v1/Register.vue'
import Profile from './components/v1/Profile.vue'
import Workspace from './components/v1/Workspace.vue'
 

const app = createApp();

app.component('login', Login);
app.component('register', Register);
app.component('workspace', Workspace);
app.component('profile', Profile);

app.mount('#app');
