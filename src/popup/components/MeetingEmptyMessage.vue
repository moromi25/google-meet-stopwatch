<template>
  <div class="empty-meeting-message-area">
    <font-awesome-icon class="icon-empty-meeting" icon="fa-solid fa-stopwatch" />
    <div class="empty-meeting-title">ミーティング記録がありません</div>
  </div>
</template>

<script>

export default {
  name: 'MeetingEmptyMessage',
}
</script>

<style scoped>
.empty-meeting-message-area {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.icon-empty-meeting {
  font-size: 128px;
  color: #a9a9a9;
}

.empty-meeting-title {
  color: #7f7f7f;
  font-size: 20px;
  margin-top: 16px;
}
</style>
