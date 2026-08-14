import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ELDERLY_SYMPTOMS, TIME_PERIODS, VhvPermissionState } from '../../types';
import { Stethoscope, Plus, Clock, Calendar, CheckCircle2, Lock } from 'lucide-react';

interface SymptomsViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const SymptomsView: React.FC<SymptomsViewProps> = ({ patientId, readOnly, permission }) => {
  const { currentPatientProfile, symptomRecords, addSymptomRecord, showToast } = useApp();
  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;

  const userRecords = symptomRecords.filter(r => r.patientId === pId);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['ปวดศีรษะ', 'เวียนศีรษะ / หน้ามืด']);
  const [otherSymptom, setOtherSymptom] = useState('');

  const [duration, setDuration] = useState('1 ชั่วโมง');
  const [otherDuration, setOtherDuration] = useState('');

  const [timePeriod, setTimePeriod] = useState<typeof TIME_PERIODS[number]>('เช้า 06:00–11:59');
  const [recordDate, setRecordDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [recordTime, setRecordTime] = useState<string>('09:00');
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSaveSymptom = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDenied) {
      setShowPermissionWarning(true);
      return;
    }

    if (selectedSymptoms.length === 0 && !otherSymptom.trim()) {
      showToast('กรุณาเลือกอาการอย่างน้อย 1 รายการ หรือระบุในช่องอื่นๆ');
      return;
    }

    addSymptomRecord({
      patientId: pId,
      symptoms: selectedSymptoms,
      otherSymptom,
      duration: duration === 'อื่นๆ' ? (otherDuration || 'ไม่ระบุ') : (duration as any),
      timePeriod: timePeriod as any,
      recordedAt: `${recordDate}T${recordTime}:00.000Z`,
    });

    showToast('บันทึกอาการผิดปกติเรียบร้อยแล้ว');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-700" />
          บันทึกอาการผิดปกติ
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ระบุอาการ ระยะเวลา และช่วงเวลาที่เกิดอาการ เพื่อให้ อสม. ช่วยประเมินเบื้องต้น
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        {isDenied && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-medium">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block mb-0.5">ดูข้อมูลได้อย่างเดียว (Read-Only)</strong>
              คุณสามารถดูข้อมูลได้ แต่ไม่สามารถแก้ไขข้อมูลนี้ เนื่องจากเจ้าของข้อมูลยังไม่ได้อนุญาต
            </div>
          </div>
        )}

        <form onSubmit={handleSaveSymptom} className="space-y-6">
          {/* 15 Symptoms Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              อาการที่พบ (เลือกได้หลายรายการ)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ELDERLY_SYMPTOMS.map(sym => {
                const isChecked = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => handleSymptomToggle(sym)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sym}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">อาการอื่นๆ (ระบุ)</label>
              <input
                type="text"
                placeholder="เช่น คันตามผิวหนัง, ตาพร่ามัว"
                value={otherSymptom}
                onChange={e => setOtherSymptom(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Duration Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">ระยะเวลาที่เป็น</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['30 นาที', '1 ชั่วโมง', '2 ชั่วโมง', 'อื่นๆ'].map(dur => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    duration === dur
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>

            {duration === 'อื่นๆ' && (
              <input
                type="text"
                placeholder="ระบุระยะเวลา เช่น 3 วัน"
                value={otherDuration}
                onChange={e => setOtherDuration(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium mt-2"
              />
            )}
          </div>

          {/* Time Periods */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">ช่วงเวลาที่เกิดอาการ</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIME_PERIODS.map(tp => (
                <button
                  type="button"
                  key={tp}
                  onClick={() => setTimePeriod(tp)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                    timePeriod === tp
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">วันที่พบอาการ</label>
              <input
                type="date"
                required
                value={recordDate}
                onChange={e => setRecordDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">เวลา</label>
              <input
                type="time"
                required
                value={recordTime}
                onChange={e => setRecordTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl text-sm shadow-md shadow-blue-200 transition-all cursor-pointer"
          >
            บันทึกอาการ
          </button>
        </form>
      </div>

      {/* Symptoms Log History */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800">ประวัติการบันทึกอาการ</h3>

        <div className="space-y-3">
          {userRecords.map(r => (
            <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <span className="font-bold text-xs text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                  {r.timePeriod}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(r.recordedAt).toLocaleDateString('th-TH')} เวลา{' '}
                  {new Date(r.recordedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">
                  อาการ: {r.symptoms.join(', ')} {r.otherSymptom ? `(${r.otherSymptom})` : ''}
                </p>
                <p className="text-slate-500">ระยะเวลาที่เป็น: {r.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Warning Dialog */}
      {showPermissionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">ไม่สามารถแก้ไขข้อมูลได้</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                กรุณาขออนุญาตจากผู้ป่วยหรือผู้ดูแลก่อน
              </p>
            </div>
            <button
              onClick={() => setShowPermissionWarning(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
