// Vite ver
let googleMeetStopWatchApp = {};

window.addEventListener("load", () => {
  googleMeetStopWatchApp.startTime = new Date();
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("NHaLPe")) {
      recordMeetingTime();
    }
  });
  // chrome.runtime.sendMessage({status: "start"});
});

window.addEventListener("beforeunload", () => {
  recordMeetingTime();
  // chrome.runtime.sendMessage({status: "end"});
});

function recordMeetingTime() {
  if (googleMeetStopWatchApp.startTime === undefined) return;
  googleMeetStopWatchApp.endTime = new Date();
  let data = {};
  data.date = makeZeroFilledDate();
  data.formattedDate = makeFormattedDate();
  data.startDatetime = googleMeetStopWatchApp.startTime;
  data.actualTime = Math.abs(
    googleMeetStopWatchApp.endTime - googleMeetStopWatchApp.startTime
  );
  data.elapsedTime = calculateElapsedTime(data.actualTime);
  data.meetingTitle = getMeetingTitle();
  data.meetUrl = location.origin + location.pathname;
  saveToStorage(data);
  outputConsoleLog(data);
  delete googleMeetStopWatchApp.startTime;
}

function makeZeroFilledDate() {
  let month = googleMeetStopWatchApp.endTime.getMonth() + 1;
  let monthString = month < 10 ? "0" + month : "" + month;
  let date = googleMeetStopWatchApp.endTime.getDate();
  let dateString = date < 10 ? "0" + date : "" + date;
  return (
    "" + googleMeetStopWatchApp.endTime.getFullYear() + monthString + dateString
  );
}

function makeFormattedDate() {
  let month = googleMeetStopWatchApp.endTime.getMonth() + 1;
  let dayOfWeek = googleMeetStopWatchApp.endTime.getDay();
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    "" +
    googleMeetStopWatchApp.endTime.getFullYear() +
    "年" +
    month +
    "月" +
    googleMeetStopWatchApp.endTime.getDate() +
    "日(" +
    dayOfWeekStr[dayOfWeek] +
    ")"
  );
}

/**
 * googleMeetStopWatchRecords: [
 *  {
 *      date: '20220415',
 *      formattedDate: '2022年4月15日(金)',
 *      details: [
 *          {
 *              id: '20220415-1',
 *              elapsedTime: 5,
 *              meetingTitle: 'チームDaily'
 *          },
 *          ...
 *      ]
 *  }
 *
 * @param {*} data
 */
function saveToStorage(data) {
  const KEY = "googleMeetStopWatchRecords";
  const keyPerDate = data.date;
  chrome.storage.local.get(KEY).then((records) => {
    const allRecords = records[KEY] || [];

    let index = allRecords.findIndex((r) => r.date === keyPerDate);
    const recordsPerDate = index > -1 ? allRecords[index] : {};
    const recordDetails = recordsPerDate.details || [];
    recordDetails.push({
      id: Date.now(),
      elapsedTime: data.elapsedTime,
      meetingTitle: getMeetingTitle(),
    });

    let newRecordsPerDate = {
      date: data.date,
      formattedDate: data.formattedDate,
      details: recordDetails,
    };
    if (index > -1) {
      allRecords[index] = newRecordsPerDate;
    } else {
      allRecords.unshift(newRecordsPerDate);
    }
    console.log("【Google Meet Stopwatch Log】");
    console.table(allRecords);

    const newAllRecords = {};
    newAllRecords[KEY] = allRecords;
    chrome.storage.local.set(newAllRecords, () => {
      chrome.storage.local.get(KEY, function (records) {
        console.log(
          "【Google Meet Stopwatch Log】set meeting record successfully!"
        );
        console.table(records[KEY]);
      });
    });
  });
}

/**
 * @deprecated v1.3.0～
 * {
 *   googleMeetStopWatchRecords: {
 *     20220415: [{
 *       date: 20220415,
 *       formattedDate: '2022年4月15日(金)'
 *       actualTime: 300(ms),
 *       elapsedTime: 5(min)
 *       meetingTitle: 'xxx',
 *       meetingUrl: 'xxx'
 *     ],
 *     20220414: [{
 *       ...
 *     ],
 *     ...
 *   }
 * @param {*} data
 */
function saveToStorageV1(data) {
  const KEY = "googleMeetStopWatchRecords";
  const keyPerDate = data.date;
  chrome.storage.local.get(KEY, (recordsV2) => {
    let allRecords = recordsV2[KEY] || {};
    let recordsPerDate = allRecords[keyPerDate] || [];
    recordsPerDate.push(data);
    allRecords[keyPerDate] = recordsPerDate;

    const newAllRecords = {};
    newAllRecords[KEY] = allRecords;
    chrome.storage.local.set(newAllRecords, () => {
      chrome.storage.local.get(KEY, function (recordsV2) {
        console.log("【Google Meet Stopwatch Log】" + recordsV2[KEY]);
      });
    });
  });
}

function getMeetingTitle() {
  const meetingTitleCandidate = document.querySelector("[data-meeting-title]");
  if (meetingTitleCandidate && meetingTitleCandidate.dataset.meetingTitle) {
    return meetingTitleCandidate.dataset.meetingTitle;
  }
  return location.pathname;
}

function calculateElapsedTime(actualTime) {
  const elapsedSeconds = actualTime / 1000;
  if (elapsedSeconds < 60) {
    return 0;
  }
  return Math.round(elapsedSeconds / 60);
}

function outputConsoleLog(data) {
  const meetingTitle = getMeetingTitle();
  if (data.elapsedTime === 0) {
    console.log(
      "ミーティング【" +
        data.meetingTitle +
        "】の所要時間は 【1分未満】 でした。"
    );
    return;
  }
  console.log(
    "ミーティング【" +
      data.meetingTitle +
      "】の所要時間は 【約" +
      data.elapsedTime +
      "分】 でした。"
  );
}
