<template>
    <div class="meeting-total-block">
        <template v-for="tag in tags" :key="tag">
            <div v-if="matched(tag)" class="meeting-total-detail-row" :title="calcAndFormatTagTotalTime(tag)">
                {{ calcAndFormatTagTotalTime(tag) }}
            </div>
        </template>
        <div v-if="noneMatched" class="meeting-total-detail-row" :title="formatNoTagsTime">{{ formatNoTagsTime }}</div>
        <div class="meeting-total-row" :title="formatTotalTime">{{ formatTotalTime }}</div>
    </div>
</template>

<script>
export default {
    name: 'MeetingTotal',
    props: {
        details: Array,
        tags: Object
    },
    computed: {
        matched() {
            const self_ = this;
            return function (tag) {
                return self_.details.some(detail => {
                    if (!detail.meetingTitle) {
                        return false;
                    }
                    return tag.keywords.some(keyword => detail.meetingTitle.includes(keyword));
                });
            };
        },
        calcNoTagsTime() {
            const keywords = this.concatAllKeywords();
            return this.details
                .filter(detail => keywords.every(keyword => detail.meetingTitle && detail.meetingTitle.indexOf(keyword) === -1))
                .map(d => d.elapsedTime)
                .reduce((accum, time) => (accum + time), 0);
        },
        formatNoTagsTime() {
            return 'No tag : ' + this.formatTime(this.calcNoTagsTime);
        },
        noneMatched() {
            const tagList = Object.values(this.tags).map(t => t);
            return tagList.some(tag => this.details.some(detail => tag.keywords.findIndex(keyword => { return detail.meetingTitle.indexOf(keyword) > -1 }) === -1));
        },
        calcAndFormatTagTotalTime() {
            const self_ = this;
            return function (tag) {
                const matchedDetails = self_.details.filter(detail => tag.keywords.findIndex(keyword => { return detail.meetingTitle && detail.meetingTitle.indexOf(keyword) > -1 }) > -1);
                const totalTime = matchedDetails.reduce((accum, detail) => (accum + detail.elapsedTime), 0)
                return tag.title + " : " + this.formatTime(totalTime);
            };
        },
        calcTotalTime() {
            return this.details.reduce((accum, detail) => (accum + detail.elapsedTime), 0);
        },
        formatTotalTime() {
            return '計 ' + this.formatTime(this.calcTotalTime);
        }
    },
    methods: {
        /** 
         * 経過時間が1時間未満のものは「X分」、1時間以上のものは「X時間X分」にフォーマット
         * @param {number} time
         * @return {string}
         */
        formatTime(time) {
            if (time < 60) {
                return time + ' 分';
            }
            const hour = Math.floor(time / 60);
            const min = time % 60;
            return hour + ' 時間 ' + min + ' 分';
        },
        /** 各tagに含まれるすべてのkeywordを一次配列にして返す */
        concatAllKeywords() {
            let allKeywords = [];
            Object.values(this.tags)
                .map(tag => tag.keywords)
                .map(kewordObj => Object.values(kewordObj))
                .forEach(keywords => allKeywords = allKeywords.concat(keywords));
            return allKeywords;
        }
    }
}
</script>

<style scoped>
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
