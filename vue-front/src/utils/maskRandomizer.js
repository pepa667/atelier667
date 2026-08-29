const applyRandomMaskPositions = () => {
  const pcxElements = document.querySelectorAll('[class*="pcx-grunge-"]');
  const pcxMixElements = document.querySelectorAll('[class*="pcx-mix-"]');

  const getRandomPos = () =>
    `${Math.floor(Math.random() * 100) * 1}% ${Math.floor(Math.random() * 100) * 1}%`;

  pcxElements.forEach((el) => {
    // getComputedStyle pega o valor final compilado, venha do CSS ou de inline style
    const currentPos = getComputedStyle(el)
      .getPropertyValue("--mask-pos")
      .trim();

    if (!currentPos) {
      el.style.setProperty("--mask-pos", getRandomPos());
    }
  });

  pcxMixElements.forEach((el) => {
    const computedStyle = getComputedStyle(el);
    const pos1 = computedStyle.getPropertyValue("--mask-pos-1").trim();
    const pos2 = computedStyle.getPropertyValue("--mask-pos-2").trim();

    if (!pos1) {
      el.style.setProperty("--mask-pos-1", getRandomPos());
    }

    if (!pos2) {
      el.style.setProperty("--mask-pos-2", getRandomPos());
    }
  });
};

export default applyRandomMaskPositions;
