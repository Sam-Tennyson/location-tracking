/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import ReactMapGl, {
  FullscreenControl,
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
import { getRandomCoordinatesBetweenPoints } from "../shared/Utils";
import RangeInputComponent from "./RangeInputComponent";
import orangePin from "../assets/orangepin.png";
import greenPin from "../assets/greenpin.png";
import redPin from "../assets/redpin.png";

interface IViewport {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const GREEN_SPEED = 200;
const ORANGE_SPEED = 200;
const RED_SPEED = 250;

const vehile_list = [
  {
    id: 1,
    speed: RED_SPEED,
    color: "red",
    imgURL: redPin,
    message: "Warning 😶",
  },
  {
    id: 2,
    speed: ORANGE_SPEED,
    color: "orange",
    imgURL: orangePin,
    message: "Approaching limit! 😐 ",
  },
  {
    id: 3,
    speed: GREEN_SPEED,
    color: "green",
    imgURL: greenPin,
    message: "Safe driving 😃 ",
  },
];

const TestMapComponent = () => {
  const mapRef = useRef<any>();
  const [loopIteration, setLoopIteration] = useState(0);
  const [time, setTime] = useState<number>(1000);
  const [vehicleStatus, setVehicleStatus] = useState<
    "green" | "orange" | "red"
  >("green");

  const [currentSpeed, setCurrentSpeed] = useState<number | string>(0);
  const [thresholdSpeed, setThresholdSpeed] = useState<number | string>(150);
  const [start] = useState<any>([DELHI_CORDINATE.lng, DELHI_CORDINATE.lat]);
  const [end] = useState<any>([JAIPUR_CORDINATE.lng, JAIPUR_CORDINATE.lat]);
  const [movingMarker, setMovingMarker] = useState<any>(start);
  const [viewport, setViewport] = useState<IViewport>({
    latitude: start?.[1],
    longitude: start?.[0],
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

  const showMessage = () => (
    <div
      className={`text-lg font-bold ${
        currentSpeed > thresholdSpeed ? "text-red-600" : "text-green-600"
      }`}
    >
      {currentSpeed > thresholdSpeed ? "Warning 😐 ..." : "Safe driving 😃 ..."}
    </div>
  );

  const setSpeedAndSkipDistance = () => {
    const skipDistance = time / 1000;
    const speed = 50000 / time; // 1 is the distance between coordinates (distance/time)

    return { speed, skipDistance };
  };

  function fetchData() {
    const source = start;
    const destination = end;
    const coordinates = getRandomCoordinatesBetweenPoints(source, destination);
    return coordinates;
  }

  useEffect(() => {
    const coordinates = fetchData();

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

    let i = loopIteration;

    const timer = setInterval(() => {
      const { speed } = setSpeedAndSkipDistance();
      if (i + 1 < coordinates.length) {
        setCurrentSpeed(speed);
        setMovingMarker(coordinates?.[i + 1]);
        i = i + 1;
        setLoopIteration(i);
      } else {
        setCurrentSpeed(0);
        clearInterval(timer);
      }
    }, time);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const handleSliderChange = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) setThresholdSpeed(value);
  };

  const handleSpeedSliderChange = (e) => {
    const { value } = e.target;
    const t1 = 50000 / value;
    setTime(t1);
    if (!isNaN(Number(value))) setCurrentSpeed(value);
  };

  const messageVehicleStatus = () => {
    let status: "green" | "orange" | "red" = "green";

    if (Number(currentSpeed) > Number(thresholdSpeed) + 10) {
      status = "red";
    } else if (currentSpeed > thresholdSpeed) {
      status = "orange";
    }

    setVehicleStatus(status);
  };

  useEffect(() => {
    messageVehicleStatus();
  }, [currentSpeed, thresholdSpeed]);

  console.log(vehicleStatus, "vehicleStatus");

  return (
    <div className="w-[90vw] min-h-screen m-auto">
      <div className="text-center text-base py-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          <label className="font-bold">Speed (in km/sec):</label>{" "}
          {Number(currentSpeed)?.toFixed(7)}
          <RangeInputComponent
            sliderValue={currentSpeed}
            handleSliderChange={handleSpeedSliderChange}
            min={20}
            max={500}
          />
        </div>
        <div></div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="font-bold">Threshold Speed (in km/sec):</label>{" "}
          <RangeInputComponent
            sliderValue={thresholdSpeed}
            handleSliderChange={handleSliderChange}
            max={500}
          />
          {thresholdSpeed}
        </div>
      </div>
      <p className="text-center mb-2">{showMessage()}</p>
      <div className="">
        <ul className="flex items-center justify-between gap-2 md:w-[60%] m-auto">
          {vehile_list.map((vehicle) => (
            <li key={vehicle.id} className="flex flex-col items-center">
              <img
                alt="Marker"
                src={vehicle?.imgURL}
                style={{ width: "30px", height: "30px" }}
              />
              <p>{vehicle.message}</p>
            </li>
          ))}
        </ul>
      </div>

      <ReactMapGl
        ref={mapRef}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/mapbox/streets-v11"}
        style={{ width: "100%", height: "70vh", margin: "auto" }}
      >
        {/* Map components (omitted for brevity) */}
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
        <FullscreenControl />
        <NavigationControl />
        <Marker
          longitude={movingMarker?.[0]}
          latitude={movingMarker?.[1]}
          offset={[0, -10]}
        >
          <img
            alt="Marker"
            src={
              vehicleStatus === "red"
                ? vehile_list?.[0]?.imgURL
                : vehicleStatus === "orange"
                ? vehile_list?.[1]?.imgURL
                : vehile_list?.[2]?.imgURL
            }
            style={{ width: "30px", height: "30px" }}
          />
        </Marker>
        <Marker longitude={start?.[0]} latitude={start?.[1]} />
        <Marker longitude={end?.[0]} latitude={end?.[1]} />
      </ReactMapGl>
    </div>
  );
};

export default TestMapComponent;
