<template>
  <div class="tag-create-section">
    <div class="new-tag-area create-area">
      <div class="new-tag-area-title create-section-title">
        新しいタグを登録する
      </div>
      <div class="input-field new-tag-title">
        <input v-model="newTagTitle" class="new-tag-title-input" placeholder="タグの名称を入力" @keydown.enter="addNewTag">
      </div>
      <div class="button-area">
        <button class="button-add" @click="this.addNewTag">追加</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TagCreateSection',
  data: function () {
    return {
      newTagTitle: ""
    }
  },
  methods: {
    addNewTag() {
      if (this.newTagTitle === "") {
        alert("タグの名称を入力してください。");
        return;
      }

      // TODO 既存タグ重複チェック
      let newTag = {
        title: this.newTagTitle,
        keywords: []
      };
      this.$emit('trigger-add-tag', generateTagKey(), newTag);
      this.newTagTitle = "";

      function generateTagKey() {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = 10;
        return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
      }
    }
  }
}
</script>

<style scoped>
.tag-create-section {
  margin-left: 32px;
  width: 40%;
}

.create-area {
  background-color: #f1f8ff;
  padding: 8px 16px;
}

.create-area:not(:first-child) {
  margin-top: 16px;
}

.create-area div:not(:first-child) {
  margin-top: 8px;
}

.tag-list-title,
.create-section-title {
  font-size: 17px;
  margin-bottom: 8px;
}

.create-section-description {
  font-size: 12px;
  color: #7f7f7f;
}

.input-field {
  display: flex;
  align-items: center;
}

.input-field span {
  margin-right: 8px;
  width: 180px;
}

.create-area .button-area {
  display: flex;
  justify-content: flex-end;
}
</style>
