import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uviewPlus, { setConfig } from 'uview-plus'
import {createPinia} from "pinia";
import share from '@/components/common/share.js'
import { useInviteStore } from '@/stores/inviteStore.js';
export function createApp() {
	 
	const app = createSSRApp(App);
	const pinia = createPinia();
	app.use(pinia);
	app.use(uviewPlus)
	app.mixin(share);
	
	return {
		app,
	};
}
