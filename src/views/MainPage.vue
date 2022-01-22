<template>
  <div>
    <div class="main list-container contents">
      <h1 class="page-header">Today I Learned</h1>
      <LoadingSpinner v-if="isLoading"></LoadingSpinner>
      <!-- <div v-else-if="isPostItemsEmpty">data is empty</div> -->
      <ul v-else>
        <PostListItem
          v-for="postItem in postItems"
          :key="postItem._id"
          :postItem="postItem"
          @refresh="fetchData"
        ></PostListItem>
      </ul>
    </div>
    <button class="create-button">
      <i class="ion-md-add" @click="routeEditPage"></i>
    </button>
  </div>
</template>

<script>
import PostListItem from '@/components/posts/PostListItem.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { fetchPosts } from '@/api/posts';

export default {
  data() {
    return {
      postItems: [],
      isLoading: false,
      searchId: '',
    };
  },
  components: {
    LoadingSpinner,
    PostListItem,
  },
  computed: {
    // isPostItemsEmpty() {
    //   const data = this.postItems.length === 0 ? true : false;
    //   return data;
    // },
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      const { data } = await fetchPosts();
      this.isLoading = false;
      this.postItems = data.posts;
    },
    routeEditPage() {
      console.log('call routeEditPage');
      this.$router.push(`/post/add`);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style></style>
