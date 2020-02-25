import Vue from "vue";
import VueRouter from "vue-router";
import AllUsers from "./components/users/index";
import ShowUser from "./components/users/show";
import AllPosts from "./components/posts/index";
import ShowPost from "./components/posts/show";

Vue.use(VueRouter);

const routes = [
	{
		path: "/user",
		component: AllUsers,
		name: "users"
	},
	{
		path: "/user/:id",
		component: ShowUser,
		name: "user"
	},
	{
		path: "/posts",
		component: AllPosts,
		name: "posts"
	},
	{
		path: "/post/:id",
		component: ShowPost,
		name: "post"
	}
];

const router = new VueRouter({
	mode: "history",
	routes // short for `routes: routes`
});

export default router;
