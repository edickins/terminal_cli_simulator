export function Observer(elemToObserve, cssClass) {
  let prevClassState = elemToObserve.classList.contains(cssClass);
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName == "class") {
        let currentClassState = mutation.target.classList.contains(cssClass);
        if (currentClassState !== prevClassState) {
          prevClassState = currentClassState;
          if (currentClassState) {
            console.log("Class added!");
          } else {
            console.log("Class removed!");
          }
        }
      }
    });
  });

  observer.observe(elemToObserve, { attributes: true });

  return observer;
}
