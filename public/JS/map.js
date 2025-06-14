mapboxgl.accessToken=mToken;
console.log(mToken);
mcoordinates=JSON.parse(mcoordinates);
mtitle=JSON.parse(mtitle);
mlocation=JSON.parse(mlocation);
console.log(typeof mcoordinates);
console.log(mcoordinates);

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",//Style URL
        center:mcoordinates,
        zoom: 9 
});
const marker1 = new mapboxgl.Marker({color:"red",rotation:10})
        .setLngLat(mcoordinates)
        // .setpopup(new mapboxgl.Popup({offset:25,}).setHTML("<h1>My Message</h1>").setMaxWidth("300px"))
        .addTo(map);
const popup = new mapboxgl.Popup({offset:25})
    .setLngLat(mcoordinates)
    .setHTML(`<p><b>Place: ${mtitle}</b><br> Location: ${mlocation}</p>`)
    .setMaxWidth("300px")
    .addTo(map);