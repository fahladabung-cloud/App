import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, AppointmentRequest } from '../../types';
import {
  ShieldCheck,
  Calendar,
  HeartPulse,
  Building2,
  Stethoscope,
  Pill,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Megaphone,
  Sparkles,
  Eye,
  Send,
  UserCheck,
  PhoneCall,
  MapPin,
  Plus,
  ChevronRight,
  User,
  AlertCircle,
  Map,
  FileSpreadsheet
} from 'lucide-react';
import { VhvElderlyListView } from './VhvElderlyListView';
import { VhvHealthDetailView } from './VhvHealthDetailView';

type MenuKey = 'nhso' | 'calendar' | 'vitals' | 'hospitals' | 'symptoms' | 'meds';

interface MenuCardItem {
  key: MenuKey;
  title: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  colorClass: string;
  iconBgClass: string;
}

const VHV_MENU_CARDS: MenuCardItem[] = [
  {
    key: 'nhso',
    title: 'เช็กสิทธิรักษา',
    icon: ShieldCheck,
    badge: 'สปสช./บัตรทอง',
    description: 'ตรวจสอบและอัปเดตสิทธิรักษาพยาบาล สปสช. บัตรทอง ประกันสังคม',
    colorClass: 'border-blue-200 hover:border-blue-500 bg-gradient-to-br from-blue-50/50 to-white',
    iconBgClass: 'bg-blue-600 text-white shadow-blue-200',
  },
  {
    key: 'calendar',
    title: 'ปฏิทินชุมชน',
    icon: Calendar,
    badge: 'นัดหมายชุมชน',
    description: 'ดูวันนัดหมาย กิจกรรมตรวจสุขภาพ และตารางติดตามผู้สูงอายุ',
    colorClass: 'border-indigo-200 hover:border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white',
    iconBgClass: 'bg-indigo-600 text-white shadow-indigo-200',
  },
  {
    key: 'vitals',
    title: 'บันทึกสัญญาณชีพ',
    icon: HeartPulse,
    badge: 'ความดัน/ชีพจร',
    description: 'บันทึกและติดตามความดันโลหิต อัตราชีพจร ออกซิเจน และอุณหภูมิ',
    colorClass: 'border-rose-200 hover:border-rose-500 bg-gradient-to-br from-rose-50/50 to-white',
    iconBgClass: 'bg-rose-600 text-white shadow-rose-200',
  },
  {
    key: 'hospitals',
    title: 'สถานพยาบาลใกล้ฉัน',
    icon: Building2,
    badge: 'รพ.สต. / รพ.',
    description: 'ค้นหารายชื่อ รพ.สต. และสถานพยาบาลใกล้เคียง พร้อมเส้นทางนำทาง',
    colorClass: 'border-emerald-200 hover:border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white',
    iconBgClass: 'bg-emerald-600 text-white shadow-emerald-200',
  },
  {
    key: 'symptoms',
    title: 'บันทึกอาการ',
    icon: Stethoscope,
    badge: 'ประเมิน 15 อาการ',
    description: 'ประเมินและบันทึกอาการไม่สบาย 15 รายการสำคัญของผู้สูงอายุ',
    colorClass: 'border-amber-200 hover:border-amber-500 bg-gradient-to-br from-amber-50/50 to-white',
    iconBgClass: 'bg-amber-600 text-white shadow-amber-200',
  },
  {
    key: 'meds',
    title: 'ยาที่ใช้ประจำ',
    icon: Pill,
    badge: 'การทานยา',
    description: 'ตรวจสอบและจัดระเบียบรายการยาประจำตัว พร้อมแจ้งเตือนการทานยา',
    colorClass: 'border-purple-200 hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-white',
    iconBgClass: 'bg-purple-600 text-white shadow-purple-200',
  },
];

export const VhvDashboard: React.FC = () => {
  const {
    currentUser,
    currentVhvProfile,
    appointments,
    updateAppointmentStatus,
    publishAnnouncement,
    showToast,
    activeTab,
    setActiveTab
  } = useApp();

  // Navigation flow states
  const [viewState, setViewState] = useState<'dashboard' | 'elderly_list' | 'patient_detail'>('dashboard');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('nhso');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  // Sync with left sidebar navigation (activeTab)
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setViewState('dashboard');
    }
  }, [activeTab]);

  // Today's Checkup Queue modal state
  const [selectedApp, setSelectedApp] = useState<AppointmentRequest | null>(null);
  const [viewAppDetail, setViewAppDetail] = useState<AppointmentRequest | null>(null);
  const [proposedTime, setProposedTime] = useState('11:00');

  // AI Announcement Generator States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('การดูแลรักษาสุขภาพผู้สูงอายุในช่วงฤดูฝน');
  const [aiTargetGroup, setAiTargetGroup] = useState('ผู้สูงอายุและผู้ป่วยความดันโลหิตสูง');
  const [aiDetails, setAiDetails] = useState('รักษาร่างกายให้อบอุ่น ระวังอุบัติเหตุลื่นล้มในบ้าน และตรวจวัดความดันโลหิตสม่ำเสมอ');
  const [aiStep, setAiStep] = useState<'input' | 'draft' | 'preview'>('input');
  const [aiDraftTitle, setAiDraftTitle] = useState('');
  const [aiDraftContent, setAiDraftContent] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const vhvName = currentVhvProfile
    ? `${currentVhvProfile.firstName} ${currentVhvProfile.lastName}`
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'สมชาย ใจดี';

  // Card click handler -> Opens Elderly List for selected topic
  const handleMenuClick = (key: MenuKey) => {
    setActiveMenu(key);
    setViewState('elderly_list');
  };

  // Patient select handler from Elderly List -> Opens Patient Health Details
  const handleSelectPatient = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setViewState('patient_detail');
  };

  const getMenuTitle = (key: MenuKey): string => {
    const card = VHV_MENU_CARDS.find(c => c.key === key);
    return card ? card.title : 'ข้อมูลสุขภาพ';
  };

  // AI Draft generator call
  const handleGenerateAiDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAi(true);

    try {
      const res = await fetch('/api/ai/announcement-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          targetGroup: aiTargetGroup,
          details: aiDetails,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setAiDraftTitle(data.draft.title || aiTopic);
        setAiDraftContent(data.draft.content || aiDetails);
        setAiStep('draft');
        showToast('สร้างยกร่างประกาศด้วย AI สำเร็จ');
      } else {
        setAiDraftTitle(`ประกาศ อสม.: ${aiTopic}`);
        setAiDraftContent(
          `เรียน พ่อแม่พี่น้องผู้สูงอายุและผู้รับบริการสุขภาพชุมชนทุกท่าน\n\n${aiDetails}\n\nหากท่านมีข้อสงสัยหรือต้องการตรวจสุขภาพเพิ่มเติม สามารถติดต่อ อสม. ประจำหมู่บ้านได้ตลอดเวลาครับ/ค่ะ`
        );
        setAiStep('draft');
      }
    } catch {
      setAiDraftTitle(`ประกาศ อสม.: ${aiTopic}`);
      setAiDraftContent(
        `เรียน พ่อแม่พี่น้องผู้สูงอายุและผู้รับบริการสุขภาพชุมชนทุกท่าน\n\n${aiDetails}\n\nด้วยความห่วงใยจาก อสม. ประจำชุมชน`
      );
      setAiStep('draft');
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublishAnnouncement = () => {
    publishAnnouncement({
      title: aiDraftTitle,
      content: aiDraftContent,
      authorName: `อสม. ${vhvName}`,
      date: new Date().toISOString().split('T')[0],
      targetGroup: aiTargetGroup,
    });
    setAiStep('input');
    setAiDraftTitle('');
    setAiDraftContent('');
    setShowAiModal(false);
  };

  // RENDER PHASE 2: ELDERLY PATIENT LIST VIEW
  if (viewState === 'elderly_list') {
    return (
      <div className="max-w-5xl mx-auto">
        <VhvElderlyListView
          menuTitle={getMenuTitle(activeMenu)}
          menuKey={activeMenu}
          onSelectPatient={handleSelectPatient}
          onBackToMenu={() => setViewState('dashboard')}
        />
      </div>
    );
  }

  // RENDER PHASE 3: PATIENT HEALTH DETAIL VIEW
  if (viewState === 'patient_detail' && selectedPatient) {
    return (
      <div className="max-w-5xl mx-auto">
        <VhvHealthDetailView
          patient={selectedPatient}
          patientId={selectedPatient.id}
          menuKey={activeMenu}
          initialTab={activeMenu}
          onBack={() => setViewState('elderly_list')}
        />
      </div>
    );
  }

  // RENDER PHASE 1: MAIN VHV DASHBOARD VIEW
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner / Greeting */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white backdrop-blur-xs">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            บทบาท: อสม.
          </span>
          <span className="text-xs text-blue-200 font-medium">
            พื้นที่รับผิดชอบ: รพ.สต.สุเทพ • อ.เมือง จ.เชียงใหม่
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            สวัสดีคุณ {vhvName}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 opacity-90 max-w-xl">
            ยินดีต้อนรับสู่ศูนย์ปฏิบัติงาน อสม. เลือกเมนูบริการด้านล่างเพื่อติดตามและบันทึกข้อมูลสุขภาพของผู้สูงอายุในความดูแล
          </p>
        </div>
      </div>

      {/* Quick Fieldwork Tools Bar (GIS Map & Reports) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('gis_map')}
          className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Map className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                แผนที่ปักหมุดบ้านผู้สูงอายุ (GIS Map)
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              ดูพิกัดบ้านและสถานะ ติดสังคม / ติดบ้าน / ติดเตียง เพื่อวางแผนลงพื้นที่
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                ระบบส่งออกรายงานสรุป อสม.
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              สร้างรายงานสรุปตรวจสุขภาพประจำเดือนเพื่อส่ง รพ.สต. หรือพิมพ์เอกสาร
            </p>
          </div>
        </button>
      </div>

      {/* Main 6-Card Grid Menu (2x3 on Mobile, 3x2 on Desktop) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block" />
            เมนูหลักสำหรับ อสม.
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            เลือก 1 ใน 6 เมนู เพื่อเข้าสู่รายชื่อผู้สูงอายุ
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {VHV_MENU_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => handleMenuClick(card.key)}
                className={`p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between group relative overflow-hidden ${card.colorClass}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${card.iconBgClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white/80 border border-slate-200 text-slate-700 rounded-full shadow-2xs">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                  <span>เข้าสู่เมนู</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* "คิวตรวจวันนี้" (Today's Checkup Queue) Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">คิวตรวจวันนี้</h2>
              <p className="text-xs text-slate-500">คำขอนัดหมายตรวจติดตามสุขภาพจากผู้สูงอายุในชุมชน</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
            {appointments.filter(a => a.status === 'รอตรวจสอบ').length} คำขอใหม่
          </span>
        </div>

        {appointments.length === 0 ? (
          /* Empty State for Today's Checkup Queue */
          <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-2 border border-slate-200/60">
            <div className="w-12 h-12 bg-slate-200/70 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">วันนี้ยังไม่มีคำขอตรวจ</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              เมื่อผู้สูงอายุหรือผู้ดูแลส่งคำขอนัดหมายตรวจสุขภาพ ระบบจะแสดงรายการที่นี่
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(app => (
              <div
                key={app.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-purple-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-slate-900 text-sm">{app.patientName}</span>
                    <span className="text-xs text-slate-500">({app.patientPhone})</span>
                  </div>

                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                    วันที่ {app.date} เวลา {app.time} น.
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong className="text-slate-800">อาการสำคัญ:</strong> {app.symptoms}</p>
                  <p><strong className="text-slate-800">สาเหตุที่ขอนัด:</strong> {app.cause}</p>
                  <p><strong className="text-slate-800">สถานะ:</strong> <span className="font-bold text-amber-700">{app.status}</span></p>
                </div>

                {/* Queue Decision Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setViewAppDetail(app)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    ดูคำขอ
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(app.id, 'อนุมัติแล้ว');
                      showToast('อนุมัติคำขอนัดหมายเรียบร้อยแล้ว');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    อนุมัติ
                  </button>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Clock className="w-4 h-4" />
                    เสนอเวลาใหม่
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(app.id, 'ปฏิเสธ');
                      showToast('ปฏิเสธคำขอนัดหมายเรียบร้อยแล้ว');
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "ประกาศ" (Announcements) Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">ประกาศข่าวสารสุขภาพชุมชน</h2>
              <p className="text-xs text-slate-500">สร้างข่าวสารแจ้งเตือนถึงผู้สูงอายุและญาติในพื้นที่</p>
            </div>
          </div>

          <button
            onClick={() => {
              setAiStep('input');
              setShowAiModal(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ สร้างประกาศ AI</span>
          </button>
        </div>

        <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>ใช้ AI ช่วยยกร่างข้อความประกาศคำแนะนำสุขภาพประจำฤดูกาลได้อย่างรวดเร็ว</span>
          </div>
          <button
            onClick={() => {
              setAiStep('input');
              setShowAiModal(true);
            }}
            className="font-bold underline hover:text-indigo-700 cursor-pointer shrink-0"
          >
            เริ่มร่างประกาศ
          </button>
        </div>
      </div>

      {/* "ใกล้ฉัน" (Nearby Emergency & Facility Shortcuts) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-base">ศูนย์ประสานงานใกล้ฉัน & สายด่วน</h3>
          </div>
          <span className="text-[11px] text-slate-300">ต.สุเทพ อ.เมือง จ.เชียงใหม่</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <a
            href="tel:1669"
            className="p-3 bg-red-600/90 hover:bg-red-600 rounded-2xl font-bold flex items-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>กู้ชีพฉุกเฉิน 1669</span>
          </a>
          <a
            href="tel:1330"
            className="p-3 bg-blue-600/90 hover:bg-blue-600 rounded-2xl font-bold flex items-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>สายด่วน สปสช. 1330</span>
          </a>
          <div className="p-3 bg-white/10 rounded-2xl font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>รพ.สต.สุเทพ: 053-211-123</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>รพ.มหาราชนครเชียงใหม่: 053-936-111</span>
          </div>
        </div>
      </div>

      {/* Detail Modal for Appointment Request */}
      {viewAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">รายละเอียดคำขอนัดหมาย</h3>
              <button
                onClick={() => setViewAppDetail(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong className="text-slate-900">ชื่อผู้สูงอายุ:</strong> {viewAppDetail.patientName}</p>
              <p><strong className="text-slate-900">เบอร์โทรศัพท์:</strong> {viewAppDetail.patientPhone}</p>
              <p><strong className="text-slate-900">วันที่และเวลานัด:</strong> {viewAppDetail.date} เวลา {viewAppDetail.time} น.</p>
              <p><strong className="text-slate-900">อาการไม่สบาย:</strong> {viewAppDetail.symptoms}</p>
              <p><strong className="text-slate-900">สาเหตุที่ขอนัด:</strong> {viewAppDetail.cause}</p>
              <p><strong className="text-slate-900">สถานะปัจจุบัน:</strong> {viewAppDetail.status}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewAppDetail(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Propose New Time Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              เสนอเวลาใหม่สำหรับคิวนัดหมาย
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เลือกเวลาใหม่ที่ อสม. สะดวก
              </label>
              <input
                type="time"
                value={proposedTime}
                onChange={e => setProposedTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-center"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  updateAppointmentStatus(selectedApp.id, 'เสนอเวลาใหม่', proposedTime);
                  setSelectedApp(null);
                  showToast('ส่งข้อเสนอเวลาใหม่ให้ผู้ป่วยเรียบร้อยแล้ว');
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                ส่งข้อเสนอเวลาใหม่
              </button>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Announcement Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
                <h3 className="text-lg font-bold text-slate-900">สร้างประกาศด้วย AI</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiStep === 'input' && (
              <form onSubmit={handleGenerateAiDraft} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">หัวข้อประกาศ</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">กลุ่มเป้าหมายหลัก</label>
                  <input
                    type="text"
                    required
                    value={aiTargetGroup}
                    onChange={e => setAiTargetGroup(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">รายละเอียดสำคัญ</label>
                  <textarea
                    rows={3}
                    required
                    value={aiDetails}
                    onChange={e => setAiDetails(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAi}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loadingAi ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      สร้างยกร่างด้วย AI
                    </>
                  )}
                </button>
              </form>
            )}

            {aiStep === 'draft' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-3">
                  <span className="font-bold text-indigo-900 block text-sm">
                    ✏️ ยกร่างข้อความประกาศ
                  </span>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">หัวข้อประกาศ</label>
                    <input
                      type="text"
                      value={aiDraftTitle}
                      onChange={e => setAiDraftTitle(e.target.value)}
                      className="w-full p-3 bg-white border border-indigo-200 rounded-xl font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">เนื้อหาประกาศ</label>
                    <textarea
                      rows={6}
                      value={aiDraftContent}
                      onChange={e => setAiDraftContent(e.target.value)}
                      className="w-full p-3 bg-white border border-indigo-200 rounded-xl font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAiStep('preview')}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    ดูตัวอย่างประกาศ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiStep('input')}
                    className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    แก้ไขหัวข้อใหม่
                  </button>
                </div>
              </div>
            )}

            {aiStep === 'preview' && (
              <div className="space-y-4 text-xs">
                <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl text-white space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                      ตัวอย่างประกาศจริงบนหน้าแอปผู้ป่วย
                    </span>
                    <span className="text-xs text-blue-100">วันนี้</span>
                  </div>
                  <h3 className="text-xl font-bold">{aiDraftTitle}</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-blue-50">
                    {aiDraftContent}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePublishAnnouncement}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    ยืนยันและเผยแพร่ประกาศ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiStep('draft')}
                    className="py-4 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs cursor-pointer"
                  >
                    กลับไปแก้ไข
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
