<template>
	<p>
		<input
			type="text"
			v-model="search"
			@input="searchPosts"
		>
		<ul
			v-for="post in posts.data"
			:key="post.id"
		>
			<li>
				<router-link :to="{name:'post', params: {id: post.id}}">{{post.title}}</router-link>
				<span>{{post.comments_count}}</span>
			</li>
		</ul>
		<pagination
			:total-pages="posts.paginatorInfo.lastPage"
			:total="posts.paginatorInfo.total"
			:per-page="posts.paginatorInfo.perPage"
			:current-page="posts.paginatorInfo.currentPage"
			@pagechanged="onPageChange"
		/>
	</p>
</template>

<script>
import gql from "graphql-tag";
import Pagination from "../ui/Pagination";
import POSTS_ALL from "../../graphql/posts/Index";

export default {
	components: {
		Pagination
	},
	data() {
		return {
			posts: null,
			page: 1,
			search: null
		};
	},

	apollo: {
		allPosts() {
			return {
				query: POSTS_ALL,
				variables: {
					page: this.page,
					where: this.whereCondition
				},
				update: data => (this.posts = data.allPosts)
			};
		}
	},

	computed: {
		whereCondition() {
			return this.search != null && this.search != ""
				? {
						column: "TITLE",
						operator: "CONTAINS",
						value: this.search
				  }
				: null;
		}
	},

	methods: {
		onPageChange(page) {
			this.page = page;
			this.$apollo.queries.allPosts.fetchMore({
				variables: {
					page: this.page,
					where: this.whereCondition
				},
				// Transform the previous result with new data
				updateQuery: (previousResult, { fetchMoreResult }) => {
					const newPosts = fetchMoreResult.allPosts.data;
					return {
						allPosts: {
							__typename: previousResult.allPosts.__typename,
							data: [...newPosts],
							paginatorInfo:
								fetchMoreResult.allPosts.paginatorInfo
						}
					};
				}
			});
		},

		searchPosts() {
			this.$apollo
				.query({
					query: POSTS_ALL,
					variables: {
						page: 1,
						where: this.whereCondition
					}
				})
				.then(response => (this.posts = response.data.allPosts));
		}
	}
};
</script>
