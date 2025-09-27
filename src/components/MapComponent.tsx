'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Claim {
  id: string;
  claimant_name: string;
  village: string;
  district: string;
  state: string;
  status: string;
  land_area: string;
  created_at: string;
  tribal_group: string;
  claim_type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  assets: string[];
  documents: string[];
  review_stage: string;
  last_updated: string;
  version: number;
  submitted_by: string;
}

interface MapComponentProps {
  claims: Claim[];
  mapLayers: {
    claims: boolean;
    waterBodies: boolean;
    forestCover: boolean;
    assets: boolean;
    heatmap: boolean;
  };
  newClaimId?: string | null;
  onClaimZoomed?: () => void;
}

// Component to handle map updates and auto-zoom
function MapUpdater({ claims, mapLayers, newClaimId, onClaimZoomed }: { 
  claims: Claim[]; 
  mapLayers: any; 
  newClaimId?: string | null;
  onClaimZoomed?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (claims && claims.length > 0) {
      const validClaims = claims.filter(claim => 
        claim.coordinates && 
        claim.coordinates.lat && 
        claim.coordinates.lng
      );
      
      if (validClaims.length > 0) {
        const bounds = L.latLngBounds(
          validClaims.map(claim => [claim.coordinates.lat, claim.coordinates.lng])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [claims, map]);

  // Handle auto-zoom to new claim
  useEffect(() => {
    if (newClaimId && claims && claims.length > 0) {
      const newClaim = claims.find(claim => claim.id === newClaimId);
      if (newClaim && newClaim.coordinates && newClaim.coordinates.lat && newClaim.coordinates.lng) {
        // Smooth zoom animation to the new claim location
        map.flyTo(
          [newClaim.coordinates.lat, newClaim.coordinates.lng], 
          15, // Zoom level for detailed view
          {
            animate: true,
            duration: 4, // 4 seconds animation for slower, smoother effect
            easeLinearity: 0.05 // Slower easing for more gradual zoom
          }
        );

        // Call the callback after animation completes
        setTimeout(() => {
          if (onClaimZoomed) {
            onClaimZoomed();
          }
        }, 5000); // 5 seconds total - 4s animation + 1s buffer
      }
    }
  }, [newClaimId, claims, map, onClaimZoomed]);

  return null;
}

export default function MapComponent({ claims, mapLayers, newClaimId, onClaimZoomed }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || mapError) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Default center for India
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Filter claims based on map layers
  const visibleClaims = mapLayers.claims ? claims : [];

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          // Ensure map is properly initialized
          if (!map || !map.getContainer()) {
            setMapError(true);
            return;
          }
        }}
        whenReady={() => {
          // Map is ready and DOM is available
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          claims={visibleClaims} 
          mapLayers={mapLayers} 
          newClaimId={newClaimId}
          onClaimZoomed={onClaimZoomed}
        />

        {/* Render claim markers */}
        {visibleClaims && visibleClaims.length > 0 && visibleClaims.map((claim) => {
          const getMarkerColor = (status: string) => {
            switch (status.toLowerCase()) {
              case 'approved':
                return '#10b981'; // green
              case 'pending':
                return '#f59e0b'; // yellow
              case 'rejected':
                return '#ef4444'; // red
              case 'under_review':
                return '#3b82f6'; // blue
              default:
                return '#6b7280'; // gray
            }
          };

          const markerColor = getMarkerColor(claim.status);

          // Create custom marker icon with special styling for new claims
          const isNewClaim = claim.id === newClaimId;
          
          // Ensure claim has valid coordinates
          if (!claim.coordinates || !claim.coordinates.lat || !claim.coordinates.lng) {
            return null;
          }
          
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background-color: ${markerColor};
                width: ${isNewClaim ? '30px' : '20px'};
                height: ${isNewClaim ? '30px' : '20px'};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${isNewClaim ? '14px' : '10px'};
                font-weight: bold;
                animation: ${isNewClaim ? 'pulse 3s infinite' : 'none'};
                z-index: ${isNewClaim ? '1000' : '1'};
              ">
                ${claim.status.charAt(0).toUpperCase()}
              </div>
              <style>
                @keyframes pulse {
                  0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
                  50% { transform: scale(1.3); box-shadow: 0 8px 16px rgba(0,0,0,0.7); }
                  100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
                }
              </style>
            `,
            iconSize: isNewClaim ? [30, 30] : [20, 20],
            iconAnchor: isNewClaim ? [15, 15] : [10, 10],
          });

          return (
            <Marker
              key={claim.id}
              position={[claim.coordinates.lat, claim.coordinates.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{claim.claimant_name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Village:</span> {claim.village}</p>
                    <p><span className="font-medium">District:</span> {claim.district}</p>
                    <p><span className="font-medium">State:</span> {claim.state}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        claim.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        claim.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        claim.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {claim.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Land Area:</span> {claim.land_area}</p>
                    <p><span className="font-medium">Claim Type:</span> {claim.claim_type}</p>
                    <p><span className="font-medium">Submitted:</span> {claim.created_at}</p>
                    {claim.documents.length > 0 && (
                      <p><span className="font-medium">Documents:</span> {claim.documents.length}</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
