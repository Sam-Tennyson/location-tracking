/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import ReactMapGl, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
import {
  AGRA_CORDINATE,
  BARIELY,
  DELHI_CORDINATE,
  ETAWAH,
  GWALIOW,
  HARYANA,
  JAIPUR_CORDINATE,
  LUCKNOW,
  MAP_ACCESS_TOKEN,
  NANITAL,
  PUNJAB,
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

interface IPath {
  id: number;
  pathname: string;
  start: [number, number];
  end: [number, number];
}

interface IMarker {
  id: number;
  position: [number, number];
  speed: number;
  color: string;
  imgURL: string;
  message: string;
}

interface IPathData {
  id?: number;
  path: IPath;
  marker: IMarker;
}

const paths: IPathData[] = [
  {
    path: {
      id: 1,
      pathname: "path 1",
      start: [DELHI_CORDINATE.lng, DELHI_CORDINATE.lat],
      end: [JAIPUR_CORDINATE.lng, JAIPUR_CORDINATE.lat],
    },
    marker: {
      id: 1,
      speed: RED_SPEED,
      color: "red",
      imgURL: redPin,
      message: "Warning 😶",
      position: [DELHI_CORDINATE.lng, DELHI_CORDINATE.lat],
    },
  },

  {
    path: {
      id: 2,
      pathname: "path 2",
      start: [LUCKNOW.lng, LUCKNOW.lat],
      end: [GWALIOW.lng, GWALIOW.lat],
    },
    marker: {
      id: 2,
      speed: RED_SPEED,
      color: "red",
      imgURL: redPin,
      message: "Warning 😶",
      position: [LUCKNOW.lng, LUCKNOW.lat],
    },
  },

  {
    path: {
      id: 3,
      pathname: "path 3",
      start: [ETAWAH.lng, ETAWAH.lat],
      end: [AGRA_CORDINATE.lng, AGRA_CORDINATE.lat],
    },
    marker: {
      id: 2,
      speed: RED_SPEED,
      color: "red",
      imgURL: redPin,
      message: "Warning 😶",
      position: [ETAWAH.lng, ETAWAH.lat],
    },
  },

  {
    path: {
      id: 4,
      pathname: "path 4",
      start: [NANITAL.lng, NANITAL.lat],
      end: [BARIELY.lng, BARIELY.lat],
    },
    marker: {
      id: 2,
      speed: RED_SPEED,
      color: "red",
      imgURL: redPin,
      message: "Warning 😶",
      position: [NANITAL.lng, NANITAL.lat],
    },
  },

  {
    path: {
      id: 5,
      pathname: "path 5",
      start: [HARYANA.lng, HARYANA.lat],
      end: [PUNJAB.lng, PUNJAB.lat],
    },
    marker: {
      id: 2,
      speed: RED_SPEED,
      color: "red",
      imgURL: redPin,
      message: "Warning 😶",
      position: [HARYANA.lng, HARYANA.lat],
    },
  },
  // Add more paths and markers as needed
];

const TestMapComponent = () => {
  const mapRef = useRef<any>();
  const [loopIterations, setLoopIterations] = useState<number[]>([]);
  const [selectedLoopIterations, setSelectedLoopIterations] =
    useState<number>();
  const [time] = useState<number>(1000);
  const [vehicleStatus, setVehicleStatus] = useState<
    "green" | "orange" | "red"
  >("green");

  // New state to store the selected path
  const [selectedPath, setSelectedPath] = useState<IPathData | null>();

  const [currentSpeeds, setCurrentSpeeds] = useState<number[]>([0, 0, 0]);
  const [thresholdSpeed, setThresholdSpeed] = useState<number | string>(150);

  const [pathIndex, setPathIndex] = useState(0);

  // Initialize movingMarkers with an array of positions for each path
  const [movingMarkers, setMovingMarkers] = useState<any[]>(
    paths.map(() => [DELHI_CORDINATE.lng, DELHI_CORDINATE.lat])
  );

  const [viewport, setViewport] = useState<IViewport>({
    latitude: DELHI_CORDINATE.lat,
    longitude: DELHI_CORDINATE.lng,
    zoom: 6.5,
  });

  // Initialize traceData with an array of FeatureCollection for each path
  const [traceData, setTraceData] = useState<any[]>(
    paths.map(() => ({
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
    }))
  );

  const [selectedPathSpeed, setSelectedPathSpeed] = useState<number | null>(
    null
  );
  const [selectedPathCoordinates, setSelectedPathCoordinates] = useState<
    [number, number] | null
  >(null);
  const [selectedPathTime, setselectedPathTime] = useState<number>(1000);

  const setSpeedAndSkipDistance = () => {
    const skipDistance = time / 1000;
    const speed = 50000 / time; // 1 is the distance between coordinates (distance/time)

    return { speed, skipDistance };
  };

  const setSelectedSpeedAndSkipDistance = () => {
    const skipDistance = selectedPathTime / 1000;
    const speed = 50000 / selectedPathTime; // 1 is the distance between coordinates (distance/time)

    return { speed, skipDistance };
  };

  function fetchData(start, end) {
    if (start && end) {
      const source = start;
      const destination = end;
      const coordinates = getRandomCoordinatesBetweenPoints(
        source,
        destination
      );
      return coordinates;
    }
  }

  useEffect(() => {
    // Fetch data for all paths
    const allCoordinates = paths.map((pathData) =>
      fetchData(pathData.path.start, pathData.path.end)
    );

    // Update the traceData for all paths
    setTraceData((prevTraceData) => {
      const newTraceData = prevTraceData.map((_, index) => ({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [...allCoordinates[index]],
            },
          },
        ],
      }));
      return newTraceData;
    });

    // Set the interval for moving the marker
    const timers = paths.map((pathData, index) => {
      let i = loopIterations[index] || 0;
      return setInterval(() => {
        const { speed } = setSpeedAndSkipDistance();
        const coordinates = allCoordinates[index];
        if (i + 1 < coordinates.length - 1) {
          setMovingMarkers((prevMarkers) => {
            const newMarkers = [...prevMarkers];
            newMarkers[index] = coordinates[i + 1];
            return newMarkers;
          });

          setCurrentSpeeds((prevSpeeds) => {
            const newSpeeds = [...prevSpeeds];
            newSpeeds[index] = speed;
            return newSpeeds;
          });

          i = i + 1;
          setLoopIterations((prev) => {
            const newState = [...prev];
            newState[index] = i;
            return newState;
          });
        } else {
          setCurrentSpeeds((prevSpeeds) => {
            const newSpeeds = [...prevSpeeds];
            newSpeeds[index] = 0;
            return newSpeeds;
          });

          // Move to the next path when current path is completed
          if (index + 1 < paths.length) {
            setPathIndex(index + 1);
          } else {
            // All paths are completed, reset to the first path
            setPathIndex(0);
          }
        }
      }, time);
    });

    return () => {
      // Clear all intervals when the component is unmounted
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [time, pathIndex]);

  useEffect(() => {
    if (selectedPath) {
      const coordinates = fetchData(
        selectedPath?.path?.start,
        selectedPath?.path?.end
      );

      let i = selectedLoopIterations || 0;
      // Set the interval for the selected path
      const selectedPathTimer = setInterval(() => {
        const { speed } = setSelectedSpeedAndSkipDistance();
        if (i + 1 < coordinates?.length - 1) {
          setSelectedPathSpeed(Number(speed));
          setMovingMarkers((prevMarkers) => {
            const newMarkers = [...prevMarkers];

            newMarkers[i] = coordinates[i];
            return newMarkers;
          });

          setSelectedPathCoordinates(coordinates[i + 1]);
          i++;
          setSelectedLoopIterations(i);
        }
      }, selectedPathTime);

      return () => {
        // Clear the interval when the component is unmounted or the selected path changes
        clearInterval(selectedPathTimer);
      };
    }
  }, [selectedPathTime, selectedPath]);

  const handleSliderChange = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) setThresholdSpeed(value);
  };

  const handleSpeedSliderChange = (e) => {
    const { value } = e.target;
    const t1 = 50000 / value;
    setselectedPathTime(t1);
  };

  const messageVehicleStatus = () => {
    let status: "green" | "orange" | "red" = "green";

    if (currentSpeeds.some((speed) => speed > Number(thresholdSpeed) + 10)) {
      status = "red";
    } else if (currentSpeeds.some((speed) => speed > Number(thresholdSpeed))) {
      status = "orange";
    }

    setVehicleStatus(status);
  };

  useEffect(() => {
    messageVehicleStatus();
  }, [currentSpeeds, thresholdSpeed]);

  const handlePathSelection = (pathData: IPathData) => {
    // Handle the selection of a path
    console.log(pathData);
    if (pathData) {
      setSelectedPath(() => pathData);
      return;
    }
    setSelectedPathSpeed(50);
    setSelectedPath(null);
  };

  return (
    <div className="w-[90vw] min-h-screen m-auto">
      <div className="text-center text-base py-4 flex justify-between items-center flex-wrap gap-2">
        {selectedPath && (
          <div>
            <label className="font-bold">Speed (in km/sec):</label>{" "}
            {Number(selectedPathSpeed)?.toFixed(7)}
            <RangeInputComponent
              sliderValue={selectedPathSpeed}
              handleSliderChange={handleSpeedSliderChange}
              min={20}
              max={500}
            />
          </div>
        )}
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
      <div className="flex justify-start items-center flex-wrap gap-2">
        <label className="font-bold">Select Path:</label>
        <select
          className="px-3 py-2"
          onChange={(e) => handlePathSelection(paths[parseInt(e.target.value)])}
        >
          <option value={-1}>None</option>
          {paths.map((pathData, index) => (
            <option key={pathData.path.id} value={index} className="px-3 py-1">
              Path {pathData.path.id}
            </option>
          ))}
        </select>
      </div>

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
        {paths.map((pathData, index) => (
          <>
            <Source type="geojson" data={traceData[index]}>
              <Layer
                id={`trace-${pathData.path.id}`}
                type="line"
                paint={{
                  "line-color": "yellow",
                  "line-opacity": 0.75,
                  "line-width": 5,
                }}
              />
            </Source>
            {selectedPath?.path?.id && selectedPath?.path?.id - index ? (
              <Popup
                longitude={
                  selectedPath?.path?.id &&
                  selectedPathCoordinates &&
                  selectedPath?.path?.id - index
                    ? selectedPathCoordinates?.[0]
                    : movingMarkers[index]?.[0]
                }
                latitude={
                  selectedPath?.path?.id &&
                  selectedPathCoordinates &&
                  selectedPath?.path?.id - index
                    ? selectedPathCoordinates?.[1]
                    : movingMarkers[index]?.[1]
                }
                anchor="bottom"
                offset={[0, -25] as [number, number]}
                // onClose={() => setShowPopup(false)}
              >
                {selectedPathSpeed?.toFixed()}
                km/sec
              </Popup>
            ) : (
              !selectedPath && (
                <Popup
                  longitude={movingMarkers[index]?.[0]}
                  latitude={movingMarkers[index]?.[1]}
                  anchor="bottom"
                  offset={[0, -25] as [number, number]}
                  // onClose={() => setShowPopup(false)}
                >
                  {currentSpeeds?.[index]?.toFixed()} km/sec
                </Popup>
              )
            )}
            <Marker
              key={`start-marker-${pathData.path.id}`}
              longitude={pathData?.path?.start?.[0]}
              latitude={pathData?.path?.start?.[1]}
            />
            <Marker
              key={`end-marker-${pathData.path.id}`}
              longitude={pathData?.path?.end?.[0]}
              latitude={pathData?.path?.end?.[1]}
            />
            {selectedPath?.path?.id && selectedPath?.path?.id - index ? (
              <Marker
                key={`moving-marker-${pathData.path.id}`}
                longitude={
                  selectedPath?.path?.id &&
                  selectedPathCoordinates &&
                  selectedPath?.path?.id - index
                    ? selectedPathCoordinates?.[0]
                    : movingMarkers[index]?.[0]
                }
                latitude={
                  selectedPath?.path?.id &&
                  selectedPathCoordinates &&
                  selectedPath?.path?.id - index
                    ? selectedPathCoordinates?.[1]
                    : movingMarkers[index]?.[1]
                }
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
            ) : (
              !selectedPath && (
                <Marker
                  key={`moving-marker-${pathData.path.id}`}
                  longitude={movingMarkers[index]?.[0]}
                  latitude={movingMarkers[index]?.[1]}
                  // longitude={movingMarkers[index]?.[0]}
                  // latitude={movingMarkers[index]?.[1]}
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
              )
            )}
          </>
        ))}
        <FullscreenControl />
        <NavigationControl />
      </ReactMapGl>
    </div>
  );
};

export default TestMapComponent;
