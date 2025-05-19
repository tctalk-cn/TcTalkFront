<template>
  <div class="album-tags">
    <section v-if="!showLoading">
      <HeaderTop head-title="编辑标签" go-back='true'></HeaderTop>
      <section class="mt-1 bg-white">
        <van-field v-model="customerTag"
                   left-icon="notes-o"
                   clearable
                   input-align="center"
                   maxlength="15"
                   border
                   spellcheck
                   class="w-full"
                   placeholder="输入自定义标签，最多15个字">
          <template #button>
            <van-button size="small" type="primary" plain>添加</van-button>
          </template>
        </van-field>
      </section>
      <!--一级分类-->
      <section class="album-category-container">
        <div class="album-category-title">
          <span>内容分类</span>
          <div class="album-more">
            <span>最多选择一个</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="4" :border="false" class="w-full">
            <van-grid-item v-for="(category) in categoryLevel1" :key="category.id"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="selectedLevel1CategoryId === category.id ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectCategoryLevel1(category.id,category.name)">
                {{ category.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--二级分类-->
      <section class="album-category-container" v-if="showCategoryLevel2">
        <div class="album-category-title">
          <span>{{ categoryLevel1Name }}</span>
          <div class="album-more">
            <span>最多选择一个</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(category) in categoryLevel2" :key="category.id"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="selectedLevel2CategoryId === category.id ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectCategoryLevel2(category.id, category.name)">
                {{ category.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--三级分类-->
      <section class="album-category-container" v-if="showCategoryLevel3">
        <div class="album-category-title">
          <span>{{ categoryLevel2Name }}</span>
          <div class="album-more">
            <span>最多选择一个</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(category) in categoryLevel3" :key="category.id"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="selectedLevel3CategoryId === category.id ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectCategoryLevel3(category.id, category.name)">
                {{ category.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--四级分类-->
      <section class="album-category-container" v-if="showCategoryLevel4">
        <div class="album-category-title">
          <span>{{ categoryLevel3Name }}</span>
          <div class="album-more">
            <span>最多选择一个</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(category) in categoryLevel4" :key="category.id"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="selectedLevel4CategoryId === category.id ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectCategoryLevel4(category.id, category.name)">
                {{ category.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--四级属性名称-->
      <section class="album-attribute-container" v-for="(attribute) in categoryLevel4AttributeWithValues">
        <div class="album-attribute-title">
          <span>{{ attribute.categoryAttribute.attributeName }}</span>
          <div class="album-attribute-more">
            <span>最多选择{{ attribute.categoryAttribute.maxSelection }}个标签</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="5" :border="false">
            <van-grid-item v-for="(attributeValue,index) in attribute.attributeValues" :key="index"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="isAttributeValueSelected(attributeValue.id) ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectAttribute(attributeValue.id,attributeValue.val,attribute.categoryAttribute.id,attribute.categoryAttribute.attributeName,attribute.categoryAttribute.maxSelection)">
                {{ attributeValue.val }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--三级属性名称-->
      <section class="album-attribute-container" v-for="(attribute) in categoryLevel3AttributeWithValues">
        <div class="album-attribute-title">
          <span>{{ attribute.categoryAttribute.attributeName }}</span>
          <div class="album-attribute-more">
            <span>最多选择{{ attribute.categoryAttribute.maxSelection }}个标签</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="5" :border="false">
            <van-grid-item v-for="(attributeValue,index) in attribute.attributeValues" :key="index"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="isAttributeValueSelected(attributeValue.id) ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectAttribute(attributeValue.id,attributeValue.val,attribute.categoryAttribute.id,attribute.categoryAttribute.attributeName,attribute.categoryAttribute.maxSelection)">
                {{ attributeValue.val }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--二级属性名称-->
      <section class="album-attribute-container" v-for="(attribute) in categoryLevel2AttributeWithValues">
        <div class="album-attribute-title">
          <span>{{ attribute.categoryAttribute.attributeName }}</span>
          <div class="album-attribute-more">
            <span>最多选择{{ attribute.categoryAttribute.maxSelection }}个标签</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="5" :border="false">
            <van-grid-item v-for="(attributeValue,index) in attribute.attributeValues" :key="index"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="isAttributeValueSelected(attributeValue.id) ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectAttribute(attributeValue.id,attributeValue.val,attribute.categoryAttribute.id,attribute.categoryAttribute.attributeName,attribute.categoryAttribute.maxSelection)">
                {{ attributeValue.val }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--一级属性名称-->
      <section class="album-attribute-container" v-for="(attribute) in categoryLevel1AttributeWithValues">
        <div class="album-attribute-title">
          <span>{{ attribute.categoryAttribute.attributeName }}</span>
          <div class="album-attribute-more">
            <span>最多选择{{ attribute.categoryAttribute.maxSelection }}个标签</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="5" :border="false">
            <van-grid-item v-for="(attributeValue,index) in attribute.attributeValues" :key="index"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
              <van-button
                  :type="isAttributeValueSelected(attributeValue.id) ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectAttribute(attributeValue.id,attributeValue.val,attribute.categoryAttribute.id,attribute.categoryAttribute.attributeName,attribute.categoryAttribute.maxSelection)">
                {{ attributeValue.val }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <!--tag名称-->
      <section class="album-tag-container" v-if="showTags">
        <div class="album-tag-title">
          <span>推荐</span>
          <div class="album-tag-more">
            <span>最多选择六个标签</span>
          </div>
        </div>
        <section>
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(tg,index) in tags" :key="index">
              <van-button
                  :type="isSelected(tg.id) ? 'danger' : 'default'"
                  plain
                  class="w-full text-xs"
                  size="mini"
                  @click="selectTag(tg.id,tg.tagName)">
                {{ tg.tagName }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </section>
      </section>
      <section class="mt-5">
        <van-button type="primary" round size="small" block @click="confirm" :disabled="!canConfirm">确认
        </van-button>
      </section>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>
<script setup lang="ts">
import Loading from "@/components/common/Loading.vue";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {useRoute, useRouter} from "vue-router";
import {Pages} from "@/router/pages.ts";
import {onMounted, ref} from "vue";
import {useAlbumStore} from "@/stores/album.ts";
import {storeToRefs} from "pinia";
import AlertTip from "@/components/common/AlertTip.vue";
import {showToast} from "vant";
import {AlbumAlbumAttributeValueCreator} from "@/models/album.ts";

const route = useRoute();
const router = useRouter();
const showLoading = ref(true);
const {
  getCategoryByChannel,
  getTagsByCategory,
  getChildrenCategoryByChannel,
  getCategoryAttributesWithValueByCategoryId
} = useAlbumStore();
const {
  categoryLevel1Id,
  categoryLevel1Name,
  categoryLevel2Id,
  categoryLevel2Name,
  categoryLevel3Id,
  categoryLevel3Name,
  categoryLevel4Id,
  categoryLevel4Name,
  tagIds,
  tagNames,
  attrWithVals
} = storeToRefs(useAlbumStore());
const canConfirm = ref(false);
const customerTag = ref();
// 一级分类，默认展示
const categoryLevel1 = ref([]);
const selectedLevel1CategoryId = ref(null);
// 二级分类
const showCategoryLevel2 = ref(false);
const categoryLevel2 = ref([]);
const selectedLevel2CategoryId = ref(null);
// 三级分类
const showCategoryLevel3 = ref(false);
const categoryLevel3 = ref([]);
const selectedLevel3CategoryId = ref(null);
// 四级分类
const showCategoryLevel4 = ref(false);
const categoryLevel4 = ref([]);
const selectedLevel4CategoryId = ref(null);
// 标签相关
const tags = ref([]);
const showTags = ref(false);
const showAlert = ref(false);
const alertText = ref("");
// 被选择中的标签ID集合
const selectedTagIds = ref([]);
// 被选中的标签名称
const selectedTagNames = ref([]);
// 一级属性值集合
const categoryLevel1AttributeWithValues = ref([]);
// 二级属性值集合
const categoryLevel2AttributeWithValues = ref([]);
// 三级属性值集合
const categoryLevel3AttributeWithValues = ref([]);
// 四级属性值集合
const categoryLevel4AttributeWithValues = ref([]);
// 被选择中的属性值ID集合
const selectedAttributeValueIds = ref([]);
// 被选中的属性值名称
const selectedAttributeValueNames = ref([]);
// 创建一个空 Map(key:attributeId，value:已经选择的属性Count)
const selectAttributeCount = new Map();
// 被选中的属性
const selectAttributeIdWithNames = new Map();

onMounted(async () => {
  showLoading.value = false;
  categoryLevel1.value = await getCategoryByChannel(route.query.channelId as string, "0");
})

/**
 * 一级分类选择
 * @param chooseCategoryLevel1Id 一级分类ID
 * @param chooseCategoryLevel1Name 一级分类名称
 */
const selectCategoryLevel1 = async (chooseCategoryLevel1Id: string, chooseCategoryLevel1Name: string) => {
  categoryLevel1Id.value = chooseCategoryLevel1Id;
  categoryLevel1Name.value = chooseCategoryLevel1Name;
  selectedLevel1CategoryId.value = chooseCategoryLevel1Id;
  // 查找对应的二级分类信息
  let categoryLevel2List = await getCategoryByChannel(route.query.channelId as string, chooseCategoryLevel1Id);
  if (categoryLevel2List.length > 0) {
    categoryLevel2.value = categoryLevel2List;
    showCategoryLevel2.value = true;
  } else {
    // 没有子分类时就可以提交确认了
    canConfirm.value = true;
  }
  // 查找分类关联的属性信息
  categoryLevel1AttributeWithValues.value = await getCategoryAttributesWithValueByCategoryId(chooseCategoryLevel1Id);

  tags.value = await getTagsByCategory(chooseCategoryLevel1Id);
  showTags.value = true;

  // 点击一级分类后，需要把此层级下的数据清空
  categoryLevel2Id.value = null;
  categoryLevel2Name.value = null;
  categoryLevel3Id.value = null;
  categoryLevel3Name.value = null;
  categoryLevel4Id.value = null;
  categoryLevel4Name.value = null;
  // 把此级别下展示框隐藏
  showCategoryLevel3.value = false;
  showCategoryLevel4.value = false;
  selectedTagIds.value = [];
  selectedTagNames.value = [];
}

/**
 * 二级分类选择
 * @param chooseCategoryLevel2Id 二级分类ID
 * @param chooseCategoryLevel2Name 二级分类名称
 */
const selectCategoryLevel2 = async (chooseCategoryLevel2Id: string, chooseCategoryLevel2Name: string) => {
  categoryLevel2Id.value = chooseCategoryLevel2Id;
  categoryLevel2Name.value = chooseCategoryLevel2Name;
  selectedLevel2CategoryId.value = chooseCategoryLevel2Id;
  let categoryLevels = await getChildrenCategoryByChannel(route.query.channelId as string, chooseCategoryLevel2Id);
  if (categoryLevels.length > 0) {
    categoryLevel3.value = categoryLevels;
    showCategoryLevel3.value = true;
  } else {
    // 没有子分类时就可以提交确认了
    canConfirm.value = true;
  }
  // 查找分类管来呢的属性
  categoryLevel2AttributeWithValues.value = await getCategoryAttributesWithValueByCategoryId(chooseCategoryLevel2Id);
  // 点击二级分类后，需要把此层级下的数据清空
  categoryLevel3Id.value = null;
  categoryLevel3Name.value = null;
  categoryLevel4Id.value = null;
  categoryLevel4Name.value = null;
  // 把此级别下展示框隐藏
  showCategoryLevel4.value = false;
}

/**
 * 三级分类选择
 * @param chooseCategoryLevel3Id 三级分类ID
 * @param chooseCategoryLevel3Name 三级分类名称
 */
const selectCategoryLevel3 = async (chooseCategoryLevel3Id: string, chooseCategoryLevel3Name: string) => {
  categoryLevel3Id.value = chooseCategoryLevel3Id;
  categoryLevel3Name.value = chooseCategoryLevel3Name;
  selectedLevel3CategoryId.value = chooseCategoryLevel3Id;
  // 查找对应的三级分类信息
  let categoryLevel4List = await getChildrenCategoryByChannel(route.query.channelId as string, chooseCategoryLevel3Id);
  if (categoryLevel4List.length > 0) {
    categoryLevel4.value = categoryLevel4List;
    showCategoryLevel4.value = true;
  } else {
    // 没有子分类时就可以提交确认了
    canConfirm.value = true;
  }
  // 查找分类关联的属性信息
  categoryLevel3AttributeWithValues.value = await getCategoryAttributesWithValueByCategoryId(chooseCategoryLevel3Id);
  // 点击三级分类后，需要把此层级下的数据清空
  categoryLevel4Id.value = null;
  categoryLevel4Name.value = null;
}

/**
 * 四级分类选择
 * @param chooseCategoryLevel4Id 四级分类ID
 * @param chooseCategoryLevel4Name 四级分类名称
 */
const selectCategoryLevel4 = async (chooseCategoryLevel4Id: string, chooseCategoryLevel4Name: string) => {
  categoryLevel4Id.value = chooseCategoryLevel4Id;
  categoryLevel4Name.value = chooseCategoryLevel4Name;
  selectedLevel4CategoryId.value = chooseCategoryLevel4Id;
  categoryLevel4AttributeWithValues.value = await getCategoryAttributesWithValueByCategoryId(chooseCategoryLevel4Id);
  // 四级分类算作标签的一部分
  selectAttribute(chooseCategoryLevel4Id, chooseCategoryLevel4Name, chooseCategoryLevel4Id, chooseCategoryLevel4Name, 1);
  // 没有子分类时就可以提交确认了
  canConfirm.value = true;
}

const isSelected = (tagId: string) => {
  // 判断 tagId 是否在 selectedTags 中
  return selectedTagIds.value.includes(tagId);
}

const selectTag = (tagId: string, tagName: string) => {
  // 检查 tagId 是否已经在 selectedTags 中
  const index = selectedTagIds.value.indexOf(tagId);
  if (index > -1) {
    // 如果存在则取消选择
    selectedTagIds.value.splice(index, 1);
    selectedTagNames.value.splice(index, 1);
  } else if (selectedTagIds.value.length >= 6) {
    showAlert.value = true;
    alertText.value = '最多选择6个标签';
    return;
  } else {
    // 如果不存在则添加到选中数组
    selectedTagIds.value.push(tagId);
    selectedTagNames.value.push(tagName);
  }
}

// 判断属性值是否被选中
const isAttributeValueSelected = (attributeValueId: string) => {
  // 判断 attributeValueId 是否在 selectedAttributeValueIds 中
  return selectedAttributeValueIds.value.includes(attributeValueId);
}

const selectAttribute = (attributeValueId: string, attributeValueName: string, attributeId: string, attributeName: string, maxSelection: number) => {
  // 检查 attributeValueId 是否已经在 selectedAttributeValueIds 中
  const index = selectedAttributeValueIds.value.indexOf(attributeValueId);
  if (index > -1) {
    // 如果存在则取消选择
    selectedAttributeValueIds.value.splice(index, 1);
    selectedAttributeValueNames.value.splice(index, 1);
    // 减少对应 attributeId 的计数
    const count = selectAttributeCount.get(attributeId) || 0;
    selectAttributeCount.set(attributeId, count - 1);
    selectAttributeIdWithNames.delete(attributeValueId);
  } else if (selectedAttributeValueIds.value.length >= 10) {
    showAlert.value = true;
    alertText.value = '最多选择10个属性';
    return;
  } else {
    // 获取当前属性的计数
    const count = selectAttributeCount.get(attributeId) || 0;
    if (count >= maxSelection) {
      showToast('最多选择' + maxSelection + "个");
      return;
    }
    // 如果不存在则添加到选中数组
    selectedAttributeValueIds.value.push(attributeValueId);
    selectedAttributeValueNames.value.push(attributeValueName);
    selectAttributeCount.set(attributeId, count + 1);
    selectAttributeIdWithNames.set(attributeValueId, attributeId + ":" + attributeName);
  }
}

const confirm = () => {
  tagNames.value = selectedTagNames.value;
  tagIds.value = selectedTagIds.value;
  // 先清空旧数据
  attrWithVals.value = [];
  // 重新构建
  for (let i = 0; i < selectedAttributeValueIds.value.length; i++) {
    var attributeValueId = selectedAttributeValueIds.value[i];
    var attrIdWithName = selectAttributeIdWithNames.get(attributeValueId);
    var attrIdWithNameArr = attrIdWithName.split(":");
    var attrVal = {
      attributeId: attrIdWithNameArr[0],
      attributeName: attrIdWithNameArr[1],
      attributeValueId: selectedAttributeValueIds.value[i],
      attributeValueName: selectedAttributeValueNames.value[i],
      attributeValueOrder: i,
    } as AlbumAlbumAttributeValueCreator;
    attrWithVals.value.push(attrVal);
  }
  router.push({name: Pages.albumCreate,});
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixin';

.album-tags {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  padding-top: 1.95rem;
  overflow-y: auto;
  z-index: 1000;

  .album-category-container {
    background-color: #fff;
    margin-top: .4rem;
    padding: 0 .7rem;

    .album-category-title {
      @include fj;
      line-height: 2rem;

      span {
        display: block;
        @include sc(.6rem, #aaa);
      }

      span:nth-of-type(1) {
        @include sc(.7rem, #666);
      }

      .album-more {
        span:nth-of-type(1) {
          @include sc(.6rem, #aaa);
          width: 10rem;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
        }
      }
    }
  }

  .album-attribute-container {
    background-color: #fff;
    margin-top: .4rem;
    padding: 0 .7rem;

    .album-attribute-title {
      @include fj;
      line-height: 2rem;

      span {
        display: block;
        @include sc(.6rem, #aaa);
      }

      span:nth-of-type(1) {
        @include sc(.7rem, #666);
      }

      .album-attribute-more {
        span:nth-of-type(1) {
          @include sc(.6rem, #aaa);
          width: 10rem;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
        }
      }
    }
  }

  .album-tag-container {
    background-color: #fff;
    margin-top: .4rem;
    padding: 0 .7rem;

    .album-tag-title {
      @include fj;
      line-height: 2rem;

      span {
        display: block;
        @include sc(.6rem, #aaa);
      }

      span:nth-of-type(1) {
        @include sc(.7rem, #666);
      }

      .album-tag-more {
        span:nth-of-type(1) {
          @include sc(.6rem, #aaa);
          width: 10rem;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
        }
      }
    }
  }
}


</style>
