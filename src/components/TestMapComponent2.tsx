import React, { useEffect, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

const TestMapComponent2 = () => {
  const mapRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 28.6139, // Delhi latitude
    longitude: 77.209, // Delhi longitude
    zoom: 6,
  });

  const origin = [77.209, 28.6139]; // Delhi
  const destination = [75.7873, 26.9124]; // Jaipur

  const route = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [origin, destination],
        },
      },
    ],
  };

  const point = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: origin,
        },
      },
    ],
  };

  const lineDistance = turf.length(route.features[0]);
  const arc = [];

  const steps = 500;

  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment?.geometry?.coordinates);
  }

  route.features[0].geometry.coordinates = arc;

  const [counter, setCounter] = useState(0);
  const [running, setRunning] = useState(false);

  const animate = () => {
    setRunning(true);
    document?.getElementById("replay")?.disabled = true;
    const start =
      route.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];
    const end =
      route.features[0].geometry.coordinates[
        counter >= steps ? counter : counter + 1
      ];
    if (!start || !end) {
      setRunning(false);
      document?.getElementById("replay")?.disabled = false;
      return;
    }

    point?.features?.[0]?.geometry?.coordinates =
      route?.features?.[0]?.geometry?.coordinates[counter];

    point?.features?.[0]?.properties?.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    mapRef.current?.getMap().getSource("point").setData(point);

    if (counter < steps) {
      requestAnimationFrame(() => animate());
    }

    setCounter((prevCounter) => prevCounter + 1);
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current?.getMap().on("load", () => {
        mapRef.current?.getMap().addSource("route", {
          type: "geojson",
          data: route,
        });

        mapRef.current?.getMap().addSource("point", {
          type: "geojson",
          data: point,
        });

        mapRef.current?.getMap().addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-width": 2,
            "line-color": "#007cbf",
          },
        });

        mapRef.current?.getMap().addLayer({
          id: "point",
          type: "symbol",
          source: "point",
          layout: {
            "icon-image": "airport",
            "icon-size": 1.5,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
        });

        animate();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplayClick = () => {
    if (running) {
      void 0;
    } else {
      point.features[0].geometry.coordinates = origin;
      mapRef.current?.getMap().getSource("point").setData(point);
      setCounter(0);
      animate();
    }
  };

  return (
    <div>
      <MapGL
        {...viewport}
        width="100%"
        height="100vh"
        ref={mapRef}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        mapboxApiAccessToken="YOUR_MAPBOX_ACCESS_TOKEN"
      >
        <Marker longitude={origin[0]} latitude={origin[1]}>
          <div>Delhi</div>
        </Marker>
        <Marker longitude={destination[0]} latitude={destination[1]}>
          <div>Jaipur</div>
        </Marker>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <button id="replay" onClick={handleReplayClick}>
            Replay
          </button>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
};

export default TestMapComponent2;
