//This is a libary file, ultimately this should be packaged by 'parcel' or 'webpack' so it's 1) readable 2) can be used by nodejs
//currently this uses jquery, should probably deprecate that it
const page_interactions = (function () {
  // Global Module Scope and Module Privates
  const GLOBAL_TIMEOUT = 3000;
  // Public
  return {
    wait_ms: function (delay) {
      return new Promise((resolve) => setTimeout(() => resolve(), delay));
    },
    get_selector_visible: async function (
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
    },
    get_selector_not_visible: async function(
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
          // checks if exists in dom? and supposedly? visible
          return obj;
        await delayPromise(period);
      }
      throw "Waiting timed out: " + selector;
    },
  };
})();