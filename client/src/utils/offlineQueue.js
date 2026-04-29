const KEY = 'manigo_offline_queue';
const EVENT = 'manigo-queue-update';

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToQueue(item) {
  const q = getQueue();
  q.push(item);
  localStorage.setItem(KEY, JSON.stringify(q));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function saveQueue(queue) {
  localStorage.setItem(KEY, JSON.stringify(queue));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onQueueChange(fn) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
