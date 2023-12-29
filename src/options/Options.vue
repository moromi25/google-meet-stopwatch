<template>
    <div class="options-container">
        <div class="section">
            <div class="section-title">タグとキーワードの設定</div>
            <div class="section-description">
                タグを設定することで、ミーティング名でグルーピングして1日のミーティング時間を集計できます。
                <br>
                タグにキーワードを紐づけることで、キーワードに部分一致するミーティング名をグルーピングできます。
            </div>
            <!--
            <button id="restore-tags-for-debug" @click="restoreTagsForDebug">restore</button>
            <button id="get-storage-data-for-debug" @click="getStorageDataForDebug">getStorageData</button>
            -->
            <div class="section-content">
                <TagListSection :tags="this.googleMeetStopWatchTags" @trigger-update-tag="updateTag"
                    @trigger-delete-tag="deleteTag" @trigger-delete-keyword="deleteKeyword">
                </TagListSection>
                <TagCreateSection @trigger-add-tag="updateTag"></TagCreateSection>
            </div>
        </div>
    </div>
</template>
  
<script>
import TagListSection from '@/options/components/TagListSection.vue'
import TagCreateSection from '@/options/components/TagCreateSection.vue'

export default {
    name: 'GoogleMeetStopwatchOptions',
    components: {
        TagListSection,
        TagCreateSection,
    },
    data: function () {
        return {
            googleMeetStopWatchTags: {}
        }
    },
    beforeMount() {
        const KEY_TAGS = "googleMeetStopWatchTags";
        chrome.storage.local.get(KEY_TAGS, (result) => {
            this.googleMeetStopWatchTags = result[KEY_TAGS] || {};
            console.table(this.googleMeetStopWatchTags);
        });
    },
    methods: {
        updateTag(tagKey, newTag) {
            this.googleMeetStopWatchTags[tagKey] = newTag;
            this.UpdateStorage();
        },
        deleteTag(tagKey) {
            delete this.googleMeetStopWatchTags[tagKey];
            this.UpdateStorage();
        },
        deleteKeyword(tagKey, keyword) {
            const keywords = this.googleMeetStopWatchTags[tagKey].keywords;
            const newKeywords = keywords.filter(item => item !== keyword);
            this.googleMeetStopWatchTags[tagKey].keywords = newKeywords;
            this.UpdateStorage();
        },
        UpdateStorage() {
            // const newTags = structuredClone(this.googleMeetStopWatchTags);
            const newTags = JSON.parse(JSON.stringify(this.googleMeetStopWatchTags));
            const KEY_TAGS = "googleMeetStopWatchTags";
            chrome.storage.local.set({ [KEY_TAGS]: newTags }).then(() => {
                console.log("【Google Meet Stopwatch] Tags are saved.");
                chrome.storage.local.get(KEY_TAGS).then((result) => {
                    console.log("【Google Meet Stopwatch Log】saved tags: ");
                    console.table(result[KEY_TAGS]);
                    this.googleMeetStopWatchTags = result[KEY_TAGS];
                });
            });
        },
        restoreTagsForDebug() {
            // >> for RESTORE start
            const KEY_TAGS = "googleMeetStopWatchTags";
            chrome.storage.local.remove(KEY_TAGS);
            const TAGS = {
                teamMtg: {
                    title: 'TeamMTG/OneOnOne',
                    keywords: [
                        'Daily Discussion',
                        'WS Daily MTG',
                        'Leader MTG',
                        'OneOnOne',
                        '週次ディスカッション'
                    ]
                },
                featureDev: {
                    title: '機能開発（非コミット）',
                    keywords: [
                        'CSR Dept x VUP Partner Grp. MTG'
                    ]
                },
                inquiry: {
                    title: '顧客対応/問い合わせ対応',
                    keywords: []
                },
            };
            chrome.storage.local.set({ [KEY_TAGS]: TAGS }, () => {
                console.log("【Google Meet Stopwatch] Tags are restored.");
                chrome.storage.local.get(KEY_TAGS, function (result) {
                    console.log("【Google Meet Stopwatch Log】saved tags: ");
                    console.table(result[KEY_TAGS]);
                    this.googleMeetStopWatchTags = result[KEY_TAGS];
                });
            });
            // >> for RESTORE end
        },
        getStorageDataForDebug() {
            const KEY_TAGS = "googleMeetStopWatchTags";
            const KEY_RECORDS = "googleMeetStopWatchRecords";
            chrome.storage.local.get(KEY_TAGS).then((result) => {
                console.log("==============================================");
                console.log("【Google Meet Stopwatch Log】tags in storage: ");
                console.table(result[KEY_TAGS]);
                console.log("==============================================");
            });
            chrome.storage.local.get(KEY_RECORDS).then((result) => {
                console.log("==============================================");
                console.log("【Google Meet Stopwatch Log】records in storage: ");
                console.table(result[KEY_RECORDS]);
                console.log("==============================================");
            });
        },
    },
}
</script>

<style>
#options {
    display: flex;
    justify-content: center;
}

#options ul {
    margin-top: 0;
    padding: 0 8px 0 0;
    position: relative;
}

#options ul li {
    list-style-type: none !important;
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

.section-title {
    font-size: 24px;
}

.section-description {
    font-size: 12px;
    margin: 4px 0 16px 0;
}

.section-content {
    display: flex;
    min-width: 750px;
}

.section-detail {
    padding: 8px 24px;
}

.tag-list-section {
    width: 50%
}

.input-field input {
    height: 20px;
    width: 100%;
    border: solid 1px #7f7f7f;
    border-radius: 4px;
    padding: 2px 8px;
}

.input-field input::placeholder {
    color: #aeaeae
}

.input-field input:focus,
.input-field input:focus-visible {
    outline: none;
}
</style>
