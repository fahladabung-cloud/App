import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import {
  MapPin,
  Users,
  Navigation,
  Phone,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ChevronRight,
  Filter,
  ExternalLink,
  Home,
  CheckCircle2,
  Info
} from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';

interface VhvGisMapViewProps {
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const VhvGisMapView: React.FC<VhvGisMapViewProps> = ({ onSelectPatient }) => {
  const { allPatients, vitalSignsRecords, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง'>('all');
  const [activePatient, setActivePatient] = useState<PatientProfile | null>(allPatients[0] || null);

  // Group categorization
  const getPatientCategory = (patient: PatientProfile): 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง' => {
    if (patient.status === 'ติดเตียง') return 'ติดเตียง';
    if (patient.status === 'ต้องติดตามเป็นพิเศษ' || patient.status === 'มีผู้ดูแล') return 'ติดบ้าน';
    return 'ติดสังคม';
  };

  // Mock geographic positions in the village for visualization
  const getVillageCoords = (index: number) => {
    const coordsMap = [
      { x: 32, y: 38, lat: 18.7903, lng: 98.9612 },
      { x: 58, y: 25, lat: 18.7925, lng: 98.9645 },
      { x: 45, y: 68, lat: 18.7880, lng: 98.9630 },
      { x: 75, y: 60, lat: 18.7895, lng: 98.9680 },
      { x: 20, y: 70, lat: 18.7865, lng: 98.9590 },
      { x: 70, y: 35, lat: 18.7940, lng: 98.9660 },
    ];
    return coordsMap[index % coordsMap.length];
  };

  const filteredPatients = allPatients.filter(p => {
    if (selectedFilter === 'all') return true;
    return getPatientCategory(p) === selectedFilter;
  });

  const getPinColor = (cat: 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง') => {
    if (cat === 'ติดเตียง') return 'bg-rose-500 text-white ring-4 ring-rose-200';
    if (cat === 'ติดบ้าน') return 'bg-amber-500 text-white ring-4 ring-amber-200';
    return 'bg-emerald-500 text-white ring-4 ring-emerald-200';
  };

  const handleOpenGoogleMaps = (patient: PatientProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`บ้านเลขที่ ${patient.address.houseNo} ต.${patient.address.subdistrict} อ.${patient.address.district} จ.${patient.address.province}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-300" />
          <h2 className="text-2xl font-bold">แผนที่ปักหมุดบ้านผู้สูงอายุ (GIS Map)</h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          จำแนกตำแหน่งบ้านและสถานะสุขภาพของผู้สูงอายุในชุมชน ช่วยให้อสม. วางแผนเส้นทางลงพื้นที่และเยี่ยมบ้านได้อย่างมีประสิทธิภาพ
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold text-slate-800">กลุ่มสุขภาพเป้าหมาย:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด ({allPatients.length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดสังคม')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดสังคม'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            กลุ่มติดสังคม ({allPatients.filter(p => getPatientCategory(p) === 'ติดสังคม').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดบ้าน')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดบ้าน'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            กลุ่มติดบ้าน ({allPatients.filter(p => getPatientCategory(p) === 'ติดบ้าน').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดเตียง')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดเตียง'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            กลุ่มติดเตียง ({allPatients.filter(p => getPatientCategory(p) === 'ติดเตียง').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Visual Map + Patient Quick Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Container */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          {/* Simulated Village Map Background Layer */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Grid Lines */}
            <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-700 text-white text-xs flex items-center gap-2">
              <Home className="w-4 h-4 text-sky-400" />
              <span>หมู่ 2 ต.สุเทพ อ.เมือง จ.เชียงใหม่</span>
            </div>

            <span className="text-[11px] text-slate-400 bg-slate-800/60 px-3 py-1 rounded-xl">
              คลิกที่หมุดบ้านเพื่อดูข้อมูล
            </span>
          </div>

          {/* Pins on Village Map */}
          <div className="relative w-full h-64 my-auto">
            {filteredPatients.map((patient, index) => {
              const coords = getVillageCoords(index);
              const cat = getPatientCategory(patient);
              const isSelected = activePatient?.id === patient.id;

              return (
                <div
                  key={patient.id}
                  onClick={() => setActivePatient(patient)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                >
                  {/* Pin Node */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${getPinColor(
                      cat
                    )} ${isSelected ? 'ring-4 ring-white' : ''}`}
                  >
                    <Home className="w-4 h-4" />
                  </div>

                  {/* Pin Label Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-md pointer-events-none opacity-90 group-hover:opacity-100">
                    {patient.firstName} ({cat})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="relative z-10 bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>ติดสังคม</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>ติดบ้าน</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>ติดเตียง</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              พิกัดหมุดอิงตามเลขที่บ้านในพื้นที่
            </span>
          </div>
        </div>

        {/* Selected Patient Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          {activePatient ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    getPatientCategory(activePatient) === 'ติดเตียง'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : getPatientCategory(activePatient) === 'ติดบ้าน'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  กลุ่ม{getPatientCategory(activePatient)}
                </span>
                <span className="text-xs text-slate-400 font-bold">อายุ {activePatient.age} ปี</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activePatient.firstName} {activePatient.lastName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{formatAddress(activePatient.address)}</span>
                </p>
              </div>

              {/* Patient Contacts & Medical Conditions */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    เบอร์โทรศัพท์:
                  </span>
                  <a href={`tel:${activePatient.phone}`} className="font-bold text-blue-700 hover:underline">
                    {activePatient.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">โรคประจำตัว:</span>
                  <span className="font-bold text-slate-800 text-right">
                    {activePatient.diseases?.join(', ') || 'ไม่มี'}
                  </span>
                </div>

                {activePatient.caregiverContacts?.[0] && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500">ผู้ดูแล:</span>
                    <span className="font-semibold text-slate-700">
                      {activePatient.caregiverContacts[0].name} ({activePatient.caregiverContacts[0].relationship})
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={e => handleOpenGoogleMaps(activePatient, e)}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>นำทางด้วย Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                {onSelectPatient && (
                  <button
                    type="button"
                    onClick={() => onSelectPatient(activePatient)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                  >
                    <span>ดูประวัติและบันทึกสัญญาณชีพ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              เลือกหมุดบนแผนที่เพื่อดูข้อมูลผู้สูงอายุ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
