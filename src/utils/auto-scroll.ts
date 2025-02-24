const RATE = 4;

let currentScroll: 'up' | 'down' | null = null;

// TODO: add timer-based incrementing for inter-device consistency
const autoScroll = () => {
  if (currentScroll !== null) {
    window.scrollBy({ top: currentScroll === 'up' ? -RATE : RATE });
    requestAnimationFrame(autoScroll);
  }
};

export const startAutoScroll = (type: Exclude<typeof currentScroll, null>) => {
  const isStopped = currentScroll === null;
  currentScroll = type;
  if (isStopped) autoScroll();
};

export const stopAutoScroll = () => {
  currentScroll = null;
};
