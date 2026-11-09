import { direction } from './direction.js';
import { dirs } from './getdirs.js';
import { clearStops } from './stops.js';
import { map } from './map.js';

const busLayer = L.layerGroup().addTo(map);

const busIcon = L.divIcon({
  html: '<div><img src="img/bus.png" alt=""></div>',
  className: 'bus-marker',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18]
});

function showEmpty(list, message) {
  const li = document.createElement('li');
  li.className = 'empty';
  li.textContent = message;
  list.appendChild(li);
}

async function loadBuses(rt) {
  const res = await fetch(`/api/vehicles?rt=${rt}`);
  const data = await res.json();
  const vehicles = data['bustime-response'].vehicle || [];

  const list = document.getElementById('buses');
  const count = document.getElementById('bus-count');
  list.innerHTML = '';
  count.textContent = '';
  busLayer.clearLayers();

  if (vehicles.length === 0) {
    showEmpty(list, 'No buses on that route right now.');
    return false;
  }

  count.textContent = vehicles.length;

  for (const v of vehicles) {
    const heading = direction(v.hdg);

    const marker = L.marker([v.lat, v.lon], { icon: busIcon })
      .bindPopup(`<strong>Bus ${v.vid}</strong><br>To ${v.des}<br>Heading ${heading}`)
      .addTo(busLayer);

    const li = document.createElement('li');

    const id = document.createElement('span');
    id.className = 'bus-id';
    id.textContent = `#${v.vid}`;

    const info = document.createElement('div');
    info.className = 'bus-info';

    const dest = document.createElement('span');
    dest.className = 'bus-dest';
    dest.textContent = `To ${v.des}`;

    const hdg = document.createElement('span');
    hdg.className = 'bus-heading';
    hdg.textContent = `Heading ${heading}`;

    info.append(dest, hdg);
    li.append(id, info);
    li.addEventListener('click', () => {
      map.flyTo([v.lat, v.lon], 16);
      marker.openPopup();
    });
    list.appendChild(li);
  }

  return true;
}

document.getElementById('go').addEventListener('click', async () => {
  const rt = document.getElementById('routes').value;
  const hasBuses = await loadBuses(rt);

  if (hasBuses) {
    dirs(rt);
  } else {
    document.getElementById('dirs').innerHTML = '';
    clearStops();
  }
});
