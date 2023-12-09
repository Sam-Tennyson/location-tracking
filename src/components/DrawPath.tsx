/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layer, Source } from "react-map-gl";
import { getRandomCoordinatesBetweenPoints } from "../shared/Utils";
import MovingMarker from "./MovingMarker";

const DrawPath = ({ id, path, color }) => {
  const start = [path?.[0]?.lng, path?.[0]?.lat];
  const end = [path?.[1]?.lng, path?.[1]?.lat];
  const coordinates = getRandomCoordinatesBetweenPoints(start, end);
  const geojson: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coordinates],
        },
      },
    ],
  };

  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer
        id={id}
        type="line"
        paint={{
          "line-color": color,
          "line-width": 5,
        }}
      />
      <MovingMarker
        route={coordinates}
        intervalTime={2000}
        specificTime={id === "PTJ" ? 100 : null}
      />
    </Source>
  );
};

export default DrawPath;
