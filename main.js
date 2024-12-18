d3.json("Data/RegionMapAll.json").then((geojson,err1)=> {

    d3.dsv(",", "Data/FestivalLoc.csv", (d) => {
        return {
            state: d.State,
            country: d.Country,
            lat: +d.Lat,
            long: +d.Long,
            place: d.Place,
            film: d.Film,
            festival: d.Festival,
            description: d.Award_Description,
            names: d.Creator
        };
    }).then((data, err2) => {
        var isActive = false;
        let stateMap;
        let markers = [];
        function jsonLoader (map, stateName){
            if (isActive && stateMap){
                map.removeLayer(stateMap);
                worldMap.addTo(map);
                isActive = false;
            }
            d3.json("Data/" + stateName + ".geojson").then((geojsonS,err1)=> {
                for (let i = 0; i < geojsonS.features.length; i++) {
                    geojsonS.features[i].properties["count"] = 0; // Initialize count

                    for (let j = 0; j < data.length; j++) {
                        if (geojsonS.features[i].properties["name"] === data[j]["state"]) {
                            geojsonS.features[i].properties["count"]++;
                            if (data[j]["place"] === "Official Selection"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: officialSelection}).addTo(map);
                            }
                            else if (data[j]["place"] === "Honorable Mention"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: honorableMention}).addTo(map);
                            }
                            else if (data[j]["place"] === "Winner"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: winner}).addTo(map);
                            }
                            else if (data[j]["place"] === "Finalist"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: finalist}).addTo(map);
                            }
                            else if (data[j]["place"] === "Semi-Finalist"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: semiFinalist}).addTo(map);
                            }
                            else if (data[j]["place"] === "Quarter-Finalist"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: quarter}).addTo(map);
                            }
                            else if (data[j]["place"] === "Nominee"){
                                marker = L.marker([data[j]["lat"], data[j]["long"]], {icon: nominee}).addTo(map);
                            }
                            if (marker && !data[j]["description"]) {
                                marker.bindPopup('<h2>' + data[j]["festival"] + '</h2>' + data[j]["film"] + " – "
                                    + data[j]["place"] + '<br>' + "Created by: " + data[j]["names"]);
                                marker.addTo(map);
                                markers.push(marker); // Add marker to array for tracking
                            }
                            else if (marker){
                                marker.bindPopup('<h2>' + data[j]["festival"] + '</h2>' + data[j]["film"] + " – "
                                    + data[j]["place"] + ": " + data[j]["description"] + '<br>' + "Created by: "
                                    + data[j]["names"]);
                                marker.addTo(map);
                                markers.push(marker); // Add marker to array for tracking
                            }
                        }
                    }
                }

                isActive = true;

                var x = parseFloat(geojsonS.properties["x"]);
                var y = parseFloat(geojsonS.properties["y"]);
                var zoom = geojsonS.properties["zoom"];

                map.removeLayer(worldMap);
                map.setView([x, y], zoom);

                stateMap = L.geoJson(geojsonS, {
                    style: state_styleSmall,
                    onEachFeature: onEachFeature
                });
                stateMap.addTo(map);
            })
        }

        // – Map ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var map = L.map('map', {
            center: [35, 0],
            zoom: 3,
            minZoom: 2,
            maxZoom: 12,
            attributionControl: false,
            zoomControl: true
        });

        var southWest = L.latLng(-60, -180); // Southwest corner of the world
        var northEast = L.latLng(85, 187); // Northeast corner of the world
        map.setMaxBounds(L.latLngBounds(southWest, northEast));

        map.on('drag', function () {
            map.panInsideBounds(map.getBounds());
        });

        // – Markers –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var officialSelection = L.icon({
            iconUrl: 'icons/OS.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var honorableMention = L.icon({
            iconUrl: 'icons/HM.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var finalist = L.icon({
            iconUrl: 'icons/F.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var semiFinalist = L.icon({
            iconUrl: 'icons/SF.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var quarter = L.icon({
            iconUrl: 'icons/QF.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var nominee = L.icon({
            iconUrl: 'icons/N.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var winner = L.icon({
            iconUrl: 'icons/W.png',
            iconSize:     [31.5, 50], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        // – Info –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var info = L.control({position: 'topleft'});

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            hideInfoBox();
            this.update();
            return this._div;
        };

        info.update = function (props) {
            let message = "<b>No Selections Yet</b>";

            if (props && props.count > 0) {
                message = '<b>' + props.count + ' Selections!' + '</b>';
            }

            if (props && props.count == 1) {
                message = '<b>' + props.count + ' Selection!' + '</b>';
            }

            this._div.innerHTML = (props ?
                '<h4>' + props.name + '</h4>' + message
                : 'Hover over the map');
        };
        info.addTo(map);

        function onMapMouseMove(e) {
            var mapContainer = map.getContainer().getBoundingClientRect();
            var boxWidth = info._div.offsetWidth;
            var boxHeight = info._div.offsetHeight;
            var x = e.originalEvent.clientX - mapContainer.left;
            var y = e.originalEvent.clientY - mapContainer.top;

            // Check boundaries to keep the box inside the map
            x = Math.min(x, mapContainer.width - boxWidth - 35); // 10px padding from right edge
            y = Math.min(y, mapContainer.height - boxHeight - 110); // 10px padding from bottom edge
            x = Math.max(x, 35); // 10px padding from left edge
            y = Math.max(y, 10); // 10px padding from top edge

            info._div.style.left = x + 'px';
            info._div.style.top = y + 'px';
        }

        function showInfoBox() {
            info._div.style.display = 'block';
        }

        function hideInfoBox() {
            info._div.style.display = 'none';
        }

        // – Title ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var legend = L.control({position: 'topright'});

        legend.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'legend');
            this._div.innerHTML = "<h4>Film Festival Selections Worldwide</h4>" + '<b>' + "Mouseover for selection numbers <br> Click for country specifics <br> Click & drag to move" + '</b></br>';
            return this._div;
        };

        legend.update = function (name) {
            if (name === "Film Festival Selections Worldwide") {
                this._div.innerHTML = "<h4>" + name + "</h4>" + '<b>' + '<b>' + "Mouseover for selection numbers <br> Click for country specifics <br> Click & drag to move" + '</b></br>';
            } else {
                this._div.innerHTML = "<h4>" + name + "</h4>" + '<b>' + "Scroll / Drag to zoom <br> Click on marker for info <br> Click map to exit country" + '</b></br>';
            }

        }

        legend.addTo(map);

        // – Color ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        function getColorSmall(d) {
            return d > 6 ? '#815B13FF' :
                d > 5 ? '#a87a25' :
                    d > 4 ? '#cf9c3f' :
                        d > 3 ? '#ddb262' :
                            d > 2 ? '#e6ca93' :
                                d >= 1 ? '#f8e6c4' :
                                    d > 0 ? 'rgb(195,195,195)' :
                                        'rgba(195,195,195,0.25)';
        }

        /*

        #### In case it gets too large to handle a hand-picked scale

        function colorScale(d){
            const myColor = d3.scaleLinear()
                .range(["#faecd1", "#815B13FF"])
                .domain([0,9]);

            if (d === 0){
                return 'rgba(195,195,195,0.25)';
            }
            return myColor(d);
        }

         */

        function state_styleSmall(feature) {
            return {
                fillColor: getColorSmall(feature.properties["count"]),
                weight: 2,
                opacity: 1,
                color: '#ffffff',
                fillOpacity: 1
            };
        }

        // – Functions ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#ffffff',
                dashArray: '',
                fillOpacity: 1
            });

            layer.bringToFront();
            info.update(layer.feature.properties);
            showInfoBox();
            map.on('mousemove', onMapMouseMove);
        }

        function resetHighlight(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 2,
                color: '#ffffff',
                dashArray: '',
                fillOpacity: 1
            });
            info.update();
            hideInfoBox();
            map.off('mousemove', onMapMouseMove);
        }

        function toggleMap(e) {
            let mapName = "";
            var clickedFeature = e.target.feature;
            if (!clickedFeature) return;

            else if (map.hasLayer(worldMap)) {
                jsonLoader(map, clickedFeature.properties.name);
                mapName = "Festivals in: " + clickedFeature.properties.name;
            }
            else {
                map.addLayer(worldMap);
                map.removeLayer(stateMap);
                map.setView([35, 0], 3);
                mapName = "Film Festival Selections Worldwide";
                markers.forEach(marker => map.removeLayer(marker));
                markers = []; // Reset the markers array
            }
            legend.update(mapName);
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: toggleMap
            });
        }

        // – World ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        for (let i = 0; i < geojson.features.length; i++) {
            geojson.features[i].properties["count"] = 0; // Initialize count

            for (let j = 0; j < data.length; j++) {
                if (geojson.features[i].properties["name"] === data[j]["country"]) {
                    geojson.features[i].properties["count"]++;
                }
            }
        }

        let worldMap = L.geoJson(geojson, {
            style: state_styleSmall,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
});