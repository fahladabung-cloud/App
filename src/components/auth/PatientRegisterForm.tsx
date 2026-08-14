import React, { useState } from 'react';
import {
  CHRONIC_DISEASES,
  PATIENT_STATUSES,
  CaregiverContact
} from '../../types';
import { User, Calendar, MapPin, Stethoscope, Plus, Trash2, ArrowLeft, Shield } from 'lucide-react';

interface PatientRegisterFormProps {
  initialData?: { firstName: string; lastName: string; phone: string };
  onBack: () => void;
  onSubmit?: (data: any) => void;
}

export const PatientRegisterForm: React.FC<PatientRegisterFormProps> = ({
  initialData = { firstName: 'สมศรี', lastName: 'ใจดี', phone: '0812345678' },
  onBack,
  onSubmit,
}) => {
  const [birthDate, setBirthDate] = useState('1956-05-15');
  const [age, setAge] = useState(70);

  // Address
  const [province, setProvince] = useState('เชียงใหม่');
  const [district, setDistrict] = useState('เมืองเชียงใหม่');
  const [subdistrict, setSubdistrict] = useState('สุเทพ');
  const [houseNo, setHouseNo] = useState('123/45');
  const [alley, setAlley] = useState('ซอย 5');
  const [moo, setMoo] = useState('หมู่ 2');

  // Chronic Diseases
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['ความดันโลหิตสูง', 'เบาหวาน']);
  const [otherDisease, setOtherDisease] = useState('');

  // Additional Health Info
  const [allergies, setAllergies] = useState('');
  const [currentMedicationsText, setCurrentMedicationsText] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [status, setStatus] = useState<typeof PATIENT_STATUSES[number]>('ช่วยเหลือตัวเองได้');
  const [otherStatusText, setOtherStatusText] = useState('');

  // Caregivers (up to 5)
  const [caregiverContacts, setCaregiverContacts] = useState<CaregiverContact[]>([
    { name: 'วิชัย ใจดี', phone: '0898765432', relationship: 'ลูกชาย' },
  ]);

  const handleDiseaseToggle = (disease: string) => {
    setSelectedDiseases(prev =>
      prev.includes(disease)
        ? prev.filter(d => d !== disease)
        : [...prev, disease]
    );
  };

  const handleAddCaregiver = () => {
    if (caregiverContacts.length >= 5) return;
    setCaregiverContacts(prev => [...prev, { name: '', phone: '', relationship: '' }]);
  };

  const handleRemoveCaregiver = (idx: number) => {
    setCaregiverContacts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCaregiverChange = (idx: number, field: keyof CaregiverContact, val: string) => {
    setCaregiverContacts(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      birthDate,
      age,
      address: {
        province,
        district,
        subdistrict,
        houseNo,
        alley,
        moo,
      },
      diseases: selectedDiseases,
      otherDisease,
      allergies,
      currentMedicationsText,
      notes,
      status,
      otherStatusText,
      caregiverContacts: caregiverContacts.filter(c => c.name.trim() !== ''),
    });
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 my-6 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <div className="border-b border-slate-200 pb-4 space-y-1">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          ลงทะเบียน: ผู้ป่วย / ผู้สูงอายุ
        </span>
        <h2 className="text-2xl font-bold text-slate-900 pt-1">กรอกข้อมูลผู้ป่วย / ผู้สูงอายุ</h2>
        <p className="text-xs text-slate-500">
          ข้อมูลนี้จะใช้เพื่อการบันทึกสุขภาพ สิทธิรักษา และประสานงานกับ อสม. ประจำชุมชน
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* Personal Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            ข้อมูลส่วนบุคคล
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อจริง</label>
              <input
                type="text"
                disabled
                value={initialData.firstName}
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">นามสกุล</label>
              <input
                type="text"
                disabled
                value={initialData.lastName}
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">วันเกิด</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={e => {
                  setBirthDate(e.target.value);
                  const bYear = new Date(e.target.value).getFullYear();
                  setAge(new Date().getFullYear() - bYear);
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">อายุ (ปี)</label>
              <input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            ที่อยู่ปัจจุบัน
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">จังหวัด</label>
              <input
                type="text"
                required
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">อำเภอ/เขต</label>
              <input
                type="text"
                required
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ตำบล/แขวง</label>
              <input
                type="text"
                required
                value={subdistrict}
                onChange={e => setSubdistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">บ้านเลขที่</label>
              <input
                type="text"
                required
                value={houseNo}
                onChange={e => setHouseNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ซอย</label>
              <input
                type="text"
                value={alley}
                onChange={e => setAlley(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">หมู่ที่</label>
              <input
                type="text"
                value={moo}
                onChange={e => setMoo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Chronic Diseases (10 Items + Other) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              โรคประจำตัว (เลือกได้หลายรายการ)
            </span>
            <span className="text-xs text-slate-500 font-normal">(หากไม่มี ไม่ต้องเลือก)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHRONIC_DISEASES.map(d => {
              const isChecked = selectedDiseases.includes(d);
              return (
                <label
                  key={d}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleDiseaseToggle(d)}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <span>{d}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">อื่นๆ (ระบุ)</label>
            <input
              type="text"
              value={otherDisease}
              onChange={e => setOtherDisease(e.target.value)}
              placeholder="ระบุโรคประจำตัวอื่นๆ เพิ่มเติม"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">สถานะผู้ป่วย / ผู้สูงอายุ</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PATIENT_STATUSES.map(st => (
              <label
                key={st}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  status === st
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="patientStatus"
                  checked={status === st}
                  onChange={() => setStatus(st)}
                  className="sr-only"
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ประวัติการแพ้ยา</label>
            <input
              type="text"
              value={allergies}
              onChange={e => setAllergies(e.target.value)}
              placeholder="เช่น แพ้ยาเพนิซิลลิน, แพ้ยาแอสไพริน (ถ้าไม่มีเว้นว่าง)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ยาที่ใช้ประจำ</label>
            <input
              type="text"
              value={currentMedicationsText}
              onChange={e => setCurrentMedicationsText(e.target.value)}
              placeholder="เช่น ยาลดความดัน 1 เม็ดเช้า, ยาลดน้ำตาล (ถ้าไม่มีเว้นว่าง)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="ข้อมูลเกี่ยวกับสภาพร่างกายหรือข้อควรระวังเพิ่มเติม"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
        </div>

        {/* Caregiver Contacts (Up to 5) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              ข้อมูลญาติ / ผู้ดูแล (สูงสุด 5 คน)
            </h3>
            {caregiverContacts.length < 5 && (
              <button
                type="button"
                onClick={handleAddCaregiver}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                เพิ่มญาติ
              </button>
            )}
          </div>

          {caregiverContacts.map((c, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>ญาติ / ผู้ติดต่อคนที่ {idx + 1}</span>
                {caregiverContacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCaregiver(idx)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  value={c.name}
                  onChange={e => handleCaregiverChange(idx, 'name', e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="เบอร์โทรศัพท์"
                  value={c.phone}
                  onChange={e => handleCaregiverChange(idx, 'phone', e.target.value.replace(/\D/g, ''))}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="ความสัมพันธ์ (เช่น ลูกชาย)"
                  value={c.relationship}
                  onChange={e => handleCaregiverChange(idx, 'relationship', e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-emerald-200 transition-all cursor-pointer"
        >
          บันทึกการลงทะเบียนและเข้าสู่แอป
        </button>
      </form>
    </div>
  );
};
