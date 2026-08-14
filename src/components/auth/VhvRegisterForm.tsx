import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Camera, Upload, CheckCircle2, Building2, ShieldCheck } from 'lucide-react';

interface VhvRegisterFormProps {
  initialData?: { firstName: string; lastName: string; phone: string };
  onBack: () => void;
  onSubmit?: (data: any) => void;
}

export const VhvRegisterForm: React.FC<VhvRegisterFormProps> = ({
  initialData = { firstName: 'นภา', lastName: 'รักชุมชน', phone: '0855551234' },
  onBack,
  onSubmit,
}) => {
  const [province, setProvince] = useState('เชียงใหม่');
  const [district, setDistrict] = useState('เมืองเชียงใหม่');
  const [subdistrict, setSubdistrict] = useState('สุเทพ');
  const [houseNo, setHouseNo] = useState('45/2');

  const [organization, setOrganization] = useState('โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) สุเทพ');
  const [vhvCode, setVhvCode] = useState('VHV-CM-5001');

  const [idCardPhotoUrl, setIdCardPhotoUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80'
  );
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleSimulatePhoto = (type: 'camera' | 'file') => {
    // Simulated ID card photo upload/capture
    setIdCardPhotoUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80');
    setShowPhotoModal(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      province,
      district,
      subdistrict,
      houseNo,
      organization,
      vhvCode,
      idCardPhotoUrl: idCardPhotoUrl || '',
      assignedElderlyIds: ['patient-1', 'patient-2'],
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
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
          ลงทะเบียน: อสม. (อาสาสมัครสาธารณสุข)
        </span>
        <h2 className="text-2xl font-bold text-slate-900 pt-1">ข้อมูลบุคลากร อสม.</h2>
        <p className="text-xs text-slate-500">
          ลงทะเบียนเพื่อดูแลผู้สูงอายุ รับคำขอนัดหมาย และออกประกาศสุขภาพชุมชน
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* Personal Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            ข้อมูล อสม.
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
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            พื้นที่ปฏิบัติงาน / ที่อยู่
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">จังหวัด</label>
              <input
                type="text"
                required
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">อำเภอ</label>
              <input
                type="text"
                required
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ตำบล</label>
              <input
                type="text"
                required
                value={subdistrict}
                onChange={e => setSubdistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">บ้านเลขที่</label>
              <input
                type="text"
                required
                value={houseNo}
                onChange={e => setHouseNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Organization Info */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            ข้อมูลสังกัด อสม.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">หน่วยงาน / สังกัด</label>
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="เช่น รพ.สต.สุเทพ"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">รหัสประจำตัว อสม.</label>
              <input
                type="text"
                required
                value={vhvCode}
                onChange={e => setVhvCode(e.target.value)}
                placeholder="เช่น VHV-CM-5001"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Security & ID Card Photo Upload (Requirement #8) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            ข้อมูลเพื่อความปลอดภัย (รูปบัตรประชาชนด้านหน้า)
          </h3>

          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-28 h-20 bg-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-300 relative">
              {idCardPhotoUrl ? (
                <img src={idCardPhotoUrl} alt="ID Card Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-slate-500 text-center px-1">ยังไม่มีรูป</span>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <p className="text-xs text-slate-600">
                แนบรูปภาพบัตรประชาชนด้านหน้าเพื่อยืนยันตัวตนเจ้าหน้าที่ อสม.
              </p>
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto sm:mx-0 cursor-pointer shadow-xs"
              >
                <Camera className="w-4 h-4" />
                แนบรูปบัตรประชาชน
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-purple-200 transition-all cursor-pointer"
        >
          ยืนยันการลงทะเบียน อสม.
        </button>
      </form>

      {/* ID Card Attachment Modal (Requirement #8: "ถ่ายรูป" & "แนบรูปจากอุปกรณ์") */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
            <h3 className="text-lg font-bold text-slate-900">แนบรูปภาพบัตรประชาชน</h3>
            <p className="text-xs text-slate-500">เลือกช่องทางการแนบรูปภาพ</p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSimulatePhoto('camera')}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Camera className="w-5 h-5" />
                ถ่ายรูป (กล้อง)
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePhoto('file')}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                แนบรูปจากอุปกรณ์
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPhotoModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer pt-2"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
