import React from 'react';
import { useApp } from '../../context/AppContext';
import { NEARBY_HOSPITALS } from '../../data/mockSeedData';
import { MapPin, Phone, Navigation, AlertTriangle, ExternalLink, Building2, ShieldAlert } from 'lucide-react';

import { VhvPermissionState } from '../../types';

interface NearbyHospitalsViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const NearbyHospitalsView: React.FC<NearbyHospitalsViewProps> = () => {
  const { locationPermission, userCoords, setLocationPermission } = useApp();

  const isLocationActive = locationPermission === 'granted' || locationPermission === 'granted_once';

  const handleOpenGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-teal-600" />
          สถานพยาบาลใกล้ฉัน และ เส้นทาง
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ค้นหารายชื่อโรงพยาบาล รพ.สต. ระยะทาง โทรติดต่อ และนำทางผ่าน Google Maps
        </p>
      </div>

      {/* Location Permission Status Alert Banner (Requirement #9, #17) */}
      {!isLocationActive ? (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                ไม่สามารถใช้ฟังก์ชันคำนวณตำแหน่งพิกัดได้จนกว่าจะเปิด Location
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                ท่านยังไม่ได้อนุญาตการเข้าถึงตำแหน่ง GPS ของอุปกรณ์ ระบบจึงแสดงระยะทางจากจุดกึ่งกลางชุมชนแทน
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationPermission('granted')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
          >
            เปิดการใช้งานตำแหน่ง GPS ตอนนี้
          </button>
        </div>
      ) : (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>
              ตำแหน่ง GPS ปัจจุบัน: <strong className="font-bold">{userCoords?.lat.toFixed(4)}, {userCoords?.lng.toFixed(4)}</strong> (ต.สุเทพ อ.เมือง จ.เชียงใหม่)
            </span>
          </div>
          <span className="px-2.5 py-1 bg-teal-200 text-teal-900 font-bold rounded-full text-[10px]">
            GPS ทำงานปกติ
          </span>
        </div>
      )}

      {/* Hospital Cards List */}
      <div className="space-y-4">
        {NEARBY_HOSPITALS.map(hosp => (
          <div
            key={hosp.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full">
                  {hosp.type}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ระยะห่าง ~{hosp.distanceKm} กม.
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg">{hosp.name}</h3>

              <p className="text-xs text-slate-500 leading-relaxed">{hosp.address}</p>

              <p className="text-xs text-slate-600 font-medium">
                📞 เบอร์โทรศัพท์: <a href={`tel:${hosp.phone}`} className="font-bold text-teal-700 underline">{hosp.phone}</a>
              </p>
            </div>

            {/* Actions: Direct Route Google Maps & Call */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => handleOpenGoogleMaps(hosp.lat, hosp.lng, hosp.name)}
                className="flex-1 sm:flex-initial px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-teal-100 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>เส้นทาง Google Maps</span>
              </button>

              <a
                href={`tel:${hosp.phone}`}
                className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>โทรออก</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
