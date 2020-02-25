<template>
	<div>
		<h4>{{ post.title }}</h4>
		<template v-if="comments">
			<div
				v-for="comment in comments.data"
				:key="comment.id"
			>
				<h5>{{ comment.comment }}</h5>
			</div>
			<button
				@click="showMore"
				v-if="showMoreEnabled"
			>Show more</button>
		</template>
		<label for="comment">New comment</label>
		<textarea
			name
			id
			cols="30"
			rows="10"
			v-model="comment"
		></textarea>
		<button
			type="submit"
			@click="createComment"
		>submit</button>
		<!-- {{comments.data}} -->
	</div>
</template>

<script>
import gql from "graphql-tag";
import POST_SHOW from "../../graphql/posts/Show.gql";
import COMMENTS_ALL from "../../graphql/comments/Index.gql";
import COMMENTS_CREATE from "../../graphql/comments/Store.gql";

export default {
	data() {
		return {
			comment: null,
			post: null,
			page: 1,
			comments: null,
			showMoreEnabled: true
		};
	},

	apollo: {
		post() {
			return {
				query: POST_SHOW,
				variables: {
					id: this.$route.params.id
				}
			};
		},

		comments() {
			return {
				query: COMMENTS_ALL,
				variables: {
					page: this.page,
					postId: this.$route.params.id
				}
			};
		}
	},

	methods: {
		createComment() {
			// We save the user input in case of an error
			const newComment = this.comment;
			// We clear it early to give the UI a snappy feel
			this.comment = null;

			// Call to the graphql mutation
			this.$apollo
				.mutate({
					// Query
					mutation: COMMENTS_CREATE,
					// Parameters
					variables: {
						comment: newComment,
						post_id: this.$route.params.id
					},
					// Update the cache with the result
					// The query will be updated with the optimistic response
					// and then with the real result of the mutation
					update: (store, { data: { addComment } }) => {
						// post query
						const postQuery = {
							query: POST_SHOW,
							variables: {
								id: this.$route.params.id
							}
						};
						// read single post query from cache
						const singlePost = store.readQuery(postQuery);
						// access post object from the data
						let postData = singlePost.post;
						// push the new comment to the comments array
						postData.comments.data.push(addComment);
						// Update the queries
						store.writeQuery({ ...postQuery, data: postData });
					},
					// Optimistic UI
					// Will be treated as a 'fake' result as soon as the request is made
					// so that the UI can react quickly and the user be happy
					optimisticResponse: {
						__typename: "Mutation",
						addComment: {
							__typename: "Comment",
							id: -1,
							comment: newComment
						}
					}
				})
				.then(data => {
					// Result
					console.log(data);
				})
				.catch(error => {
					// Error
					console.error(error);
					// We restore the initial user input
					this.comment = newComment;
				});
		},

		showMore() {
			this.page++;

			this.$apollo.queries.comments.fetchMore({
				variables: {
					page: this.page,
					postId: this.post.id
				},
				// Transform the previous result with new data
				updateQuery: (previousResult, { fetchMoreResult }) => {
					const newComments = fetchMoreResult.comments.data;
					const hasMore =
						fetchMoreResult.comments.paginatorInfo.hasMorePages;

					this.showMoreEnabled = hasMore;

					return {
						comments: {
							__typename: previousResult.comments.__typename,
							data: [
								...previousResult.comments.data,
								...newComments
							],
							paginatorInfo:
								fetchMoreResult.comments.paginatorInfo
						}
					};
				}
			});
		}
	}

	//   methods: {
	//     updateName() {
	//       this.$apollo
	//         .mutate({
	//           mutation: gql`
	//             mutation($name: String!) {
	//               updateAlligatorName(name: $name)
	//             }
	//           `,
	//           variables: { name: this.temporaryName }
	//         })
	//         .then(mutationResult => {
	//           // Do stuff with the result.
	//           console.log(
	//             `The Alligator's updated name is: ${mutationResult.data.updateAlligatorName}`
	//           );
	//         });
	//     }
	//   }
};
</script>
