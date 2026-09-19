window.PFHWeather=(function(){
 const $=s=>document.querySelector(s);
 const codeIcon=c=>c===0?'☀️':c<=2?'🌤️':c===3?'☁️':c<=48?'🌫️':c<=67?'🌧️':c<=77?'🌨️':c<=82?'🌦️':c<=86?'🌨️':'⛈️';
 const codeText=c=>c===0?'Clear':c===1?'Mostly clear':c===2?'Partly cloudy':c===3?'Cloudy':c<=48?'Foggy':c<=57?'Drizzle':c<=67?'Rain':c<=77?'Snow':c<=82?'Showers':c<=86?'Snow showers':'Thunderstorms';
 async function fetchWeather(lat,lon){
   // Rounded coordinates are enough for neighborhood weather and avoid sending precise GPS coordinates.
   lat=Math.round(lat*100)/100; lon=Math.round(lon*100)/100;
   const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;
   const r=await fetch(url); if(!r.ok) throw Error('Weather unavailable');
   const w=await r.json(), c=w.current||{}, d=w.daily||{};
   $('.weatherIcon').textContent=codeIcon(c.weather_code);
   $('#weatherTemp').textContent=Math.round(c.temperature_2m)+'°';
   const hi=Math.round(d.temperature_2m_max?.[0]), lo=Math.round(d.temperature_2m_min?.[0]), rain=d.precipitation_probability_max?.[0];
   $('#weatherForecast').textContent=`${codeText(d.weather_code?.[0]??c.weather_code)} · H ${hi}° / L ${lo}°${rain>=20?' · '+rain+'% rain':''}`;
 }
 function init(){
   const box=$('#weatherBox'); if(!box)return;
   if(!navigator.geolocation){$('#weatherForecast').textContent='Weather unavailable';return;}
   navigator.geolocation.getCurrentPosition(p=>fetchWeather(p.coords.latitude,p.coords.longitude).catch(()=>$('#weatherForecast').textContent='Weather unavailable'),()=>{$('#weatherTemp').textContent='Weather';$('#weatherForecast').textContent='Tap to enable location';},{enableHighAccuracy:false,maximumAge:1800000,timeout:7000});
   box.onclick=()=>navigator.geolocation.getCurrentPosition(p=>fetchWeather(p.coords.latitude,p.coords.longitude).catch(()=>{}),()=>alert('Allow location access in the browser to show local weather.'),{enableHighAccuracy:false,maximumAge:0,timeout:7000});
 }
 return {init};
})();
