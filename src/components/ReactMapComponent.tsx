/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ReactMapGl, {
  CircleLayer,
  FullscreenControl,
  GeolocateControl,
  Layer,
  LineLayer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import {
  AGRA_CORDINATE,
  DELHI_CORDINATE,
  MAP_ACCESS_TOKEN,
} from "../shared/Constants";

const ReactMapComponent = () => {
  const [start] = useState([DELHI_CORDINATE.lng, DELHI_CORDINATE.lat]);
  const [end, setEnd] = useState([AGRA_CORDINATE.lng, AGRA_CORDINATE.lat]);
  const [coords, setCoords] = useState<any>([]);
  const [viewState, setViewState] = useState({
    longitude: DELHI_CORDINATE.lng,
    latitude: DELHI_CORDINATE.lat,
    zoom: 5,
  });

  const getRoutes = async () => {
    const profile = `mapbox/driving`;
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const URL = `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?steps=true&geometries=geojson&access_token=${MAP_ACCESS_TOKEN}`;
    const response = await fetch(URL);
    const data = await response.json();
    const dataCoords = data?.routes[0]?.geometry.coordinates;
    setCoords(dataCoords);
  };

  const geojson: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const endPoint: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "Point",
          coordinates: [...end],
        },
      },
    ],
  };

  const lineStyle: LineLayer = {
    id: "route-source",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  const layerEndpoint: CircleLayer = {
    id: "router-destination",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#f30",
    },
  };

  const handleClick = (e: { lngLat: { lng: number; lat: number } }) => {
    const { lngLat } = e;
    const { lng, lat } = lngLat;
    setEnd([lng, lat]);
  };

  useEffect(() => {
    getRoutes();
  }, [end, start]);

  return (
    <>
      <ReactMapGl
        {...viewState}
        onClick={handleClick}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/mapbox/streets-v11"}
        style={{ width: "100vw", height: "90vh" }}
      >
        <Source id="route-source" type="geojson" data={geojson}>
          <Layer {...lineStyle} />
        </Source>
        <Source id="route-destination" type="geojson" data={endPoint}>
          <Layer {...layerEndpoint} />
        </Source>
        <GeolocateControl />
        <FullscreenControl />
        <NavigationControl />
        <Marker longitude={start[0]} latitude={start[1]} />
      </ReactMapGl>
    </>
  );
};

export default ReactMapComponent;
