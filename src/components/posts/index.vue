<template>
	<div style="width:720px;margin:auto;">
		<select
			@change="searchPosts"
			v-model="first"
		>
			<option value="10">10</option>
			<option value="25">25</option>
			<option value="50">50</option>
			<option value="100">100</option>
		</select>
		<input
			type="text"
			v-model="search"
			@input="searchPosts"
			placeholder="Search by title ..."
		>
		<div style="margin-top:1rem;">
			<table style="margin:auto;">
				<thead>
					<th>
						<div style="display: flex;align-items: center;">
							<a
								href="#"
								@click.prevent="sortBy('id')"
								role="button"
							>ID
							</a>
							<sort-icon
								:sort-field="sortField"
								field="id"
								:dir="sortAsc"
							></sort-icon>
						</div>
					<th>
						<div style="display: flex;align-items: center;justify-content:center">
							<a
								href="#"
								@click.prevent="sortBy('title')"
								role="button"
							>Post Title
							</a>
							<sort-icon
								:sort-field="sortField"
								field="title"
								:dir="sortAsc"
							></sort-icon>
						</div>
					</th>
					<th>
						Total Comments
					</th>
				</thead>
				<tbody>
					<tr
						v-for="post in posts.data"
						:key="post.id"
					>
						<td>{{post.id}}</td>
						<td>
							<router-link
								:to="{name:'post', params: {id: post.id}}"
								v-html="highlightedTitle(post.title)"
							></router-link>
						</td>
						<td>
							{{post.comments_count}}
						</td>
					</tr>
				</tbody>
			</table>
			<div style="display:flex;align-items:center;justify-content:between;">
				<pagination
					:total-pages="posts.paginatorInfo.lastPage"
					:total="posts.paginatorInfo.total"
					:per-page="posts.paginatorInfo.perPage"
					:current-page="posts.paginatorInfo.currentPage"
					@pagechanged="onPageChange"
				/>
				<small>
					Showing {{ posts.paginatorInfo.firstItem }} to {{ posts.paginatorInfo.lastItem }} out of {{ posts.paginatorInfo.total }} results
				</small>
			</div>
		</div>
	</div>
</template>

<script>
import gql from "graphql-tag";
import Pagination from "../ui/Pagination";
import SortIcon from "../ui/SortIcon";
import POSTS_ALL from "../../graphql/posts/Index";

export default {
	components: {
		Pagination,
		SortIcon
	},
	data() {
		return {
			posts: null,
			page: 1,
			search: null,
			first: 10,
			sortField: "title",
			sortAsc: true
		};
	},

	apollo: {
		allPosts() {
			return {
				query: POSTS_ALL,
				variables: {
					page: this.page,
					first: this.first,
					where: this.whereCondition,
					order: this.orderByCondition
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
		},
		orderByCondition() {
			return this.sortField != null && this.sortField != ""
				? [
						{
							field: this.sortField,
							order: this.sortAsc == true ? "ASC" : "DESC"
						}
				  ]
				: null;
		}
	},

	methods: {
		sortBy(field) {
			this.sortField = field;
			this.sortAsc = this.sortAsc ? false : true;
			this.searchPosts();
		},
		highlightedTitle(title) {
			return this.search != null && this.search != ""
				? title.replace(
						`${this.search}`,
						`<span style="background-color:yellow;">${this.search}</span>`
				  )
				: title;
		},
		onPageChange(page) {
			this.page = page;
			this.$apollo.queries.allPosts.fetchMore({
				variables: {
					page: this.page,
					first: this.first,
					where: this.whereCondition,
					order: this.orderByCondition
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
						first: this.first,
						where: this.whereCondition,
						order: this.orderByCondition
					}
				})
				.then(response => (this.posts = response.data.allPosts));
		}
	}
};
</script>
