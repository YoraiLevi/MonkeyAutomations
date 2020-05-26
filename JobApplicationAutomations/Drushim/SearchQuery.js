// ==UserScript==
// @name         Drushim Auto Apply
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.drushim.co.il/jobs/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  "use strict";

  let job_info_selector = ".jobContainer";
  let send_cv_button_selector = "a.sendCV[action=popup]";

  let next_button_selector =
    "#MainContent_JobList_jobList > div.jobListPageNumberContainer.contentDivider > a:last-child";
  let window_selector = "#cboxLoadedContent";
  let close_button_selector = "#cboxClose";
  let send_success_selector =
    "div.sendCVResult > div > div.successfulContainer > div";
  let submit_button_selector =
    window_selector + " >* " + ".stdButton.orangeBg.roundCorners";

  const GLOBAL_TIMEOUT = 3000;
  function delayPromise(delay) {
    return new Promise((resolve) => setTimeout(() => resolve(), delay));
  }
  async function get_selector_visible(
    selector,
    period,
    timeout = GLOBAL_TIMEOUT
  ) {
    let s_time = performance.now();
    while (performance.now() - s_time < timeout) {
      let obj = $(selector);
      if (
        obj.length > 0 &&
        !(obj.css("display") == "none" || obj.css("visibility") == "hidden")
      )
        // checks if exists in dom? and supposedly? visible
        return obj;
      await delayPromise(period);
    }
    throw "Waiting timed out: " + selector;
  }
  async function get_selector_not_visible(
    selector,
    period,
    timeout = GLOBAL_TIMEOUT
  ) {
    let s_time = performance.now();
    while (performance.now() - s_time < timeout) {
      let obj = $(selector);
      if (
        obj.length == 0 ||
        (obj.length > 0 &&
          (obj.css("display") == "none" || obj.css("visibility") == "hidden"))
      )
        return obj;
      await delayPromise(period);
    }
    throw "Waiting timed out: " + selector;
  }

  async function applyforwaitwindow() {
    let window = await get_selector_visible(window_selector);
    await get_selector_visible(apply_button_selector);
    return window;
  }
  async function main() {
    const SESSION_MAX = 35;
    let session_start = GM_getValue("session_start", new Date());
    let session_count = GM_getValue("session_count", 0);
    let session_end = new Date(+session_start);
    session_end.setHours(28, 0, 0, 0);
    let new_session = new Date() - session_end >= 0;
    if (new_session) {
      GM_setValue("session_start", new Date());
      GM_setValue("session_count", 0);
      session_start = GM_getValue("session_start", new Date());
      session_count = GM_getValue("session_count", 0);
    }
    let job_infos = $(send_cv_button_selector);
    for (const send_button of Array.from(job_infos)) {
      if (session_count > SESSION_MAX) {
        console.error("session at capacity");
        await delayPromise(1000 * 60 * 60 * 1);
        location.reload();
      }
      send_button.click();
      try {
        let submit_button = await get_selector_visible(submit_button_selector);
        await delayPromise(1000);
        submit_button[0].click();
        await get_selector_visible(send_success_selector);
        await delayPromise(1000);
        $(close_button_selector)[0].click();
        await delayPromise(1000);
        await get_selector_not_visible(window_selector, 30, Infinity);
        await delayPromise(1000);
        session_count += 1;
        GM_setValue("session_count", session_count);
      } catch (e) {
        console.error(e);
        $(close_button_selector)[0].click();
        await get_selector_not_visible(window_selector, 30, Infinity);
      }
      await delayPromise(1000);
    }
    let next_button = (await get_selector_visible(next_button_selector))[0];
    await delayPromise(300);
    next_button.click();
  }
  main();
})();
