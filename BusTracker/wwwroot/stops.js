import { map } from './map.js';

const stopLayer = L.layerGroup().addTo(map);

export function clearStops() {
  stopLayer.clearLayers();
  document.getElementById('stops').innerHTML = '';
}

export async function loadStops(rt, dir) {
  clearStops();

  const res = await fetch(`/api/patterns?rt=${rt}`);
  const data = await res.json();
  const patterns = (data['bustime-response'].ptr || []).filter(p => p.rtdir === dir);

  const list = document.getElementById('stops');
  const seen = new Set();
  const allPoints = [];

  for (const p of patterns) {
    const pts = [...p.pt].sort((a, b) => a.seq - b.seq);
    const line = pts.map(pt => [pt.lat, pt.lon]);
    allPoints.push(...line);

    L.polyline(line, { color: '#028090', weight: 5, opacity: 0.85 }).addTo(stopLayer);

    for (const pt of pts) {
      if (pt.typ !== 'S' || seen.has(pt.stpid)) continue;
      seen.add(pt.stpid);

      const marker = L.circleMarker([pt.lat, pt.lon], {
        radius: 5,
        color: '#028090',
        weight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 1
      })
        .bindPopup(pt.stpnm)
        .addTo(stopLayer);

      const li = document.createElement('li');
      li.textContent = pt.stpnm;
      li.addEventListener('click', () => {
        map.flyTo([pt.lat, pt.lon], 16);
        marker.openPopup();
      });
      list.appendChild(li);
    }
  }

  if (allPoints.length) {
    map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] });
  } else {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No stops found for this direction.';
    list.appendChild(li);
  }
}
