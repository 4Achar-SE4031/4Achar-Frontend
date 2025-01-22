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
import yellowPin from "../../../../assets/Images/yellow pin.png";
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
const yellowIcon = new Icon({
    iconUrl: yellowPin,
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
    sendDataToParent: (data: { lat: any; lng: any }) => void;
    lati: any;
    long: any;
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
    const [classes, setClasses] = useState(name);
    // const [marker, setMarker] = useState<
    //     { geocode: LatLngTuple; popUp: string }[]
    // >([
    //     {
    //         geocode: [lati, long],
    //         // popUp: "تهران، خیابان حافظ، تالار وحدت",
    //         popUp: address
    //     },
    // ]);


    const [marker, setMarker] = useState<{ geocode: LatLngTuple; popUp: string }[]>([
        {
            geocode: [Number(lati), Number(long)],  // Ensure these are numbers
            popUp: address
        },
    ]);



    // Correctly type center as LatLngTuple (two-element array)
    const mapOptions = {
        center: [Number(lati), Number(long)] as LatLngTuple,
        zoom: 9,
    };

    // MapEventsHandler props definition
    interface MapEventsHandlerProps {
        handleMapClick: (e: L.LeafletMouseEvent) => void;
    }

    const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({
        handleMapClick,
    }) => {
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
                // { geocode: [lat, lng], popUp: "محل برگزاری رویداد" },
                { geocode: [lng, lat], popUp: "محل برگزاری رویداد" },
            ]);
            sendDataToParent({ lat, lng });
        }
    };


    return (
        <div className={`map-component ${classes}`}>
            <MapContainer className="map-component__map" {...mapOptions}>
                <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventsHandler handleMapClick={handleMapClick} />
                {/* <LocationMarker params={{}} />{" "} */}
                {/* Adjust params here if needed */}
                {marker.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.geocode}
                        icon={yellowIcon}
                    >
                        <Popup>{marker.popUp}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
