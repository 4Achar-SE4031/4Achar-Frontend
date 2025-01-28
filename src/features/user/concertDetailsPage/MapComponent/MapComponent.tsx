import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import redPin from "../../../../assets/Images/red pin.png";
import bluePin from "../../../../assets/Images/blue pin.png";
import yellowPin from "../../../../assets/Images/yellow pin.png";
import "./MapComponent.css";

// Define a type for LatLngTuple (two-element array)
type LatLngTuple = [number, number];

// Custom Icons
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
const yellowIcon = new Icon({
    iconUrl: yellowPin,
    iconSize: [38, 38],
});

// MapEventsHandler component
interface MapEventsHandlerProps {
    handleMapClick: (e: L.LeafletMouseEvent) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvents({
        click: (e) => handleMapClick(e),
    });
    return null;
};

// MapComponent component props type definition
interface MapComponentProps {
    sendDataToParent: (data: { lat: number; lng: number }) => void;
    lati: number | string;
    long: number | string;
    onlyShow: boolean;
    name: string;
    address: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
    sendDataToParent,
    lati,
    long,
    onlyShow,
    name,
    address
}) => {
    console.log(`lati: ${lati}`)
    console.log(`long: ${long}`)
    const [classes, setClasses] = useState(name);

    // Parse latitude and longitude to ensure they are numbers
    const parsedLat = typeof lati === "string" ? parseFloat(lati) : lati;
    const parsedLng = typeof long === "string" ? parseFloat(long) : long;

    // Validate parsed coordinates
    const isValidLat = !isNaN(parsedLat) && parsedLat >= -90 && parsedLat <= 90;
    const isValidLng = !isNaN(parsedLng) && parsedLng >= -180 && parsedLng <= 180;

    // Default to a fallback location if invalid
    const initialPosition: LatLngTuple = isValidLat && isValidLng
        ? [parsedLat, parsedLng]
        : [0, 0]; // [0, 0] is in the Gulf of Guinea, near Africa

    const [marker, setMarker] = useState<{ geocode: LatLngTuple; popUp: string }[]>([
        {
            geocode: initialPosition,
            popUp: address
        },
    ]);

    // Update marker if props change
    useEffect(() => {
        if (isValidLat && isValidLng) {
            setMarker([
                {
                    geocode: [parsedLat, parsedLng],
                    popUp: address
                },
            ]);
        }
    }, [parsedLat, parsedLng, address, isValidLat, isValidLng]);

    // Map options
    const mapOptions = {
        center: initialPosition,
        zoom: isValidLat && isValidLng ? 13 : 2, // Zoom in if valid, else zoom out
    };

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (onlyShow) {
            // Do nothing if onlyShow is true
            return;
        }
        const { lat, lng } = e.latlng;
        console.log(`lat: ${lat}, lng: ${lng}`);

        setMarker([
            { geocode: [lat, lng], popUp: "محل برگزاری رویداد" }, // Correct order: [lat, lng]
        ]);
        sendDataToParent({ lat, lng });
    };

    return (
        <div className={`map-component ${classes}`}>
            <MapContainer className="map-component__map" {...mapOptions} data-testid="map-container">
                <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventsHandler handleMapClick={handleMapClick} />
                {/* Uncomment if you need the LocationMarker functionality
                <LocationMarker params={{}} />{" "} 
                */}
                {marker.map((markerItem, index) => (
                    <Marker
                        key={index}
                        position={markerItem.geocode}
                        icon={yellowIcon}
                    >
                        <Popup>{markerItem.popUp}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
