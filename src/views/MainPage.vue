<template>
  <div>
    <div class="search-contents">
      <h1 class="search-header">검색영역</h1>
      <div class="form search-form-wrapper">
        <div>
          <label for="title">Title:</label>
          <input id="title" type="text" v-model="searchTitle" />
        </div>
        <div>
          <label for="contents">내용</label>
          <input id="contents" type="text" v-model="searchContents" />
        </div>
        <button type="submit" class="btn" @click="searchForm">검색</button>
        <button type="button" class="btn" @click="clearSearchForm">
          초기화
        </button>
      </div>
    </div>
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
import { isNull } from '@/utils/common.js';
export default {
  data() {
    return {
      postItems: [],
      isLoading: false,
      searchTitle: '',
      searchContents: '',
      dummyList: [
        {
          _id: '61e5154859be5642536311ec1',
          title: '조회용 데이터1111',
          contents: '조회용 데이터1111',
          createdBy: '61e509a888c598413c0258ea',
          createdAt: '2022-01-17T07:05:44.148Z',
          updatedAt: '2022-01-24T06:38:10.926Z',
          __v: 0,
        },
        {
          _id: '61e5154859be5642536311ec2',
          title: '조회용 데이터2222',
          contents: '조회용 데이터2222',
          createdBy: '61e509a888c598413c0258ea',
          createdAt: '2022-01-17T07:05:44.148Z',
          updatedAt: '2022-01-24T06:38:10.926Z',
          __v: 1,
        },
        {
          _id: '61e5154859be5642536311ec3',
          title: '조회용 데이터3333',
          contents: '조회용 데이터3333',
          createdBy: '61e509a888c598413c0258ea',
          createdAt: '2022-01-17T07:05:44.148Z',
          updatedAt: '2022-01-24T06:38:10.926Z',
          __v: 2,
        },
      ],
    };
  },
  components: {
    LoadingSpinner,
    PostListItem,
  },
  computed: {},
  methods: {
    //
    async fetchData() {
      //
      if (
        isNull(this.searchTitle) &&
        isNull(this.searchContents) &&
        this.$route.path == '/main'
      ) {
        this.isLoading = true;
        const { data } = await fetchPosts();
        this.isLoading = false;
        this.postItems = data.posts;
      } else {
        // 검색용 api 호출.. 대신 dummy 데이터 보여줌
        this.postItems = this.dummyList;
      }
    },
    routeEditPage() {
      //
      this.$router.push(`/post/add`);
    },
    searchForm() {
      // 예쁘게 어떻게 만들까...
      const searchQueryString = {};
      if (!isNull(this.searchTitle)) {
        searchQueryString.title = this.searchTitle;
      }
      if (!isNull(this.searchContents)) {
        searchQueryString.contents = this.searchContents;
      }

      this.$router
        .push({
          name: 'main',
          query: searchQueryString,
        })
        .catch(err => {
          if (!err.name == 'NavigationDuplicated') throw err;
        });
    },
    clearSearchForm() {
      this.searchTitle = '';
      this.searchContents = '';
      this.searchForm();
    },
  },
  created() {
    //
    this.searchTitle = this.$route.query.title;
    this.searchContents = this.$route.query.contents;
    this.fetchData();
  },
  watch: {
    //
    $route(to) {
      //
      this.searchTitle = to.query.title;
      this.searchContents = to.query.contents;
      this.fetchData();
    },
  },
};
</script>

<style></style>
