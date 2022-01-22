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
        <!-- <button type="button" class="btn" @click="goToMain">Main</button> -->
      </form>
      <p class="log">
        {{ logMessage }}
      </p>
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
    this.insertMode = isNull(this.postId);

    // 최초 입력모드가 아닐경우 게시글 정보를 받아온다.
    if (!this.insertMode) this.fetchPostData();
  },
  computed: {
    isContentsValid() {
      return this.contents.length <= 200;
    },
  },
  methods: {
    async submitForm() {
      try {
        if (this.insertMode) {
          this.createPostData();
        } else {
          this.modPostData();
          this.fetchPostData();
        }
      } catch (error) {
        console.log(error.response.data.message);
        this.logMessage = error.response.data.message;
      }
    },
    async createPostData() {
      // 입력모드
      const response = await createPost({
        title: this.title,
        contents: this.contents,
      });
      this.postId = response.data.data._id;

      this.changeMode(false, '입력성공');
    },
    async fetchPostData() {
      const { data } = await fetchPost(this.postId);
      this.title = data.title;
      this.contents = data.contents;
    },
    async modPostData() {
      // 수정모드
      await editPost(this.postId, {
        title: this.title,
        contents: this.contents,
      });

      this.changeMode(false, '수정성공!');
    },
    changeMode(mode, logMessage) {
      this.insertMode = mode;
      this.logMessage = logMessage;
    },
    goToMain() {
      this.$router.push(`/main`);
    },
  },
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
