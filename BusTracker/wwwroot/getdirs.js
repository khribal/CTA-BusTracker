import { loadStops } from './stops.js';

export async function dirs(rt) {
  const res = await fetch(`/api/directions?rt=${rt}`);
  const data = await res.json();
  const directions = data['bustime-response'].directions || [];

  const box = document.getElementById('dirs');
  box.innerHTML = '';

  directions.forEach((d, i) => {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'dir';
    radio.value = d.dir;
    radio.checked = i === 0;
    radio.addEventListener('change', () => loadStops(rt, d.dir));

    const text = document.createElement('span');
    text.textContent = d.dir;

    label.append(radio, text);
    box.appendChild(label);
  });

  if (directions.length) loadStops(rt, directions[0].dir);
}
