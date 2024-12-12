import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import redPin from "../../../../assets/Images/red pin.png";
import bluePin from "../../../../assets/Images/blue pin.png";
import "./MapComponent.css";

// Define a type for LatLngTuple (two-element array)
type LatLngTuple = [number, number];

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

// LocationMarker component
interface LocationMarkerProps {
  params: any;
}

function LocationMarker({ params }: LocationMarkerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>محل فعلی شما</Popup>
    </Marker>
  );
}

// MapComponent component props type definition
interface MapComponentProps {
  sendDataToParent: (data: { lat: number; lng: number }) => void;
  lati: number;
  long: number;
  onlyShow: boolean;
  name: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  sendDataToParent,
  lati,
  long,
  onlyShow,
  name,
}) => {
  const [classes, setClasses] = useState(name);
  const [marker, setMarker] = useState<{ geocode: LatLngTuple; popUp: string }[]>([
    {
      geocode: [lati, long],
      popUp: "محل برگزاری رویداد",
    },
  ]);

  // Correctly type center as LatLngTuple (two-element array)
  const mapOptions = {
    center: [lati, long] as LatLngTuple, // Ensures it's typed correctly as [number, number]
    zoom: 9,
  };

  // MapEventsHandler props definition
  interface MapEventsHandlerProps {
    handleMapClick: (e: L.LeafletMouseEvent) => void;
  }

  const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvents({
      click: (e) => handleMapClick(e),
    });
    return null;
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onlyShow === true) {
      // No action
    } else {
      const { lat, lng } = e.latlng;
      setMarker([
        { ...marker, geocode: [lat, lng], popUp: "محل برگزاری رویداد" },
      ]);
      sendDataToParent({ lat, lng });
    }
  };

  return (
    <div className={`map-component ${classes} col-md-12 col-sm-12 col-12`}>
      <MapContainer className="map-component__map" {...mapOptions}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler handleMapClick={handleMapClick} />
        <LocationMarker params={{}} /> {/* Adjust params here if needed */}
        {marker.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={blueIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
