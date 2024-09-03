import { createApp } from 'vue';

const PlateauAttaque = () => import('./views/PlateauAttaque.vue');
import './assets/plateauAttaque/RFIDReadersAttaque.css';

createApp(PlateauAttaque).mount('#app');
