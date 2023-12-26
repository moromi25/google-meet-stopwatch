<template>
    <div ref="meetingRow" class="meeting-row" data-date="date">
        <div class="meeting-date-row">
            <span :title="formattedDate" class="meeting-date">{{ formattedDate }}</span>
            <font-awesome-icon class="icon-tag-delete icon-button" icon="fa-solid fa-xmark" @click="deleteDayRecords"
                :title="formattedDate + ' のデータを削除する'" />
        </div>
        <MeetingDetail v-for="detail in details" :key="detail.id" :detail="detail" :tags="tags">
        </MeetingDetail>
        <MeetingTotal :details="details" :tags="tags">
        </MeetingTotal>
    </div>
</template>

<script>
import MeetingDetail from '@/popup/components/MeetingDetail.vue'
import MeetingTotal from '@/popup/components/MeetingTotal.vue'

export default {
    name: 'MeetingPerDate',
    props: {
        date: String,
        formattedDate: String,
        details: Array,
        tags: Object
    },
    components: {
        MeetingDetail,
        MeetingTotal
    },
    methods: {
        deleteDayRecords() {
            // alert("delete the records of " + this.formattedDate);
            // 親コンポーネントのメソッドを呼び出す
            this.$emit('trigger-delete-single-day-records', this.date);

            // $refsを使用して要素を取得
            const meetingRow = this.$refs.meetingRow;

            // 要素をDOMツリーから削除
            if (meetingRow && meetingRow.parentNode) {
                meetingRow.parentNode.removeChild(meetingRow);
            }
        },

    }
}
</script>

<style scoped>
.meeting-date-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meeting-date {
    font-size: 20px;
}

.icon-date-delete {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
}

.meeting-row:not(:first-child) {
    margin-top: 16px;
    /*border-top: dashed 1px #2d8fdd;*/
    padding-top: 8px;
}

.empty-meeting-row {
    color: #7f7f7f;
    font-size: 16px;
    margin-top: 16px;
}

li.meeting-detail-row {
    display: flex;
    justify-content: space-between;
}

ul,
ol {
    padding: 0;
    position: relative;
}

ul li,
ol li {
    color: #2d8fdd;
    border-left: solid 6px #2d8fdd;
    background: #f1f8ff;
    margin-bottom: 3px;
    line-height: 2;
    padding: 4px 8px 8px 8px;
    list-style-type: none !important;
}

.meeting-detail-cell {
    display: flex;
    align-items: center;
}

.meeting-detail-cell div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meeting-title-cell {
    width: 200px;
}

.meeting-tag-cell {
    width: 80px;
    justify-content: center;
}

.meeting-tag {
    background-color: #ccc;
    color: #333;
    padding: 0 8px;
    margin: 8px;
    max-width: 80px;
    border-radius: 15px;
    min-width: 64px;
    text-align: center;
}

.meeting-time-cell {
    width: 32px;
    justify-content: flex-end;
}

.meeting-actual-time,
.meeting-time {
    font-weight: bold;
}

.meeting-total-block {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
    padding: 4px 8px 4px 8px;
    font-size: 14px;
    background-color: #2d8fdd;
    color: #FFF;
}

.meeting-total-detail-row:first-child {
    margin-top: 8px;
}

.meeting-total-detail-row:not(first-child) {
    margin-bottom: 4px;
}

.meeting-total-row {
    font-weight: bold;
    margin-top: 8px;
    font-size: 17px;
}
</style>
