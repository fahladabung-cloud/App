import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, Lock } from 'lucide-react';
import { VhvPermissionState } from '../../types';

interface VhvPermissionDialogProps {
  patientName: string;
  isOpen: boolean;
  onSelectPermission: (perm: VhvPermissionState) => void;
}

export const VhvPermissionDialog: React.FC<VhvPermissionDialogProps> = ({
  patientName,
  isOpen,
  onSelectPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            อนุญาตให้ อสม. จัดการข้อมูลของคุณหรือไม่?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            อสม. สามารถช่วยบันทึกและแก้ไขข้อมูลสุขภาพของ <strong className="text-slate-900 font-bold">{patientName}</strong> ได้เมื่อได้รับอนุญาต
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => onSelectPermission('granted')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>อนุญาต (เข้าถึงและแก้ไขได้เสมอ)</span>
          </button>

          <button
            onClick={() => onSelectPermission('granted_once')}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>เฉพาะครั้งนี้ (อนุญาตเฉพาะการใช้งานครั้งนี้)</span>
          </button>

          <button
            onClick={() => onSelectPermission('denied')}
            className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span>ไม่อนุญาต (ดูได้อย่างเดียว ห้ามแก้ไข)</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          ผู้ใช้เป็นผู้เลือกสิทธิ์เองตามนโยบายความเป็นส่วนตัวของข้อมูลสุขภาพ
        </p>
      </div>
    </div>
  );
};
