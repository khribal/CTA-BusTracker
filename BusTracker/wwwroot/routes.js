async function routes() {
  const res = await fetch('/api/routes');
  const data = await res.json();
  const routes = data['bustime-response'].routes || [];

  const list = document.getElementById('routes');
  list.innerHTML = '';

  for (const r of routes) {
    const option = document.createElement('option');
    option.value = r.rt;
    option.textContent = `${r.rt} - ${r.rtnm}`;
    list.appendChild(option);
  }
}
routes();