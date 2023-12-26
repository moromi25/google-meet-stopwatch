<template>
  <div class="tag-list-section section-detail">
    <div class="tag-list-title">
      登録済みのタグ
    </div>
    <ul class="tag-list">
      <template v-if="hasRecords">
        <TagList v-for="(tag, key) in this.tags" :key="key" :tagKey="key" :tag="tag" @trigger-update-tag="updateTag"
          @trigger-delete-tag="deleteTag" @trigger-delete-keyword="deleteKeyword">
        </TagList>
      </template>
      <template v-else>
        <TagEmptyMessage />
      </template>

    </ul>
  </div>
</template>

<script>

import TagList from '@/options/components/TagList.vue'
import TagEmptyMessage from '@/options/components/TagEmptyMessage.vue'
export default {
  name: 'TagListSection',
  components: {
    TagList,
    TagEmptyMessage,
  },
  props: {
    tags: Object
  },
  methods: {
    updateTag(tagKey, newTag) {
      this.$emit('trigger-update-tag', tagKey, newTag);
    },
    deleteTag(tagKey) {
      this.$emit('trigger-delete-tag', tagKey);
    },
    deleteKeyword(tagKey, keyword) {
      this.$emit('trigger-delete-keyword', tagKey, keyword);
    },

  },
  computed: {
    hasRecords() {
      return Object.keys(this.tags).length > 0;
    }
  }
}
</script>

<style scoped>
.tag-list-title {
  font-size: 17px;
}
</style>
