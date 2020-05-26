// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jobmaster.co.il/jobs/?q=*
// @match         https://www.jobmaster.co.il/jobs/index.asp?currPage*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

let job_info_selector = "article:not(.Point)";
let job_info_arrow_selector = "a.MobileJobLink.ArrowUpdate";
let not_relevant_selector = ".nonRelevantText";
//let job_info_trash_selector = "span.bttn.Delete";
let next_button_selector = "#paging > a:last-child";
let apply_for_button_selector = ".bttn.blue.full";
let window_selector = "#modal_window";
let apply_button_selector = "#buttons > input.bttn.blue.SaveButton.WithCancel";
let ErrInput_selector = ".ErrInput";
const GLOBAL_TIMEOUT = 3000
function delayPromise(delay){
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
        if (obj.length==0 || (obj.length > 0 && (obj.css('display') == 'none' || obj.css("visibility") == "hidden")))
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
async function main(){
let job_infos = await $(job_info_selector)
for(const job_info of Array.from(job_infos)){
    let job_info_arrow = $("#"+job_info.id).find(job_info_arrow_selector)
    //let job_info_trash = $("#"+job_info.id).find(job_info_trash_selector)

    job_info_arrow.click()
    await get_selector_not_visible(apply_for_button_selector,30,Infinity)
    await delayPromise(3000)
    try{
    let apply_for_button = (await get_selector_visible(apply_for_button_selector,30))
    apply_for_button.click();
    }
    catch(e){
        continue
}
    try{
        await applyforwaitwindow()
        if((await get_selector_visible(ErrInput_selector)).length>1){
            throw "Requests a questionare"
        }
        await delayPromise(3000)
        let apply_button = await get_selector_visible(apply_button_selector)
        apply_button.click()
        await get_selector_not_visible(window_selector,30,Infinity)
    }
    catch(e){
        console.error(e)
        console.info("removing")
        await delayPromise(300)
        $("#buttons > input").click()
        await get_selector_not_visible(window_selector,30,Infinity)
        //job_info_trash.click()
        await delayPromise(300)

    }


}
let next_button = (await get_selector_visible(next_button_selector))[0]
    if(job_infos.length==0){
    console.log("nothing found")
        await delayPromise(1000*60*60*24)
    }
//    console.log("reloading")
//    location.reload()
await delayPromise(300)
next_button.click()
}
    main();
})();