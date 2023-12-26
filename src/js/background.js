chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case "update":
            const previousVersion = details.previousVersion;
            if (previousVersion === "1.2.0") {
                convertToRecordsV2();
            } else if (previousVersion === "1.3.0") {
                updateRecordsByDateDesc();
            }
            break;
        default:
            break;
    }
});

function sortRecordsByDateDesc(originalRecords) {
    return structuredClone(originalRecords).sort((a, b) => (a.date > b.date ? -1 : 1));
}

function updateRecordsByDateDesc() {
    const KEY = 'googleMeetStopWatchRecords';
    chrome.storage.local.get(KEY).then((result) => {
        const originalRecords = result[KEY];
        const sortedRecords = sortRecordsByDateDesc(originalRecords);
        chrome.storage.local.set({ [KEY]: sortedRecords }, () => {
            console.log("【Google Meet Stopwatch Log】records are sorted by dates successfully!");
        });

    });

}

function convertToRecordsV2() {
    const KEY = 'googleMeetStopWatchRecords';
    chrome.storage.local.get(KEY, function (googleMeetStopWatchRecordsV1) {
        if (!googleMeetStopWatchRecordsV1 || !googleMeetStopWatchRecordsV1[KEY]) return;

        const recordsV1Actual = googleMeetStopWatchRecordsV1[KEY];
        const recordsV2 = [];
        const recordDates = Object.keys(recordsV1Actual).sort();

        for (const date of recordDates) {
            const details = recordsV1Actual[date].map((record) => {
                return {
                    elapsedTime: record.elapsedTime,
                    id: Date.now() + Math.floor(Math.random() * 1000), // 乱数を使った ID を生成
                    meetingTitle: record.meetingTitle
                }
            });

            recordsV2.push({
                date: date,
                details: details,
                formattedDate: recordsV1Actual[date][0].formattedDate // date に対応するフォーマットされた日付は配列の先頭にあるため、それを使う
            });
        }

        if (recordsV2.length === 0) {
            return;
        }

        chrome.storage.local.set({ [KEY]: sortRecordsByDateDesc(recordsV2) }, () => {
            chrome.storage.local.get(KEY, function (recordsV2) {
                console.log("【Google Meet Stopwatch Log】records are converted to v2: ");
                console.table(recordsV2[KEY]);
                // この形になっていればOK
                // this.googleMeetStopWatchRecords = [
                //   {
                //     date: '20220414',
                //     formattedDate: '2022年4月14日(木)',
                //     details: [
                //       {
                //         id: '20220414-1',
                //         elapsedTime: 5,
                //         meetingTitle: 'チームDaily'
                //       },
                //       {
                //         id: '20220414-2',
                //         elapsedTime: 25,
                //         meetingTitle: '修正内容レビュー'
                //       },
                //       {
                //         id: '20220414-3',
                //         elapsedTime: 56,
                //         meetingTitle: '設計レビュー(プレ)'
                //       }
                //     ]
                //   },
                //   {
                //     date: '20220415',
                //     formattedDate: '2022年4月15日(金)',
                //     details: [
                //       {
                //         id: '20220415-1',
                //         elapsedTime: 5,
                //         meetingTitle: 'チームDaily'
                //       },
                //       {
                //         id: '20220415-2',
                //         elapsedTime: 25,
                //         meetingTitle: 'OneOnOne'
                //       },
                //       {
                //         id: '20220415-3',
                //         elapsedTime: 63,
                //         meetingTitle: '設計レビュー'
                //       }
                //     ]
                //   },
                // ];
            });
        });

    });

}

function saveSampleData() {
    // saveSampleTags();
    saveSampleRecords();
}

function saveV1SampleData() {
    // saveSampleTags();
    saveV1SampleRecords();
}

function saveSampleTags() {
    const KEY = 'googleMeetStopWatchTags';
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
        inHouseEvent: {
            title: '社内行事（Dept全体MTG、全社MTG等）',
            keywords: [
                'CSR Dept.全体MTG'
            ]
        },
        seminar: {
            title: '研修受講/社外セミナー参加',
            keywords: []
        }
    };
    chrome.storage.local.set({ [KEY]: TAGS }, () => {
        chrome.storage.local.get(KEY, function (result) {
            console.log("【Google Meet Stopwatch Log】sample settings:");
            console.table(result[KEY]);
        });
    });
}

function saveSampleRecords() {
    const KEY = 'googleMeetStopWatchRecords';
    const RECORDS = [
        {
            date: '20220415',
            formattedDate: '2022年4月15日(金)',
            details: [
                {
                    id: '20220415-1',
                    elapsedTime: 5,
                    meetingTitle: 'チームDaily'
                },
                {
                    id: '20220415-2',
                    elapsedTime: 25,
                    meetingTitle: 'OneOnOne'
                },
                {
                    id: '20220415-3',
                    elapsedTime: 63,
                    meetingTitle: '設計レビュー'
                }
            ]
        },
        {
            date: '20220413',
            formattedDate: '2022年4月13日(水)',
            details: [
                {
                    id: '20220413-1',
                    elapsedTime: 27,
                    meetingTitle: 'チームDaily'
                },
            ]
        },
        {
            date: '20220414',
            formattedDate: '2022年4月14日(木)',
            details: [
                {
                    id: '20220414-1',
                    elapsedTime: 5,
                    meetingTitle: 'チームDaily'
                },
                {
                    id: '20220414-2',
                    elapsedTime: 25,
                    meetingTitle: '修正内容レビュー'
                },
                {
                    id: '20220414-3',
                    elapsedTime: 56,
                    meetingTitle: '設計レビュー(プレ)'
                }
            ]
        }
    ];
    chrome.storage.local.set({ [KEY]: RECORDS }, (result) => {
        chrome.storage.local.get(KEY, function (result) {
            console.log("【Google Meet Stopwatch Log】sample records:");
            console.table(result[KEY]);
        });
    });

}

function saveV1SampleRecords() {
    const KEY = 'googleMeetStopWatchRecords';
    const RECORDS = {
        'googleMeetStopWatchRecords': {
            '20220415': [
                {
                    date: 20220415,
                    formattedDate: '2022年4月15日(金)',
                    elapsedTime: 5,
                    meetingTitle: 'チームDaily'
                },
                {
                    date: 20220415,
                    formattedDate: '2022年4月15日(金)',
                    elapsedTime: 25,
                    meetingTitle: 'OneOnOne'
                },
                {
                    date: 20220415,
                    formattedDate: '2022年4月15日(金)',
                    elapsedTime: 43,
                    meetingTitle: '設計レビュー'
                },
            ],
            '20220413': [
                {
                    date: 20220413,
                    formattedDate: '2022年4月13日(水)',
                    elapsedTime: 5,
                    meetingTitle: 'チームDaily'
                },
                {
                    date: 20220413,
                    formattedDate: '2022年4月13日(水)',
                    elapsedTime: 25,
                    meetingTitle: '修正内容レビュー'
                },
                {
                    date: 20220413,
                    formattedDate: '2022年4月13日(水)',
                    elapsedTime: 56,
                    meetingTitle: '設計レビュー(プレ)'
                },
            ],
            '20220414': [
                {
                    date: 20220414,
                    formattedDate: '2022年4月14日(木)',
                    elapsedTime: 5,
                    meetingTitle: 'チームDaily'
                },
                {
                    date: 20220414,
                    formattedDate: '2022年4月14日(木)',
                    elapsedTime: 25,
                    meetingTitle: '修正内容レビュー'
                },
                {
                    date: 20220414,
                    formattedDate: '2022年4月14日(木)',
                    elapsedTime: 56,
                    meetingTitle: '設計レビュー(プレ)'
                },
            ]
        }
    };
    chrome.storage.local.set(RECORDS, (result) => {
        chrome.storage.local.get(KEY, function (result) {
            console.log("【Google Meet Stopwatch Log】sample records:");
            console.table(result[KEY]);
        });
    });

}
