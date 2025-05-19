<template>
  <div class="album-description-container">
    <HeaderTop head-title="简介" go-back='true'>
      <template #actions>
        <van-icon @click="confirm">确认</van-icon>
      </template>
    </HeaderTop>
    <section class="album-description-input">
      <textarea class="w-full textarea" v-model="description" placeholder="请输入简介"></textarea>
    </section>
    <section class="album-description-input-suggest">
      <div class="album-description-input-suggest-top">
        <van-row>
          <van-col span="8">
            <van-button size="small" type="primary" plain icon="comment-o">快捷小标题</van-button>
          </van-col>
          <van-col span="8">
            <van-button size="small" type="primary" plain icon="search">优质小案例</van-button>
          </van-col>
        </van-row>
      </div>
      <div class="album-description-input-suggest-content">
        <van-row>
          <van-col span="12">
            <van-button size="normal" round @click="addText('节目主题：')">节目主题：</van-button>
          </van-col>
          <van-col span="12">
            <van-button size="normal" round @click="addText('适合谁听：')">适合谁听：</van-button>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <van-button size="normal" round @click="addText('书籍信息：')">书籍信息：</van-button>
          </van-col>
          <van-col span="12">
            <van-button size="normal" round @click="addText('内容重点：')">内容重点：</van-button>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <van-button size="normal" round @click="addText('主播介绍：')">主播介绍：</van-button>
          </van-col>
          <van-col span="12">
            <van-button size="normal" round @click="addText('主播寄语：')">主播寄语：</van-button>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <van-button size="normal" round @click="addText('更新频率：')">更新频率：</van-button>
          </van-col>
          <van-col span="12">
            <van-button size="normal" round @click="addText('适合人群：')">适合人群：</van-button>
          </van-col>
        </van-row>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {Pages} from "@/router/pages.ts";
import {onMounted, ref} from "vue";
import {useAlbumStore} from "@/stores/album.ts";

const router = useRouter();
const showLoading = ref(true);
const {description} = storeToRefs(useAlbumStore());
onMounted(() => {
  showLoading.value = false;
})
const confirm = () => {
  router.push({name: Pages.albumCreate,});
}

// Function to append button text to the textarea
const addText = (text: string) => {
  // Append the text to the existing content with a newline
  description.value += (description.value ? "\n" : "") + text;
};
</script>

<style lang="scss" scoped>
@import '@/assets/mixin';

.album-description-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .album-description-input {
    padding-top: 1.95rem !important;
    flex: 0.6;

    .textarea {
      @include sc(.6rem, #000);
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.5rem;
      resize: none;
      box-sizing: border-box;
    }
  }

  .album-description-input-suggest {
    flex: 0.4;
    padding: 1.2rem;

    .album-description-input-suggest-top {
      margin-bottom: 1rem;
      text-align: center;

    }

    .album-description-input-suggest-content {
      margin-top: 2rem;

      .van-row {
        margin: 0.5rem 0;

        .van-col {
          display: flex;
          justify-content: center;

          .van-button {
            width: 90%;
          }
        }
      }
    }
  }
}

.header_style {
  @include sc(.65rem, #333);
  line-height: 2rem;
}

.quick_tag {
  background-color: #fff;
  margin-top: .4rem;
  padding: 0 .6rem 1rem;
}

.determine {
  background-color: #4cd964;
  @include sc(.7rem, #fff);
  text-align: center;
  margin: 0 .7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
}

</style>
