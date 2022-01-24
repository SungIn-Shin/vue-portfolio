<template>
  <div class="contents">
    <h1 class="page-header" v-if="insertMode">Create Post</h1>
    <h1 class="page-header" v-else>Modify Post</h1>
    <div class="form-wrapper">
      <form class="form" @submit.prevent="submitForm">
        <div>
          <label for="title">Title:</label>
          <input id="title" type="text" v-model="title" />
        </div>
        <div>
          <label for="contents">Contents:</label>
          <textarea id="contents" type="text" rows="5" v-model="contents" />
          <p
            v-if="!isContentsValid"
            class="validation-text warning isContentTooLong"
          >
            컨텐츠 길이는 200글자 이내로 작성하세요.
          </p>
        </div>
        <button v-if="insertMode" type="submit" class="btn">Create</button>
        <button v-else type="submit" class="btn">Edit</button>
        <button type="button" class="btn" @click="goToPost">
          특정게시글열기
        </button>
      </form>
      <p class="log">
        {{ logMessage }}
      </p>
      <p class="log">{{ postId }}</p>
    </div>
  </div>
</template>

<script>
import { createPost, fetchPost, editPost } from '@/api/posts';
import { isNull } from '@/utils/common.js';

export default {
  data() {
    return {
      title: '',
      contents: '',
      logMessage: '',
      postId: '', // 게시물 번호
      insertMode: true, // 입력 모드 true : 입력, false : 수정
    };
  },
  created() {
    // 최초 생성시 파라미터로 postId를 불러오는 여부에 따라 insertMode 변경
    // MainPage.vue     - /post/add     - insertMode: true
    // PostListItem.vue - /post/add/:id - insertMode: false
    this.postId = this.$route.params.id;
  },
  computed: {
    isContentsValid() {
      if (!isNull(this.contents)) return this.contents.length <= 200;
      return false;
    },
  },
  watch: {
    $route(to) {
      // $route(to, from) {
      // to : 현재 호출된 route
      // from : 호출한 route
      // 브라우저에서 페이지 앞뒤로 이동할 때 $route 를 감지해야 이동할 때마다 게시글 정보가 바뀜

      // console.log('$route watch------- to start');
      // console.log(to);
      // console.log('$route watch------- to end');

      // console.log(to.params.id);

      // console.log('$route watch------- from start');
      // console.log(from);
      // console.log('$route watch------- from end');
      // console.log(from.params.id);

      this.postId = to.params.id;
    },
    // postId 값의 변화를 추적해서 mode를 수정한다.
    postId: function (newVal) {
      this.insertMode = isNull(newVal);
      if (!this.insertMode) this.fetchPostData();
    },
  },
  methods: {
    submitForm() {
      if (this.insertMode) {
        this.createPostData();
      } else {
        this.modPostData();
      }
    },
    async createPostData() {
      // 입력모드
      try {
        const response = await createPost({
          title: this.title,
          contents: this.contents,
        });
        this.postId = response.data.data._id;

        this.$router.push(`/post/edit/${this.postId}`);
      } catch (error) {
        console.log(error.response.data.message);
        this.logMessage = error.response.data.message;
      }
    },
    async fetchPostData() {
      try {
        const { data } = await fetchPost(this.postId);
        this.title = data.title;
        this.contents = data.contents;
      } catch (error) {
        console.log(error.response.data.message);
        this.logMessage = error.response.data.message;
      }
    },
    async modPostData() {
      // 수정모드
      try {
        await editPost(this.postId, {
          title: this.title,
          contents: this.contents,
        });

        this.fetchPostData();
        this.changeMode(false, '수정성공!');
      } catch (error) {
        console.log(error.response.data.message);
        this.logMessage = error.response.data.message;
      }
    },
    changeMode(mode, logMessage) {
      this.insertMode = mode;
      this.logMessage = logMessage;
    },
    goToPost() {
      // 특정 게시글을 지정함.
      this.postId = '61e5154859be5642536311ec';
      // 동일한 instance 를 생성할 때 NavigationDuplicated: Avoided redundant navigation to current location
      // exception이 발생하는데 해당 오류를 무시한다.
      // watch 에서 postId를 변경감지 하고있기 때문에 화면의 데이터는 지정한 postId로 불러와서 갱신 함.
      // 아래 로직은 변경감지 후 데이터는 바뀌지만 url은 변경되지 않기 때문에 exception 을 무시하여 url의 postId 값을 바꿔주도록 구현
      // 다른 exception 의 발생시 파악하기 힘드므로 'NavigationDuplicated' 에서만 반응하도록 구현.
      this.$router.push(`/post/edit/${this.postId}`).catch(err => {
        if (!err.name == 'NavigationDuplicated') throw err;
      });
    },
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
};
</script>

<style scoped>
.form-wrapper .form {
  width: 100%;
}
.btn {
  color: white;
}
</style>
