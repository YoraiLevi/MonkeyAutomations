const GLOBAL_TIMEOUT = 3000
function wait_ms(delay){
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