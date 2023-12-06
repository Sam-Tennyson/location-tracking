/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import ReactMapGl, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import {
  DELHI_CORDINATE,
  JAIPUR_CORDINATE,
  MAP_ACCESS_TOKEN,
} from "../shared/Constants";
import { calculateDistance } from "../shared/Utils";

interface IViewport {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const TestMapComponent = () => {
  const [time] = useState<number>(3000); // 3 sec
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [thresholdSpeed, setThresholdSpeed] = useState<number>(60);
  const [start] = useState<any>([DELHI_CORDINATE.lng, DELHI_CORDINATE.lat]);
  const [end] = useState<any>([JAIPUR_CORDINATE.lng, JAIPUR_CORDINATE.lat]);
  const [movingMarker, setMovingMarker] = useState<any>([
    DELHI_CORDINATE.lng,
    DELHI_CORDINATE.lat,
  ]);
  const [viewport, setViewport] = useState<IViewport>({
    latitude: 0,
    longitude: 0,
    zoom: 6.5,
  });

  const [traceData, setTraceData] = useState<any>({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  });

  const showMessage = () => {
    if (currentSpeed > thresholdSpeed) {
      return (
        <div className=" text-red-600 text-lg font-bold">Warning 😐 ...</div>
      );
    }
    return (
      <div className="text-green-600 text-lg font-bold">
        Safe driving 😃 ...
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const profile = `mapbox/driving`;
      const path_coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
      const URL = `https://api.mapbox.com/directions/v5/${profile}/${path_coordinates}?steps=true&geometries=geojson&access_token=${MAP_ACCESS_TOKEN}`;
      const response = await fetch(URL);
      const data = await response.json();
      const coordinates = data?.routes[0]?.geometry.coordinates;

      setTraceData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [...coordinates],
            },
          },
        ],
      });

      setViewport({
        latitude: coordinates?.[0]?.[1],
        longitude: coordinates?.[0]?.[0],
      });

      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
          if (i > 0) {
            const point1 = {
              lat: coordinates?.[i - 1]?.[1],
              lng: coordinates?.[i - 1]?.[0],
            };
            const point2 = {
              lat: coordinates?.[i]?.[1],
              lng: coordinates?.[i]?.[0],
            };
            const distance = calculateDistance(point1, point2);
            const timeInHr = time / 3600;
            const speed = distance / timeInHr;
            console.log(speed, "speed");
            setCurrentSpeed(speed);
          }
          const newCoordinates = [
            ...(traceData?.features?.[0]?.geometry?.coordinates ?? []),
          ];
          newCoordinates.push(coordinates?.[i]);
          setMovingMarker(coordinates?.[i]);

          setViewport({
            latitude: coordinates?.[i]?.[1],
            longitude: coordinates?.[i]?.[0],
          });
          i++;
        } else {
          setCurrentSpeed(0);
          window.clearInterval(timer);
        }
      }, time);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-[90vw] min-h-screen m-auto">
        <div className="text-center text-base py-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <label className="font-bold">Speed (in km/hr):</label>{" "}
            {currentSpeed?.toFixed(7)}
          </div>
          <div>
            <label className="font-bold">Threshold Speed (in km/hr):</label>{" "}
            {thresholdSpeed}
          </div>
          {/* <div>
          <Timer timeout={10} initialSeconds={0} />
        </div> */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="font-bold">Change Threshold (in km/hr)</label>
            <input
              type="text"
              value={thresholdSpeed}
              onChange={(e) => setThresholdSpeed(Number(e.target.value))}
              className="px-3 py-1 border-2 border-slate-300 rounded-sm w-[150px]"
            />{" "}
            {/* km/hr */}
          </div>
        </div>
        <p className="text-center">{showMessage()}</p>

        <ReactMapGl
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapboxAccessToken={MAP_ACCESS_TOKEN}
          mapStyle={"mapbox://styles/mapbox/streets-v11"}
          style={{ width: "100%", height: "70vh", margin: "auto" }}
        >
          <Source type="geojson" data={traceData}>
            <Layer
              id="trace"
              type="line"
              paint={{
                "line-color": "yellow",
                "line-opacity": 0.75,
                "line-width": 5,
              }}
            />
          </Source>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
          <FullscreenControl />
          <NavigationControl />
          <Marker longitude={movingMarker?.[0]} latitude={movingMarker?.[1]}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
              alt="Marker"
              style={{ width: "40px", height: "40px" }}
            />
          </Marker>
          <Marker longitude={start?.[0]} latitude={start?.[1]} />
          <Marker longitude={end?.[0]} latitude={end?.[1]} />
        </ReactMapGl>
      </div>
    </>
  );
};

export default TestMapComponent;
