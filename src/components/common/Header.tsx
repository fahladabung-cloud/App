import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Bell,
  Type,
  LogOut,
  MapPin,
  AlertTriangle,
  User,
  ShieldAlert
} from 'lucide-react';
import { SosModal } from './SosModal';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const {
    currentUser,
    fontSize,
    setFontSize,
    locationPermission,
    setLocationPermission,
    notifications,
    logout,
    sosAlerts
  } = useApp();

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const unreadCount = currentUser
    ? notifications.filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  const activeSosCount = sosAlerts.filter(s => s.status === 'ACTIVE').length;

  const getRoleBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'PATIENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <User className="w-3.5 h-3.5" />
            ผู้ป่วย / ผู้สูงอายุ
          </span>
        );
      case 'CAREGIVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <User className="w-3.5 h-3.5" />
            ผู้ดูแล / ญาติ
          </span>
        );
      case 'VHV':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            อสม. (สาธารณสุขชุมชน)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center justify-between w-full">
          {/* Left Brand / Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center justify-center font-bold shadow-xs">
              <HeartPulse className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                  Com-Health สุขภาพชุมชน
                </h1>
                {getRoleBadge()}
              </div>
              {currentUser && (
                <p className="text-xs text-slate-500 hidden sm:block">
                  สวัสดีคุณ <span className="font-semibold text-slate-800">{currentUser.firstName} {currentUser.lastName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Accessibility Font Controls */}
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
                title="ขนาดอักษรปกติ"
              >
                ก
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
                title="ขนาดอักษรใหญ่"
              >
                ก+
              </button>
              <button
                onClick={() => setFontSize('extralarge')}
                className={`px-2.5 py-1 text-base font-extrabold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'extralarge'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
                title="ขนาดอักษรใหญ่มาก"
              >
                ก++
              </button>
            </div>

            {/* SOS Emergency Alert Button */}
            <button
              onClick={() => setIsSosOpen(true)}
              className="relative px-3 py-2 sm:px-4 sm:py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="font-extrabold">SOS</span>
              {activeSosCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse border border-white">
                  {activeSosCount}
                </span>
              )}
            </button>

            {/* Notifications Icon Button */}
            {currentUser && (
              <div
                onClick={() => setIsNotifOpen(true)}
                className="relative cursor-pointer group"
                title="การแจ้งเตือน"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors text-slate-600">
                  <Bell className="w-5 h-5" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}

            {/* User Profile Info Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-slate-400">{currentUser.phone}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                </div>
              </div>
            )}

            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4 text-slate-500 hover:text-red-600" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Logout Confirmation Dialog (Requirement #28) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">ยืนยันการออกจากระบบ?</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                ข้อมูลสุขภาพ ประวัติการตรวจ ยา และนัดหมายของคุณจะยังคงปลอดภัยในระบบเมื่อคุณเข้าสู่ระบบอีกครั้ง
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-red-100"
              >
                ออกจากระบบ
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
