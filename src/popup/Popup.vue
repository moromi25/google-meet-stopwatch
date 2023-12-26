<template>
  <div class="header-area">
    <div class="title-area">
      <span>Google Meetの利用時間</span>
    </div>
    <div class="header-buttons-area">
      <!--<button id="button-get-local-data" @click="printStorageDataToConsole">データ確認</button>-->
      <button id="button-clear-all" class="clear-button" @click="clearAllDaysRecords">すべて削除する</button>
      <font-awesome-icon id="button-open-config" class="icon-button button-nth" icon="fa-solid fa-gear"
        @click="openOptionPage" title="設定画面を開く" />
    </div>
  </div>
  <div class="data-area">
    <div class="meeting-list">
      <template v-if="hasRecords">
        <MeetingPerDate v-for="dateRecords in this.googleMeetStopWatchRecords" :key="dateRecords.date"
          :date="dateRecords.date" :formattedDate="dateRecords.formattedDate" :details="dateRecords.details"
          :tags="this.googleMeetStopWatchTags" @trigger-delete-single-day-records="deleteSingleDayRecords">
        </MeetingPerDate>
      </template>
      <template v-else>
        <MeetingEmptyMessage />
      </template>
    </div>
  </div>
</template>
  
<script>
import MeetingPerDate from '@/popup/components/MeetingPerDate.vue'
import MeetingEmptyMessage from '@/popup/components/MeetingEmptyMessage.vue'

export default {
  name: 'MeetingTimePopup',
  components: {
    MeetingPerDate,
    MeetingEmptyMessage,
  },
  data: function () {
    return {
      // Inject into the current component
      config: $config,
      googleMeetStopWatchRecords: [],
      googleMeetStopWatchTags: {}
    }
  },
  beforeMount() {
    const KEY_RECORDS = "googleMeetStopWatchRecords";
    fetch('http://localhost:3000/googleMeetStopWatchRecords')
      .then(res => res.json())
      .then(res => this.googleMeetStopWatchRecords = res[KEY_RECORDS] || []; )
    // chrome.storage.local.get(KEY_RECORDS, (result) => {
    //   this.googleMeetStopWatchRecords = result[KEY_RECORDS] || [];
    // });

    const KEY_TAGS = "googleMeetStopWatchTags";
    chrome.storage.local.get(KEY_TAGS, (result) => {
      this.googleMeetStopWatchTags = result[KEY_TAGS] || {};
    });
  },
  computed: {
    hasRecords() {
      return this.googleMeetStopWatchRecords.length > 0;
    },
  },
  methods: {
    clearAllDaysRecords() {
      chrome.storage.local.remove('googleMeetStopWatchRecords', () => {
        console.log('【Google Meet Stopwatch Log】remove all records.');
        this.googleMeetStopWatchRecords = [];
      });
    },
    deleteSingleDayRecords(date) {
      const KEY_RECORDS = "googleMeetStopWatchRecords"
      const newRecords = structuredClone(this.googleMeetStopWatchRecords).filter(record => record.date !== date);
      chrome.storage.local.remove(KEY_RECORDS, () => {
        console.log('【Google Meet Stopwatch Log】temporarily remove all records.');
        chrome.storage.local.set({
          'googleMeetStopWatchRecords': newRecords
        }, () => {
          chrome.storage.local.get(KEY_RECORDS).then((result) => {
            this.googleMeetStopWatchRecords = result[KEY_RECORDS];
            console.log('【Google Meet Stopwatch Log】remove a record on ' + date + '!');
            console.table(this.googleMeetStopWatchRecords);
          });
        });
      });
    },
    openOptionPage() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('./options.html'));
      }
    },
    printStorageDataToConsole() {
      const KEY_RECORDS = "googleMeetStopWatchRecords"
      chrome.storage.local.get(KEY_RECORDS, (result) => {
        console.table(result[KEY_RECORDS]);
      });

      const KEY_TAGS = "googleMeetStopWatchTags";
      chrome.storage.local.get(KEY_TAGS, (result) => {
        console.table(result[KEY_TAGS]);
        this.googleMeetStopWatchTags = result[KEY_TAGS] || {};
      });
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
  margin-left: 8px;
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
  flex-basis: 65%;
  align-items: center;
  font-size: 24px;
}

.header-buttons-area {
  display: flex;
  flex-basis: 35%;
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

.data-area {
  display: flex;
  width: 100%;
  padding-top: 55px;
  margin: 8px 0 16px 0;
}

.meeting-list {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
}
</style>
