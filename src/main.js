import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import apolloProvider from "./apollo";

new Vue({
	el: "#app",
	router,
	// Inject apolloProvider for components to use.
	provide: apolloProvider.provide(),
	render: h => h(App)
});
