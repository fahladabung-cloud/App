import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Activity,
  Calendar,
  MapPin,
  User,
  Megaphone,
  Users,
  ClipboardList,
  HeartHandshake,
  Map,
  FileSpreadsheet
} from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const { currentUser, deviceType, fontSize, activeTab, setActiveTab } = useApp();

  // FontSize wrapper classes applied to body container
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base scale-font-large';
      case 'extralarge':
        return 'text-lg scale-font-xl';
      default:
        return 'text-sm';
    }
  };

  // Nav items based on user role
  const getNavItems = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'PATIENT') {
      return [
        { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
        { id: 'health', label: 'ข้อมูลสุขภาพ', icon: Activity },
        { id: 'announcements', label: 'ประกาศ', icon: Megaphone },
        { id: 'hospitals', label: 'พิกัด/ใกล้ฉัน', icon: MapPin },
        { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User },
      ];
    } else if (currentUser.role === 'CAREGIVER') {
      return [
        { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
        { id: 'patients', label: 'ผู้ป่วยที่ดูแล', icon: Users },
        { id: 'announcements', label: 'ประกาศ', icon: Megaphone },
        { id: 'hospitals', label: 'พิกัด/ใกล้ฉัน', icon: MapPin },
        { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User },
      ];
    } else {
      // VHV (อสม.)
      return [
        { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
        { id: 'queue', label: 'คิวตรวจวันนี้', icon: ClipboardList },
        { id: 'elderly', label: 'ผู้สูงอายุในดูแล', icon: HeartHandshake },
        { id: 'gis_map', label: 'แผนที่ปักหมุด', icon: Map },
        { id: 'reports', label: 'ส่งออกรายงาน', icon: FileSpreadsheet },
        { id: 'announcements', label: 'สร้างประกาศ', icon: Megaphone },
        { id: 'hospitals', label: 'พิกัด/ใกล้ฉัน', icon: MapPin },
        { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  // Render according to selected Device Mode (PHONE, TABLET, DESKTOP)
  if (deviceType === 'phone') {
    return (
      <div className={`min-h-screen bg-slate-100 pb-24 ${getFontSizeClass()}`}>
        {/* Mobile Viewport Wrapper */}
        <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-xl border-x border-slate-200 flex flex-col">
          <main className="flex-1 p-4">{children}</main>

          {/* Phone Bottom Navigation Bar (Requirement #11, #29) */}
          {currentUser && (
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-30 shadow-lg">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-bold scale-105'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    <span className="text-[11px] leading-tight text-center truncate max-w-[68px]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <div className={`min-h-screen bg-slate-100 flex flex-col ${getFontSizeClass()}`}>
        {/* Tablet Top/Sub Bar Navigation */}
        {currentUser && (
          <nav className="bg-slate-900 text-white px-6 py-3 shadow-md flex items-center justify-center gap-2 overflow-x-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        <main className="flex-1 max-w-5xl w-full mx-auto p-6">{children}</main>
      </div>
    );
  }

  // DESKTOP: Sidebar Navigation + Sleek Layout
  return (
    <div className={`flex min-h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-x-hidden ${getFontSizeClass()}`}>
      {/* Desktop Sidebar (Sleek Interface Style) */}
      {currentUser && (
        <aside className="w-64 bg-blue-700 text-white shrink-0 min-h-screen p-6 flex flex-col justify-between shadow-xl sticky top-0 h-screen">
          <div>
            {/* Sidebar Logo Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="p-2 bg-white rounded-lg text-blue-700 shadow-sm flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </span>
                Com-Health
              </h1>
              <div className="mt-3 bg-blue-800/50 rounded-full px-3.5 py-1 text-xs border border-blue-400/30 inline-block font-medium">
                บทบาท: {currentUser.role === 'PATIENT' ? 'ผู้ป่วย/สูงอายุ' : currentUser.role === 'CAREGIVER' ? 'ผู้ดูแล/ญาติ' : 'อสม. (VHV)'}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-blue-900 font-extrabold shadow-md scale-102'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-700' : 'text-blue-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Emergency & Helpline Footer */}
          <div className="pt-4 border-t border-blue-400/20 space-y-2 text-xs opacity-90">
            <div className="p-3 bg-blue-800/40 rounded-xl space-y-1">
              <p className="font-bold text-amber-300">สายด่วนชุมชน</p>
              <p className="text-[11px]">กู้ชีพฉุกเฉิน: 1669</p>
              <p className="text-[11px]">สปสช. บัตรทอง: 1330</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-y-auto">
        <section className="flex-1 p-6 sm:p-8">{children}</section>

        {/* Footer Bar */}
        <footer className="bg-white border-t border-slate-200 px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 shrink-0 gap-2">
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">ช่วยเหลือ (Help Center)</span>
            <span className="hover:text-slate-600 cursor-pointer">นโยบายความเป็นส่วนตัว</span>
            <span className="hover:text-slate-600 cursor-pointer">เงื่อนไขการใช้งาน</span>
          </div>
          <div>Version 1.2.0-stable • เชื่อมต่อฐานข้อมูลระบบ สปสช. สำเร็จ</div>
        </footer>
      </main>
    </div>
  );
};
