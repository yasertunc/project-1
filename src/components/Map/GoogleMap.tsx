import React, { useCallback, useMemo, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "../../lib/env";

interface Marker {
  id: string;
  position: { lat: number; lng: number };
  icon?: string;
  title?: string;
  onClick?: () => void;
}

// Map style presets
export const MAP_STYLES = {
  default: [] as google.maps.MapTypeStyle[],
  dark: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ] as google.maps.MapTypeStyle[],
  minimal: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ] as google.maps.MapTypeStyle[],
  colorful: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#667eea" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#667eea" }],
    },
  ] as google.maps.MapTypeStyle[],
  grayscale: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ saturation: -100 }],
    },
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ saturation: -100 }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ saturation: -100 }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ saturation: -100 }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e0e0e0" }, { saturation: -100 }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { saturation: -100 }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#d0d0d0" }, { saturation: -100 }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { saturation: -100 }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#e8e8e8" }, { saturation: -100 }],
    },
  ] as google.maps.MapTypeStyle[],
};

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Marker[];
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (marker: Marker) => void;
  className?: string;
  style?: React.CSSProperties;
  // Customization options
  mapStyle?:
    | "default"
    | "dark"
    | "minimal"
    | "colorful"
    | "grayscale"
    | google.maps.MapTypeStyle[];
  mapTypeId?: "roadmap" | "satellite" | "hybrid" | "terrain";
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  markerColor?: string; // Custom marker background color
  markerSize?: number; // Marker size in pixels
}

/**
 * Google Maps component for displaying interactive maps
 *
 * @example
 * ```tsx
 * <GoogleMap
 *   center={{ lat: 41.0082, lng: 28.9784 }}
 *   zoom={13}
 *   markers={[
 *     { id: '1', position: { lat: 41.0082, lng: 28.9784 }, icon: '🏛️', title: 'Museum' }
 *   ]}
 * />
 * ```
 */
export default function GoogleMap({
  center = { lat: 41.0082, lng: 28.9784 }, // Istanbul default
  zoom = 13,
  markers = [],
  onMapClick,
  onMarkerClick,
  className = "",
  style,
  mapStyle = "default",
  mapTypeId = "roadmap",
  disableDefaultUI = false,
  zoomControl = true,
  mapTypeControl = false,
  scaleControl = true,
  streetViewControl = false,
  fullscreenControl = true,
  markerColor = "#667eea",
  markerSize = 40,
}: GoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Google Maps script
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.google?.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        setGoogleMapsLoaded(true);
      });
      return;
    }

    // Load Google Maps script
    if (!GOOGLE_MAPS_API_KEY) {
      setLoadError("Google Maps API key is not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      setLoadError("Failed to load Google Maps");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const scriptToRemove = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // Initialize map when Google Maps is loaded
  const mapRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !googleMapsLoaded || map) return;

      // Resolve map styles
      let resolvedStyles: google.maps.MapTypeStyle[] = [];
      if (typeof mapStyle === "string") {
        resolvedStyles = MAP_STYLES[mapStyle] || MAP_STYLES.default;
      } else if (Array.isArray(mapStyle)) {
        resolvedStyles = mapStyle;
      }

      const mapOptions: google.maps.MapOptions = {
        center: new google.maps.LatLng(center.lat, center.lng),
        zoom,
        disableDefaultUI,
        zoomControl,
        mapTypeControl,
        scaleControl,
        streetViewControl,
        rotateControl: false,
        fullscreenControl,
        mapTypeId: mapTypeId as google.maps.MapTypeId,
        styles: resolvedStyles,
      };

      const newMap = new google.maps.Map(node, mapOptions);

      // Add click handler
      if (onMapClick) {
        newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
          onMapClick(event);
        });
      }

      setMap(newMap);
    },
    [
      googleMapsLoaded,
      center,
      zoom,
      onMapClick,
      map,
      disableDefaultUI,
      zoomControl,
      mapTypeControl,
      scaleControl,
      streetViewControl,
      fullscreenControl,
      mapTypeId,
      mapStyle,
    ]
  );

  // Update map center when prop changes
  React.useEffect(() => {
    if (map && center) {
      map.setCenter(new google.maps.LatLng(center.lat, center.lng));
    }
  }, [map, center]);

  // Update map zoom when prop changes
  React.useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  // Create markers
  const mapMarkers = useMemo(() => {
    if (!map || !googleMapsLoaded || !window.google?.maps) return [];

    return markers.map((marker) => {
      const googleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(
          marker.position.lat,
          marker.position.lng
        ),
        map,
        title: marker.title,
        icon: marker.icon
          ? {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}">
                  <circle cx="${markerSize / 2}" cy="${markerSize / 2}" r="${markerSize / 2 - 2}" fill="${markerColor}" opacity="0.9"/>
                  <text x="${markerSize / 2}" y="${markerSize * 0.7}" font-size="${markerSize * 0.6}" text-anchor="middle">${marker.icon}</text>
                </svg>`
              )}`,
              scaledSize: new google.maps.Size(markerSize, markerSize),
              anchor: new google.maps.Point(markerSize / 2, markerSize / 2),
            }
          : undefined,
      });

      // Add click handler for marker
      googleMarker.addListener("click", () => {
        // First call marker-specific onClick if exists
        if (marker.onClick) {
          marker.onClick();
        }
        // Then call general onMarkerClick handler
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
      });

      return googleMarker;
    });
  }, [map, markers, googleMapsLoaded, onMarkerClick, markerColor, markerSize]);

  // Cleanup markers on unmount
  React.useEffect(() => {
    return () => {
      mapMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [mapMarkers]);

  if (loadError || !GOOGLE_MAPS_API_KEY) {
    // Return a simple placeholder that matches the mock view style
    return (
      <div
        className={`relative h-full overflow-hidden ${className}`}
        style={style}
      >
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent,transparent_35px,rgba(255,255,255,.05)_35px,rgba(255,255,255,.05)_70px),repeating-linear-gradient(90deg,transparent,transparent_35px,rgba(255,255,255,.05)_35px,rgba(255,255,255,.05)_70px)] bg-gradient-to-b from-[var(--color-bg-light)] to-[var(--color-bg-medium)]" />
        {!GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-white/90 rounded-lg shadow-lg max-w-xs">
              <p className="text-gray-600 mb-2">🗺️</p>
              <p className="text-sm text-gray-600">
                Configure VITE_GOOGLE_MAPS_API_KEY to enable maps
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!googleMapsLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={style}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className}`}
      style={style}
      data-testid="google-map"
    />
  );
}
