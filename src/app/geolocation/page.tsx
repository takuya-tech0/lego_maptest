"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// 画面サイズに応じてマップのコンテナスタイルを調整
const containerStyle = {
  width: '100%',
  height: '35vh',  // ビューポートの35%の高さ
  maxHeight: '300px'
};

interface Location {
  name: string;
  description: string;
  image: string;
}

const MapComponent = () => {
  const [position, setPosition] = useState({
    lat: 35.6812,
    lng: 139.7671
  });

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

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* ヘッダー - レスポンシブパディング */}
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

      {/* メインコンテンツ - スクロール可能エリア */}
      <div className="flex-1 overflow-auto">
        <div className="h-[35vh] max-h-[300px]">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position}
              zoom={15}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
              }}
            >
              <Marker position={position} />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* 場所リスト - レスポンシブグリッド */}
        <div className="bg-gray-200 p-4 sm:p-6 rounded-t-lg mt-2">
          {locations.map((location, index) => (
            <div key={index} className="mb-4 flex items-start">
              <img 
                src={location.image} 
                alt={location.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover mr-3 sm:mr-4 rounded"
              />
              <div className="flex-1 min-w-0"> {/* テキストオーバーフロー防止 */}
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

      {/* フッターナビゲーション - 固定位置 */}
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