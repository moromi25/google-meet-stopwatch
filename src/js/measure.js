let googleMeetStopWatchApp = {};

window.addEventListener("load", () => {
  googleMeetStopWatchApp.startTime = new Date();
  bindHangUpEvent();

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

  data.meetingTitle = googleMeetStopWatchApp.meetingTitle;
  data.meetUrl = location.origin + location.pathname;

  saveToStorage(data);
  outputConsoleLog(data);
  delete googleMeetStopWatchApp.startTime;
}

function bindHangUpEvent() {
  let mutationObserver = new MutationObserver(function () {
    console.log("【Google Meet Stopwatch Log】start getting meeting title...");
    const targets = document.querySelectorAll(".NHaLPe");
    if (targets.length > 0) {
      targets.forEach(function (target) {
        target.addEventListener("click", recordMeetingTime);
      });
      googleMeetStopWatchApp.meetingTitle = getMeetingTitle();
      console.log(
        "【Google Meet Stopwatch Log】meeting title: " +
          googleMeetStopWatchApp.meetingTitle
      );
      mutationObserver.disconnect();
    }
  });
  mutationObserver.observe(document.getElementById("yDmH0d"), {
    childList: true,
    subtree: true,
  });
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
  if (googleMeetStopWatchApp.meetingTitle == null) {
    // 一応再取得
    console.log(
      "【Google Meet Stopwatch Log】Could not get the meeting title. Let's re-try to get meeting title..."
    );
    googleMeetStopWatchApp.meetingTitle = getMeetingTitle();
    console.log(
      "【Google Meet Stopwatch Log】meeting title: " +
        googleMeetStopWatchApp.meetingTitle
    );
  }

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
      meetingTitle: googleMeetStopWatchApp.meetingTitle,
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

function getMeetingTitle() {
  const meetingTitleCandidate = document.querySelector("[data-meeting-title]");
  if (
    meetingTitleCandidate &&
    meetingTitleCandidate.dataset.meetingTitle != null &&
    meetingTitleCandidate.dataset.meetingTitle !== ""
  ) {
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
