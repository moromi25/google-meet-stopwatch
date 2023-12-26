<template>
    <ul class="meeting-detail-list">
        <li class="meeting-detail-row">
            <div class="meeting-title-cell meeting-detail-cell">
                <div class="meeting-title" :title="detail.meetingTitle">{{ detail.meetingTitle }}</div>
            </div>
            <div class="meeting-tag-cell meeting-detail-cell">
                <div v-if="findTagByMeetingTitle !== noTagKey" class="meeting-tag" :title="findTagByMeetingTitle">
                    {{ findTagByMeetingTitle }}</div>
            </div>
            <div class="meeting-time-cell meeting-detail-cell">
                <div class="meeting-time" :title="formattedTime">{{ formattedTime }}</div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'MeetingDetail',
    data: function () {
        return {
            noTagKey: 'KEY_NO_TAG'
        };
    },
    props: {
        detail: Object,
        tags: Object
    },
    computed: {
        formattedTime() {
            const time = this.detail.elapsedTime;
            if (time < 60) {
                return time + '分';
            }
            const hour = Math.floor(time / 60);
            const min = time % 60;
            return hour + '時間' + min + '分';
        },
        findTagByMeetingTitle() {
            const tag = Object.values(this.tags).map(t => t).find(detail => {
                return detail.keywords.findIndex(keyword => { return this.detail.meetingTitle.indexOf(keyword) > -1 }) > -1;
            });
            return tag === undefined ? this.noTagKey : tag.title;
        }
    }
}
</script>

<style scoped>
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
    flex-basis: 60%;
}

.meeting-tag-cell {
    flex-basis: 25%;
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
    flex-basis: 15%;
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
