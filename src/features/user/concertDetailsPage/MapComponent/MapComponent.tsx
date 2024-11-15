import React, { useEffect, useState, FC } from "react";
import "leaflet/dist/leaflet.css";
import{
  TileLayer,
  Marker,
  Popup,
//   Tooltip,
} from "react-leaflet";

import {MapContainer} from 'react-leaflet'
import useMapEvents from 'react-leaflet'

import { Icon, LatLng, LeafletMouseEvent } from "leaflet";
import redPin from "../../assets/red pin.png";
import bluePin from "../../assets/blue pin.png";
import "./MapComponent.css";

// Define the icon configurations with proper types
const blackIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

const redIcon = new Icon({
  iconUrl: redPin,
  iconSize: [38, 38],
});

const blueIcon = new Icon({
  iconUrl: bluePin,
  iconSize: [38, 38],
});

// Interface for LocationMarker component props (if any)
interface LocationMarkerProps {}

// LocationMarker Component
const LocationMarker: FC<LocationMarkerProps> = () => {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click() {
      const map = useMapEvents({});
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      e.target.flyTo(e.latlng, e.target.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>محل فعلی شما</Popup>
    </Marker>
  );
};

// Interface for individual marker data
interface MarkerData {
  geocode: [number, number];
  popUp: string;
}

// Interface for MapComponent props
interface MapComponentProps {
  sendDataToParent: (data: { lat: number; lng: number }) => void;
  lati?: number;
  long?: number;
  onlyShow: boolean;
  name: string;
}

// Interface for MapEventsHandler props
interface MapEventsHandlerProps {
  handleMapClick: (e: LeafletMouseEvent) => void;
}

// MapEventsHandler Component
const MapEventsHandler: FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
  useMapEvents({
    click: handleMapClick,
  });
  return null;
};

// Main MapComponent
const MapComponent: FC<MapComponentProps> = ({
  sendDataToParent,
  lati,
  long,
  onlyShow,
  name,
}) => {
  console.log(lati, long);

  // State for CSS classes
  const [classes, setClasses] = useState<string>(name);

  // State for markers
  const [marker, setMarker] = useState<MarkerData[]>([
    {
      geocode: [lati, long],
      popUp: "محل برگزاری رویداد",
    },
  ]);

  // Map options with proper typing
  const mapOptions: {
    center: [number, number];
    zoom: number;
  } = {
    center: [lati, long],
    zoom: 9,
  };

  // Handler for map clicks
  const handleMapClick = (e: LeafletMouseEvent) => {
    console.log("only show ", onlyShow);
    console.log(lati, long);

    if (onlyShow) {
      console.log("only show");
      return;
    }

    const { lat, lng } = e.latlng;

    setMarker([
      {
        geocode: [lat, lng],
        popUp: "محل برگزاری رویداد",
      },
    ]);

    sendDataToParent({ lat, lng });
    console.log(lat, lng);
  };

  return (
    <div className={`map-component ${classes} col-md-12 col-sm-12 col-12`}>
      <MapContainer className="map-component__map" {...mapOptions}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler handleMapClick={handleMapClick} />
        <LocationMarker />
        {marker.map((markerItem, index) => (
          <Marker key={index} position={markerItem.geocode} icon={blueIcon}>
            <Popup>{markerItem.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
