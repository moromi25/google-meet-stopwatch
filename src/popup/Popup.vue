<template>
  <div class="header-area">
    <div class="title-area">
      <span>Google Meetの利用時間</span>
    </div>
    <div class="header-buttons-area">
      <button id="button-clear-all" class="clear-button" @click="clearAllDaysRecords">すべて削除する</button>
      <font-awesome-icon icon="fa-solid fa-rotate-right" class="icon-button button-nth" @click="reload" title="再読み込み" />
      <font-awesome-icon icon="fa-solid fa-gear" class="icon-button button-nth" @click="openOptionPage" title="設定画面を開く" />
    </div>
  </div>
  <DataArea :key="reloadedCount" :googleMeetStopWatchRecords="googleMeetStopWatchRecords"
    :googleMeetStopWatchTags="googleMeetStopWatchTags" @trigger-update-records="updateRecords"></DataArea>
</template>
  
<script>
import DataArea from '@/popup/components/DataArea.vue'

export default {
  name: 'MeetingTimePopup',
  components: {
    DataArea
  },
  data: function () {
    return {
      // Inject into the current component
      // config: $config,
      googleMeetStopWatchRecords: [],
      googleMeetStopWatchTags: {},
      reloadedCount: 0
    }
  },
  beforeMount() {
    const KEY_RECORDS = "googleMeetStopWatchRecords";
    // fetch('http://localhost:3000/googleMeetStopWatchRecords')
    //   .then(res => res.json())
    //   .then(res => this.googleMeetStopWatchRecords = res[KEY_RECORDS] || []);
    chrome.storage.local.get(KEY_RECORDS, (result) => {
      this.googleMeetStopWatchRecords = result[KEY_RECORDS] || [];
    });

    const KEY_TAGS = "googleMeetStopWatchTags";
    chrome.storage.local.get(KEY_TAGS, (result) => {
      this.googleMeetStopWatchTags = result[KEY_TAGS] || {};
    });
  },
  methods: {
    reload() {
      console.log("reloaded count: " + ++this.reloadedCount);
      console.log("records:");
      console.table(this.googleMeetStopWatchRecords);
      console.log("tags:");
      console.table(this.googleMeetStopWatchTags);
    },
    clearAllDaysRecords() {
      chrome.storage.local.remove('googleMeetStopWatchRecords', () => {
        console.log('【Google Meet Stopwatch Log】remove all records.');
        this.googleMeetStopWatchRecords = [];
      });
    },
    updateRecords(newRecords) {
      this.googleMeetStopWatchRecords = newRecords;
    },
    openOptionPage() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('./options.html'));
      }
    }
  }
}
</script>

<style>
body {
  width: 500px;
}

.popup-container {
  margin: 16px;
}

button {
  display: flex;
  justify-content: normal;
  align-items: center;
  padding: 4px 12px;
  color: #333;
  font-size: 14px;
  background-color: #cccccc;
  transition: 0.5s;
  border: none;
  cursor: pointer;
  border-radius: 2px;
}

button:hover {
  text-decoration: none;
  background-color: #bbbbbb;
}

.icon-button {
  cursor: pointer;
  transition: 0.2s;
}

.icon-button:hover {
  color: #7f7f7f;
}

.button-nth {
  margin-left: 12px;
}

.header-area {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 91%;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
}

.title-area {
  display: flex;
  flex-basis: 60%;
  align-items: center;
  font-size: 24px;
}

.header-buttons-area {
  display: flex;
  flex-basis: 40%;
  justify-content: flex-end;
  align-items: center;
}

.header-buttons-area i {
  font-size: 17px;
  margin-left: 8px;
  transition: 0.2s;
  cursor: pointer;
}

.header-buttons-area i:hover {
  color: #aaa;
}
</style>
