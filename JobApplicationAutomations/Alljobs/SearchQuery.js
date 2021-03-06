// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.alljobs.co.il/SearchResultsGuest.aspx*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let open_board_selector = "div.openboard-container-jobs"
    let job_info_selector = open_board_selector+" >* "+".job-box.(job-border-regular,job-border-highlight) > div:not(.DisplayN)"
    let send_cv_button_selector = "div.job-button-send > a[ng-click^='SendCV']";
    let send_cv_already_submitted_selector = "div > div.job-scvs-cnt";
    let next_button_selector = "div.jobs-paging-next > a";

    let job_sendcv_form_selector = "#job-sendcv-form";
    const GLOBAL_TIMEOUT = 3000
    function delayPromise(delay) {
        return new Promise(resolve => setTimeout(() => resolve(), delay))
    }
    async function get_selector_visible(selector, period, timeout = GLOBAL_TIMEOUT) {
        let s_time = performance.now()
        while (performance.now() - s_time < timeout) {
            let obj = $(selector)
            if (obj.length > 0 && !(obj.css('display') == 'none' || obj.css("visibility") == "hidden"))
                // checks if exists in dom? and supposedly? visible
                return obj
            await delayPromise(period)
        }
        throw "Waiting timed out: " + selector;
    }
    async function get_selector_not_visible(selector, period, timeout = GLOBAL_TIMEOUT) {
        let s_time = performance.now()
        while (performance.now() - s_time < timeout) {
            let obj = $(selector)
            if (obj.length == 0 || (obj.length > 0 && (obj.css('display') == 'none' || obj.css("visibility") == "hidden")))
                // checks if exists in dom? and supposedly? visible
                return obj
            await delayPromise(period)
        }
        throw "Waiting timed out: " + selector;
    }

    async function applyforwaitwindow() {
        //click and wait for win to show up
        // add_button.click()
        let window = await get_selector_visible(window_selector)
        await get_selector_visible(apply_button_selector)
        return window
    }
    async function main() {
        let job_infos = $(job_info_selector)
        for (const job_info of Array.from(job_infos)) {
            try {
                await get_selector_visible("#" + job_info.id)
                let send_cv_already_submitted = $("#" + job_info.id).find(send_cv_already_submitted_selector).length > 0
                if (send_cv_already_submitted) {
                    throw "Already submitted"
                }

                let send_cv_button = (await get_selector_visible("#" + job_info.id + " >* " + send_cv_button_selector))[0];
                send_cv_button.click()
                if((await get_selector_visible(job_sendcv_form_selector)).length > 0){
                   "send form active"
                }
                await get_selector_not_visible("#" + job_info.id)
                await delayPromise(1000)
            }
            catch (e) {
                console.error(e)
                console.error("#" + job_info.id)
                try {
                     $("#" + job_info.id + " >* " + ".job-delete-fmlst"+" , "+"#" + job_info.id + " >* " + ".job-delete-disabled").click()
                }
                catch (e) { }
                try{
                    if((await get_selector_visible(job_sendcv_form_selector)).length > 0){
                        $("div.job-sendcv-boxclose > img").click()
                        delayPromise(100)
                    }
                }
                catch(e){}
                continue
            }



        }
        let next_button = (await get_selector_visible(next_button_selector))[0]
        await delayPromise(300)
        next_button.click()
    }
    main();
})();