<template>
  <div class="album-create">
    <HeaderTop go-back="true" :head-title="profileTitle"></HeaderTop>
    <section class="album-create__upload">
      <van-uploader
          v-model="fileList"
          :after-read="uploadAlbumCover"
          :max-size="100 * 1024 * 1024"
          accept="image/*"
          :preview-image="true"
          :preview-full-image="true"
      />
    </section>
    <section class="album-create__info">
      <!--专辑主题-->
      <header class="album_header">
        <span>专辑主题</span>
      </header>
      <router-link :to='{path: "/creative/albumCreate/albumSetTitle"}' class="album_title">
        <span>{{ draftAlbumInfo.name || '清晰填写主题，容易获得更多收听' }}</span>
      </router-link>
      <!--专辑分类-->
      <header class="album_header" @click="showCategoryDialog = !showCategoryDialog">
        <span>分类</span>
        <div class="more_type">
          <span class="ellipsis">{{ draftAlbumInfo.channelName }} <van-icon name="arrow"/></span>
        </div>
      </header>
      <router-link :to='{path: "/creative/albumCreate/albumSetAttributes",query:{channelId:draftAlbumInfo.channelId}}'>
        <header class="album_header">
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
      <header class="album_header">
        <span>专辑卖点</span>
        <van-field
            v-model="draftAlbumInfo.sellPoint"
            placeholder="作品有卖点才有吸引力"
            clearable
        />
      </header>
      <header class="album_header">
        <span>简介</span>
      </header>
      <router-link :to='{path: "/creative/albumCreate/albumSetRemark"}' class="album_remark">
        <span v-html="formattedDescription||'前150字为外显简介部分，建议将重要信息前置'"></span>
      </router-link>
      <header class="album_header">
        <span>创作团队</span>
        <van-icon name="plus"/>
      </header>
      <header class="album_header">
        <span>是否原创</span>
        <van-switch v-model="draftAlbumInfo.original" size="1rem"/>
      </header>
      <header class="album_header" @click="showPermissions = !showPermissions">
        <span>设为私密</span>
        <div class="more_type">
          <span class="ellipsis">
            {{
              draftAlbumInfo?.permissions === 0 ? '无限制' : draftAlbumInfo?.permissions === 1 ? '仅自己可见' : '公开后不可设置私密'
            }}
          <van-icon name="arrow"/>
          </span>
        </div>
      </header>
      <header class="album_header">
        <span></span>
        <van-checkbox v-model="draftAlbumInfo.intellectualPromise"
                      shape="square"
                      @change="onChange"
                      icon-size="0.6rem"
                      class="album_copyright">
          我承诺不侵犯任何第三方的知识产权。我已阅读并同意《知识产权承诺》
        </van-checkbox>
      </header>
    </section>

    <section class="album-create__confirm">
      <p>预览</p>
      <p @click="create">创建</p>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
    <!--选择分类-->
    <section class="album-create__channel">
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
  draftAlbumInfo,
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
  draftAlbumInfo.value.channelId = selectedChannelId.value;
  draftAlbumInfo.value.channelName = selectedChannelName.value;
  showCategoryDialog.value = false;
}
const formattedDescription = computed(() => {
  if (draftAlbumInfo.value.description == "") {
    descriptionHtml.value = "编辑30字以上有机会获得新品流量扶持哦";
  }
  const descriptionVal = draftAlbumInfo.value.description;
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
  draftAlbumInfo.value.coverUrl = await uploadCover(file.file);
  newFile.status = "done";
  newFile.message = "上传完成";
  newFile.url = draftAlbumInfo.value.coverUrl;
  fileList.value.push(newFile);
};

// 修改权限
const changePermission = (permissions: number) => {
  showPermissions.value = false;
  resetPermission(permissions);
}

// 创建专辑
const create = async () => {
  albumCreate.name = draftAlbumInfo.value.name;
  albumCreate.channelId = draftAlbumInfo.value.channelId;
  albumCreate.coverUrl = draftAlbumInfo.value.coverUrl;
  albumCreate.categoryLevel1Id = draftAlbumInfo.value.categoryLevel1Id;
  albumCreate.categoryLevel1Name = draftAlbumInfo.value.categoryLevel1Name;
  albumCreate.categoryLevel2Id = draftAlbumInfo.value.categoryLevel2Id;
  albumCreate.categoryLevel2Name = draftAlbumInfo.value.categoryLevel2Name;
  albumCreate.categoryLevel3Id = draftAlbumInfo.value.categoryLevel3Id;
  albumCreate.categoryLevel3Name = draftAlbumInfo.value.categoryLevel3Name;
  albumCreate.categoryLevel4Id = draftAlbumInfo.value.categoryLevel4Id;
  albumCreate.categoryLevel4Name = draftAlbumInfo.value.categoryLevel4Name;
  albumCreate.description = draftAlbumInfo.value.description;
  albumCreate.sellPoint = draftAlbumInfo.value.sellPoint;
  albumCreate.permissions = draftAlbumInfo.value.permissions;
  albumCreate.company = "";
  albumCreate.copyright = "";
  albumCreate.paid = false;
  albumCreate.onSale = false;
  albumCreate.original = draftAlbumInfo.value.original;
  albumCreate.intellectualPromise = draftAlbumInfo.value.intellectualPromise;
  albumCreate.attributeValues = attrWithVals.value;
  await createAlbum(albumCreate);
  await router.push({name: Pages.creativeCenter, replace: true});
}
onMounted(async () => {
  allChannels.value = await listAllChannel();
})

const onChange = (val: boolean) => {
  albumCreate.intellectualPromise = val;
}
</script>

<style lang="scss" scoped>
.album-create {
  padding-bottom: 3rem;
  background-color: $body-bg;
  font-size: $font-size-sm;

  &__upload {
    padding: 0.6rem 1rem;
    background-color: #fff;
    border-bottom: 0.05rem solid #eee;
  }

  &__info {
    margin-top: .6rem;
    padding: 0.6rem 0.5rem;
    background-color: #fff;

    .album_header {
      @include fj;
      line-height: 1.2rem;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0;
      border-bottom: 0.01rem solid #f0f0f0;

      span:first-of-type {
        font-size: $font-size;
        font-weight: 500;
        color: #333;
      }

      .more_type {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        span {
          font-size: 0.7rem;
          color: #888;
          max-width: 8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .van-field {
        flex: 1;
      }
    }

    .album_title {
      display: block;
      padding: 0.7rem 0;
      border-bottom: 0.025rem solid #f5f5f5;
      font-size: $font-size-sm;
      color: #888;
    }

    .album_remark {
      display: block;
      padding: 0.7rem 0;
      border-bottom: 0.025rem solid #f5f5f5;
      font-size: $font-size-sm;
      color: #888;
    }

    .region_tag {
      margin: 0.5rem 0 1rem;

      span {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }

    .album_copyright {
      @include sc(.6rem, #aaa);
      line-height: 1.5;
      color: #999;
      padding: 0.4rem 0;
    }
  }

  &__confirm {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.2rem;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

    p {
      flex: 1;
      line-height: 3.2rem;
      font-size: 0.8rem;
      text-align: center;
    }

    p:first-child {
      background-color: #f0f0f0;
      color: #333;
    }

    p:last-child {
      background-color: #56d176;
      color: #fff;
    }
  }

  &__channel {
    .popup-header {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: 0.9rem;
      font-weight: bold;
      padding: 0.7rem 0;
      border-bottom: 1px solid #eee;
    }

    .close-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .popup-content {
      padding: 0.5rem 1rem 1rem;
    }

    .van-button {
      font-size: 0.7rem;
    }
  }
}

::v-deep(.van-field__control::placeholder) {
  font-size: 0.6rem !important;
  color: #ccc !important;
}
</style>
