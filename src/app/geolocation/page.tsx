"use client";

import { useEffect, useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const GoogleMap = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.GoogleMap) as Promise<React.ComponentType<any>>,
  {
    loading: () => <p>Loading Map...</p>,
    ssr: false,
  }
);

const MarkerF = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.MarkerF) as Promise<React.ComponentType<any>>,
  {
    ssr: false,
  }
);

const containerStyle = {
  width: '100%',
  height: '35vh',
  maxHeight: '300px'
};

interface Location {
  name: string;
  description: string;
  image: string;
}

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAwtAOf8BXODVdePgqQ1btcObi2Wc8ecHc"
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState({
    lat: 35.6812,
    lng: 139.7671
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const [locations] = useState<Location[]>([
    {
      name: "小野路宿里山交流館",
      description: "江戸時代、小野路宿にあった旅籠はたご「角屋かどや」を改修した施設",
      image: "/path-to-your-image1.jpg"
    },
    {
      name: "町田薬師池公園",
      description: "四季彩の杜",
      image: "/path-to-your-image2.jpg"
    }
  ]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (error) => {
        console.error('位置情報の取得に失敗:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <MarkerF position={position} />
      </GoogleMap>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-4 py-3 sm:px-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-3">
          町田GIONスタジアム 周辺情報
        </h1>
        <div className="flex space-x-4 sm:space-x-6 mb-3">
          <button className="text-sm sm:text-base text-gray-400">グルメ</button>
          <button className="text-sm sm:text-base text-gray-400">レジャー</button>
          <button className="text-sm sm:text-base text-blue-500">史跡名所</button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="h-[35vh] max-h-[300px]">
          {isLoaded ? renderMap() : <div>Loading...</div>}
        </div>

        <div className="bg-gray-200 p-4 sm:p-6 rounded-t-lg mt-2">
          {locations.map((location, index) => (
            <div key={index} className="mb-4 flex items-start">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image 
                  src={location.image} 
                  alt={location.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                <h3 className="text-black font-bold text-sm sm:text-base">
                  {location.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                  {location.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="flex justify-around items-center px-2 py-3 sm:px-4 sm:py-4 border-t border-gray-700 bg-black">
        <button className="text-gray-400 text-xs sm:text-sm flex flex-col items-center">
          <span>ホーム</span>
        </button>
        <button className="text-gray-400 text-xs sm:text-sm flex flex-col items-center">
          <span>登城マップ</span>
        </button>
        <button className="text-gray-400 text-xs sm:text-sm flex flex-col items-center">
          <span>交通情報</span>
        </button>
        <button className="text-red-500 text-xs sm:text-sm flex flex-col items-center">
          <span>周辺情報</span>
        </button>
      </footer>
    </div>
  );
};

export default MapComponent;