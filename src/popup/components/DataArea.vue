<template>
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
    name: 'DataArea',
    components: {
        MeetingPerDate,
        MeetingEmptyMessage,
    },
    props: {
        googleMeetStopWatchRecords: Array,
        googleMeetStopWatchTags: Object
    },
    data() {
        return {
            localRecords: this.googleMeetStopWatchRecords,
            localTags: this.googleMeetStopWatchTags
        }
    },
    computed: {
        hasRecords() {
            return this.googleMeetStopWatchRecords.length > 0;
        },
    },
    methods: {
        deleteSingleDayRecords(date) {
            const KEY_RECORDS = "googleMeetStopWatchRecords"
            // const newRecords = structuredClone(this.googleMeetStopWatchRecords).filter(record => record.date !== date);
            const newRecords = JSON.parse(JSON.stringify(this.googleMeetStopWatchRecords)).filter(record => record.date !== date);
            chrome.storage.local.remove(KEY_RECORDS, () => {
                console.log('【Google Meet Stopwatch Log】temporarily remove all records.');
                chrome.storage.local.set({
                    'googleMeetStopWatchRecords': newRecords
                }, () => {
                    chrome.storage.local.get(KEY_RECORDS).then((result) => {
                        this.localRecords = result[KEY_RECORDS];
                        this.$emit('trigger-update-records', this.localRecords);
                        console.log('【Google Meet Stopwatch Log】remove a record on ' + date + '!');
                        console.table(this.localRecords);
                    });
                });
            });
        }
    }
}
</script>

<style>
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
