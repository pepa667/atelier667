const applyRandomMaskPositions = () => {
  const pcxElements = document.querySelectorAll('[class*="pcx-grunge-"]');

  pcxElements.forEach((el) => {
    const x = Math.floor(Math.random() * 100) * 10;
    const y = Math.floor(Math.random() * 100) * 10;

    el.style.setProperty("--mask-pos", `${x}% ${y}%`);
  });
};

export default applyRandomMaskPositions;
