<template>
	<div>
		<h4>
			{{ user.name }}
		</h4>
		<template v-if="user.posts">
			<div v-for="post in user.posts" :key="post.id">
				<h5>{{ post.title }}</h5>
				<p>{{ post.description }}</p>
			</div>
		</template>
	</div>
</template>

<script>
import gql from "graphql-tag";

export default {
	data() {
		return {
			temporaryName: "",
			user: null
		};
	},

	apollo: {
		user() {
			return {
				query: gql`
					query UserQuery($id: ID!) {
						user(id: $id) {
							id
							name
							posts {
								id
								title
								description
							}
							posts_count
						}
					}
				`,
				variables: {
					id: this.$route.params.id
				}
			};
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
