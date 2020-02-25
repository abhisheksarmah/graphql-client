<template>
  <p>
    <ul v-for="user in users.data" :key="user.id">
        <li>
            <router-link :to="`user/${user.id}`">{{user.name}}</router-link> 
            <span>{{user.posts_count}}</span>
        </li>
    </ul> 
    {{users.paginatorInfo}}
  </p>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      temporaryName: "",
      users: null
    };
  },

  apollo: {
    users: gql`
      query {
        users {
            paginatorInfo {
                count
                currentPage
                firstItem
                hasMorePages
                lastItem
                lastPage
                perPage
                total
            }
            data {
                id
                name
                posts_count
            }
        }
    }
    `
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
