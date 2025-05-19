<template>
  <div class="album_container">
    <HeaderTop go-back="true" :head-title="profileTitle"></HeaderTop>
    <section class="album_content_container">
      <section class="album_upload_section">
        <van-uploader
            v-model="fileList"
            :after-read="uploadAlbumCover"
            :max-size="100 * 1024 * 1024"
            accept="image/*"
            :preview-image="true"
            :preview-full-image="true"
        />
      </section>
      <section class="album_info_section">
        <!--专辑主题-->
        <header class="album_info_header">
          <span>专辑主题</span>
        </header>
        <router-link :to='{path: "/creative/albumCreate/albumSetTitle"}' class="album_info_title">
          <span>{{ name || '清晰填写主题，容易获得更多收听' }}</span>
        </router-link>
        <!--专辑分类-->
        <header class="album_info_header" @click="showCategoryDialog = !showCategoryDialog">
          <span>分类</span>
          <div class="more_type">
            <span class="ellipsis">{{ channelName }} <van-icon name="arrow"/></span>
          </div>
        </header>
        <router-link :to='{path: "/creative/albumCreate/albumSetAttributes",query:{channelId:channelId}}'>
          <header class="album_info_header">
            <span>标签</span>
            <div class="more_type">
              <span class="ellipsis"> <van-icon name="arrow"/></span>
            </div>
          </header>
          <div class="region_tag">
            <span class="flex flex-wrap gap-1.5">
              <van-tag v-for="(attrWithVal, index) in attrWithVals"
                       :key="index"
                       plain
                       round
                       color="#ffe1e1"
                       text-color="#ad0000">
                {{ attrWithVal.attributeValueName }}
              </van-tag>
             </span>
          </div>
        </router-link>
        <header class="album_info_header">
          <span>专辑卖点</span>
          <van-field
              v-model="sellPoint"
              placeholder="作品有卖点才有吸引力"
              clearable
          />
        </header>
        <header class="album_info_header">
          <span>简介</span>
        </header>
        <router-link :to='{path: "/creative/albumCreate/albumSetRemark"}' class="album_remark">
          <span v-html="formattedDescription||'前150字为外显简介部分，建议将重要信息前置'"></span>
        </router-link>
        <header class="album_info_header">
          <span>创作团队</span>
          <van-icon name="plus"/>
        </header>
        <header class="album_info_header">
          <span>是否原创</span>
          <van-switch v-model="original" size="1rem"/>
        </header>
        <header class="album_info_header" @click="showPermissions = !showPermissions">
          <span>设为私密</span>
          <div class="more_type">
          <span class="ellipsis">
            {{ permissionsVal || '公开后不可设置私密' }}
          <van-icon name="arrow"/>
          </span>
          </div>
        </header>
        <header class="album_info_header">
          <span></span>
          <van-checkbox v-model="intellectualPromise"
                        shape="square"
                        bind:change="onChange"
                        icon-size="0.6rem"
                        class="album_copyright">
            我承诺不侵犯任何第三方的知识产权。我已阅读并同意《知识产权承诺》
          </van-checkbox>
        </header>
      </section>

      <section class="album_confirm_upload">
        <p>预览</p>
        <p @click="create">创建</p>
      </section>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
    <!--选择分类-->
    <section class="channel_info">
      <van-popup v-model:show="showCategoryDialog" round position="bottom" :style="{height:'45%'}">
        <div class="popup-header">
          <span>请选择专辑分类</span>
          <van-icon name="close" @click="showCategoryDialog = false" class="close-icon"/>
        </div>
        <div class="popup-content">
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(channel) in allChannels" :key="channel.id"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
              <van-button
                  :type="selectedChannelId === channel.id ? 'danger' : 'default'"
                  plain
                  class="w-full"
                  size="small"
                  @click="selectChannel(channel.id,channel.name)">
                {{ channel.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </div>
        <div>
          <van-button type="primary" round class="mt-2" size="small" block @click="finishedChannel">完成</van-button>
        </div>
      </van-popup>
    </section>
    <!--权限选择-->
    <section>
      <van-popup v-model:show="showPermissions" round position="bottom" :style="{height:'25%'}"
                 @close="showPermissions = false"
                 closeable
                 close-icon="close"
                 :close-on-click-overlay="false">
        <van-cell-group inset class="mt-1">
          <van-cell title="公开" clickable @click="changePermission(0)"></van-cell>
          <van-cell title="仅自己可见" clickable @click="changePermission(1)"></van-cell>
        </van-cell-group>
        <van-button type="primary" round class="mt-1" size="small" block @click="showPermissions = false">取消
        </van-button>
      </van-popup>
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {computed, onMounted, ref} from "vue";
import AlertTip from "@/components/common/AlertTip.vue";
import Loading from "@/components/common/Loading.vue";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {useAlbumStore} from "@/stores/album_store.ts";
import {AlbumCreator} from "@/models/album.ts";
import {Pages} from "@/router/pages.ts";

const {uploadCover, listAllChannel, resetPermission, createAlbum} = useAlbumStore();
const {
  name,
  channelId,
  channelName,
  coverUrl,
  categoryLevel1Id,
  categoryLevel1Name,
  categoryLevel2Id,
  categoryLevel2Name,
  categoryLevel3Id,
  categoryLevel3Name,
  categoryLevel4Id,
  categoryLevel4Name,
  description,
  permissions,
  permissionsVal,
  sellPoint,
  original,
  intellectualPromise,
  attrWithVals
} = storeToRefs(useAlbumStore());

const profileTitle = ref("创建专辑");
const fileList = ref([]);
const showAlert = ref(false);
const showLoading = ref(false);
const alertText = ref("");
const showPermissions = ref(false);
// 是否显示分类对话框
const showCategoryDialog = ref(false);
//  全部的候选频道
const allChannels = ref([]);
// 选择的频道ID
const selectedChannelId = ref(null);
// 选择的频道名称
const selectedChannelName = ref(null);
// 专辑描述的HTML文本
const descriptionHtml = ref("");
const router = useRouter();
const selectChannel = (chooseChannelId: string, chooseChannelName: string) => {
  selectedChannelId.value = chooseChannelId;
  selectedChannelName.value = chooseChannelName;
}

const finishedChannel = () => {
  channelId.value = selectedChannelId.value;
  channelName.value = selectedChannelName.value;
  showCategoryDialog.value = false;
}
const formattedDescription = computed(() => {
  if (description.value == "") {
    descriptionHtml.value = "编辑30字以上有机会获得新品流量扶持哦";
  }
  const descriptionVal = description.value;
  descriptionHtml.value = descriptionVal.replace(/\n/g, '<br>');
  return descriptionHtml.value;
});
// 创建album原数据
const albumCreate = new AlbumCreator();
const uploadAlbumCover = async (file) => {
  // 清空 fileList
  fileList.value = [];
  const newFile = {
    status: 'uploading',
    message: '上传中...',
    url: null,
  };
  coverUrl.value = await uploadCover(file.file);
  newFile.status = "done";
  newFile.message = "上传完成";
  newFile.url = coverUrl.value;
  fileList.value.push(newFile);
};

// 修改权限
const changePermission = (permissions: number) => {
  showPermissions.value = false;
  resetPermission(permissions);
}

// 创建专辑
const create = async () => {
  albumCreate.name = name.value;
  albumCreate.channelId = channelId.value;
  albumCreate.coverUrl = coverUrl.value;
  albumCreate.categoryLevel1Id = categoryLevel1Id.value;
  albumCreate.categoryLevel1Name = categoryLevel1Name.value;
  albumCreate.categoryLevel2Id = categoryLevel2Id.value;
  albumCreate.categoryLevel2Name = categoryLevel2Name.value;
  albumCreate.categoryLevel3Id = categoryLevel3Id.value;
  albumCreate.categoryLevel3Name = categoryLevel3Name.value;
  albumCreate.categoryLevel4Id = categoryLevel4Id.value;
  albumCreate.categoryLevel4Name = categoryLevel4Name.value;
  albumCreate.description = description.value;
  albumCreate.sellPoint = sellPoint.value;
  albumCreate.permissions = permissions.value;
  albumCreate.company = "";
  albumCreate.copyright = "";
  albumCreate.paid = false;
  albumCreate.onSale = false;
  albumCreate.original = original.value;
  albumCreate.intellectualPromise = intellectualPromise.value;
  albumCreate.attributeValues = attrWithVals.value;
  await createAlbum(albumCreate);
  await router.push({name: Pages.creativeCenter, replace: true});
}
onMounted(async () => {
  allChannels.value = await listAllChannel();
})
</script>

<style lang="scss" scoped>
@import '@/assets/mixin';

.album_container {
  padding-top: 1.95rem;
  padding-bottom: 3rem;

  .album_content_container {
    .album_upload_section {
      padding: 0 0.7rem;
    }

    .album_info_section {
      margin-top: .4rem;
      padding: 0.2rem .7rem;

      .album_info_header {
        @include fj;
        line-height: 2rem;
        align-items: center; // 垂直居中对齐
        gap: 0.5rem; // 为每个子元素设置相同的间距

        span {
          display: block;
          white-space: nowrap; // Prevent the title from wrapping
        }

        span:nth-of-type(1) {
          @include sc(.7rem, #666);
        }

        .more_type {
          span:nth-of-type(1) {
            @include sc(.6rem, #aaa);
            width: 10rem;
            display: inline-block;
            text-align: right;
            vertical-align: middle;
          }
        }
      }

      .album_info_title {
        @include fj;
        border-top: 0.025rem solid #f5f5f5;
        min-height: 1rem;

        span {
          @include sc(.6rem, #aaa);
        }
      }

      .album_remark {
        @include fj;
        border-top: 0.025rem solid #f5f5f5;
        min-height: 8rem;

        span {
          @include sc(.6rem, #aaa);
        }
      }

      .album_copyright {
        @include sc(.6rem, #aaa);
        font-weight: 500;
      }
    }
  }
}

.album_confirm_upload {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3rem;
  z-index: 1000;

  p {
    line-height: 3rem;
    @include sc(.75rem, #fff);
  }

  p:nth-of-type(1) {
    background-color: #3c3c3c;
    flex: 5;
    text-align: center;
  }

  p:nth-of-type(2) {
    flex: 5;
    background-color: #56d176;
    text-align: center;
  }
}

.upload_tag {
  position: relative;
  margin-top: .2rem;

  div {
    display: flex;
    padding: 0 0 0 0.8rem;
    width: 100%;
    justify-content: flex-start;

    p {
      font-size: 0.8rem;
      color: #dfe2e8;
      margin-right: 0.5rem;
      padding: 0.25rem;
      border-radius: 0.2rem;
      background-color: #949495;

      .van-icon-fire-o {
        margin-right: 0.2rem;
      }
    }
  }
}

.channel_info {
  .custom-popup {
    padding: 2rem;
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 0.2rem;
    border-bottom: 0.1rem solid #ebebeb;
  }

  .close-icon {
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .popup-content {
    //margin-top: 1rem !important;
  }
}

::v-deep(.van-field__control::placeholder) {
  font-size: 0.6rem !important;
  color: #ccc !important;
}
</style>
