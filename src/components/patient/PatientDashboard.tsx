import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Activity,
  MapPin,
  Stethoscope,
  Pill,
  Megaphone,
  UserCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

export const PatientDashboard: React.FC = () => {
  const { currentPatientProfile, announcements, setActiveTab, navigateToHealthSubTab, vitalSigns, medications } = useApp();

  const firstName = currentPatientProfile?.firstName || 'สมศรี';
  const lastName = currentPatientProfile?.lastName || 'ใจดี';
  const status = currentPatientProfile?.status || 'ช่วยเหลือตัวเองได้';
  const diseases = currentPatientProfile?.diseases || [];

  const patientVitals = currentPatientProfile
    ? vitalSigns.filter(v => v.patientId === currentPatientProfile.id)
    : vitalSigns;
  const latestVital = patientVitals[0];

  const patientMeds = currentPatientProfile
    ? medications.filter(m => m.patientId === currentPatientProfile.id)
    : medications;

  const latestAnnouncement = announcements[0];

  const handleCardClick = (cardId: string) => {
    if (cardId === 'hospitals') {
      setActiveTab('hospitals');
    } else if (cardId === 'nhso' || cardId === 'calendar' || cardId === 'vitals' || cardId === 'symptoms' || cardId === 'meds') {
      navigateToHealthSubTab(cardId as any);
    } else {
      setActiveTab('health');
    }
  };

  const getStatusColor = (st: string) => {
    if (st.includes('ติดเตียง')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (st.includes('ติดบ้าน')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (st.includes('ติดสังคม')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const cards = [
    {
      id: 'nhso',
      title: 'เช็กสิทธิรักษา',
      desc: 'ตรวจสอบสิทธิ สปสช. บัตรทอง ประกันสังคม ข้าราชการ',
      icon: ShieldCheck,
      color: 'bg-emerald-500 text-white',
    },
    {
      id: 'calendar',
      title: 'ปฏิทินชุมชน',
      desc: 'วันประกาศ อสม. รายการที่ต้องทำ และนัดหมายตรวจสุขภาพ',
      icon: Calendar,
      color: 'bg-teal-500 text-white',
    },
    {
      id: 'vitals',
      title: 'บันทึกสัญญาณชีพ',
      desc: latestVital 
        ? `ล่าสุด: ความดัน ${latestVital.systolic}/${latestVital.diastolic} mmHg, ชีพจร ${latestVital.pulse} bpm`
        : 'วัดความดันโลหิต ชีพจร ออกซิเจน SpO2 และอุณหภูมิ',
      icon: Activity,
      color: 'bg-rose-500 text-white',
    },
    {
      id: 'hospitals',
      title: 'สถานพยาบาลใกล้ฉัน',
      desc: 'ค้นหารายชื่อโรงพยาบาล รพ.สต. และนำทาง GPS',
      icon: MapPin,
      color: 'bg-blue-500 text-white',
    },
    {
      id: 'symptoms',
      title: 'บันทึกอาการ',
      desc: 'บันทึกอาการผิดปกติ 15 รายการ และช่วงเวลาเกิดอาการ',
      icon: Stethoscope,
      color: 'bg-purple-500 text-white',
    },
    {
      id: 'meds',
      title: 'ยาที่ใช้ประจำ',
      desc: `มียาประจำ ${patientMeds.length} รายการ ตรวจสอบและจัดการชื่อยา ขนาด และเวลาทาน`,
      icon: Pill,
      color: 'bg-amber-500 text-white',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Greeting & Role Badge Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5" />
              ผู้ป่วย / ผู้สูงอายุ
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
              สถานะ: {status}
            </span>
            <VoiceReaderButton
              textToRead={`สวัสดีคุณ ${firstName} ${lastName} สถานะสุขภาพของคุณคือ ${status} มีโรคประจำตัว ${diseases.join(', ') || 'ไม่มี'} ยินดีต้อนรับสู่ระบบดูแลสุขภาพชุมชน`}
              size="sm"
              label="ฟังข้อมูลของคุณ"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            สวัสดีคุณ <span className="text-blue-700">{firstName} {lastName}</span>
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 flex-wrap">
            {currentPatientProfile?.age && (
              <span>อายุ <strong>{currentPatientProfile.age}</strong> ปี</span>
            )}
            {diseases.length > 0 && (
              <span>• โรคประจำตัว: <strong>{diseases.join(', ')}</strong></span>
            )}
          </div>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-2xl text-xs transition-colors cursor-pointer shrink-0"
        >
          ✏️ แก้ไขข้อมูลและสุขภาพ
        </button>
      </div>

      {/* Hero Section: Latest Announcement from VHV */}
      {latestAnnouncement && (
        <div
          onClick={() => setActiveTab('announcements')}
          className="bg-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-300" />
                ประกาศล่าสุดจาก อสม.
              </span>
              <div className="flex items-center gap-2">
                <VoiceReaderButton
                  textToRead={`ประกาศล่าสุดจาก อสม. เรื่อง ${latestAnnouncement.title} รายละเอียด ${latestAnnouncement.content}`}
                  size="sm"
                  label="ฟังเสียงอ่าน"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                />
                <span className="text-xs text-blue-200 font-medium">
                  {latestAnnouncement.date}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {latestAnnouncement.title}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 line-clamp-2 leading-relaxed opacity-90">
              {latestAnnouncement.content}
            </p>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 pt-1 group-hover:translate-x-1 transition-transform">
              <span>อ่านประกาศทั้งหมด</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 6 Main Action Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 px-1">เมนูสุขภาพของคุณ</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${card.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-blue-700 pt-2 border-t border-slate-100">
                  <span>เข้าสู่หน้า{card.title}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
