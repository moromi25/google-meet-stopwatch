<template>
  <li class="tag-row" tag-key="this.tagKey">
    <div class="tag-title" :title="this.tag.title">
      <span>{{ this.tag.title }}</span>
      <font-awesome-icon icon="fa-solid fa-xmark" class="action-icon icon-tag-delete" title="このタグとタグに紐づくキーワードを削除する"
        @click="deleteTag" />
    </div>
    <div class="tag-content">
      <ul class="tag-keywords">
        <template v-for="keyword in this.tag.keywords" :key="keyword">
          <li class="tag-keyword" :title="keyword">
            <span>{{ keyword }}</span>
            <font-awesome-icon icon="fa-solid fa-xmark" class="action-icon icon-tag-delete" :keyword="keyword"
              title="このキーワードを削除する" @click="deleteKeyword(keyword)" />
          </li>
        </template>
      </ul>
      <div class="add-tag-keywords-row input-field">
        <input class="new-tag-keyword-input" placeholder="新しいキーワードを入力" v-model="newKeyword" @keydown.enter="addKeyword" />
        <font-awesome-icon icon="fa-solid fa-plus" class="action-icon icon-keyword-add" title="キーワードを追加する"
          @click="addKeyword" />
      </div>
    </div>

  </li>
</template>

<script>

export default {
  name: 'TagList',
  props: {
    tagKey: String,
    tag: Object
  },
  data: function () {
    return {
      newKeyword: ""
    }
  },
  methods: {
    addKeyword() {
      if (this.newKeyword === "") {
        alert("キーワードを入力してください。");
        return;
      }
      // TODO 既存キーワード重複チェック
      let newTag = this.tag;
      let keywords = [];
      if (newTag.keywords instanceof Array) {
        keywords = newTag.keywords;
      } else if (newTag.keywords instanceof Object) {
        // 原因不明だがArrayのkeywordsをchrome.storage.localにset→getするとObjectに変換されている。Proxyの問題？
        keywords = Object.values(newTag.keywords);
      }
      keywords.push(this.newKeyword);
      newTag.keywords = keywords;
      this.$emit('trigger-update-tag', this.tagKey, newTag);
      this.newKeyword = "";
      //
      // let newTag = structuredClone(this.tag);
      //       let newKeywords = [];
      //       if (this.tag.keywords instanceof Array) {
      //         newKeywords = [...this.tag.keywords];
      //       } else if (this.tag.keywords instanceof Object) {
      //         // 原因不明だがArrayのkeywordsをchrome.storage.localにset→getするとObjectに変換されている。Proxyの問題？
      //         newKeywords = [...Object.values(this.tag.keywords)];
      //       }
      //       newKeywords.push(this.newKeyword);
      //       newTag.keywords = newKeywords;
      //       this.newKeyword = "";
      //       this.$emit('trigger-update-tag', this.tagKey, newTag);

    },
    deleteTag() {
      this.$emit('trigger-delete-tag', this.tagKey);
    },
    deleteKeyword(keyword) {
      this.$emit('trigger-delete-keyword', this.tagKey, keyword);
    }
  }
}
</script>

<style scoped>
.tag-row {
  background: #f1f8ff;
  line-height: 2;
  margin-bottom: 16px;
}

.tag-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d8fdd;
  color: #FFF;
  padding: 4px 16px 4px 8px;
  border-radius: 6px 6px 0 0;
  min-width: 100px;
  font-size: 17px;
}

.tag-title .action-icon {
  font-size: 17px;
  margin-left: 8px;
  transition: 0.2s;
  cursor: pointer;
}

.tag-title .action-icon:hover {
  color: #ddd;
}


.tag-content {
  font-size: 14px;
  color: #7f7f7f;
  margin: 8px 8px 0 24px;
}

.tag-content .action-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  cursor: pointer;
}

.tag-content .action-icon:hover {
  color: #ddd;
}

.tag-keyword {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-radius: 4px;
}


.tag-keyword span {
  flex-basis: 90%;
}

.add-tag-keywords-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 0;
}

.new-tag-keyword-input {
  flex-basis: 85%;
}

.icon-keyword-add {
  margin-left: 8px;
}

.tag-buttons {
  display: flex;
  justify-content: flex-end;
}

.tag-buttons button:not(:first-child) {
  margin-left: 8px;
}
</style>
