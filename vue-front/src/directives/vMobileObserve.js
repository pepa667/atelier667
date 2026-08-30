// directives/vMobileObserve.js

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
const observerMap = new WeakMap();

export const vMobileObserve = {
  mounted(el, binding) {
    if (!isMobile()) return;

    // Permite sobrescrever o threshold via prop da diretiva ou usa 0.4 como padrão
    const customThreshold = binding.value?.threshold ?? 0.4;
    const customMargin = binding.value?.rootMargin ?? "0px 0px -50px 0px";

    const observerConfig = {
      root: null,
      rootMargin: customMargin,
      threshold: customThreshold,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("onView");
        // Dispara o evento de glitch se houver callback passada
        if (typeof binding.value?.onIntersect === "function") {
          binding.value.onIntersect();
        }
      } else {
        el.classList.remove("onView");
      }
    }, observerConfig);

    observer.observe(el);
    observerMap.set(el, observer);
  },

  unmounted(el) {
    const observer = observerMap.get(el);
    if (observer) {
      observer.disconnect();
      observerMap.delete(el);
    }
  },
};
