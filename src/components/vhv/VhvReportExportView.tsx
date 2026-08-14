import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Filter,
  Users,
  Activity,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Search
} from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';

export const VhvReportExportView: React.FC = () => {
  const { allPatients, vitalSignsRecords, symptomRecords, appointments, currentUser, showToast } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Group tagging logic
  const getPatientCategory = (patient: PatientProfile): 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง' => {
    if (patient.status === 'ติดเตียง') return 'ติดเตียง';
    if (patient.status === 'ต้องติดตามเป็นพิเศษ' || patient.status === 'มีผู้ดูแล') return 'ติดบ้าน';
    return 'ติดสังคม';
  };

  const filteredPatients = allPatients.filter(p => {
    if (selectedGroup === 'all') return true;
    return getPatientCategory(p) === selectedGroup;
  });

  // Calculate statistics
  const totalInCare = allPatients.length;
  const countSociety = allPatients.filter(p => getPatientCategory(p) === 'ติดสังคม').length;
  const countHomebound = allPatients.filter(p => getPatientCategory(p) === 'ติดบ้าน').length;
  const countBedridden = allPatients.filter(p => getPatientCategory(p) === 'ติดเตียง').length;

  // Records in selected month
  const monthRecords = vitalSignsRecords.filter(r => r.recordedAt.startsWith(selectedMonth));
  const highBpCount = monthRecords.filter(r => r.systolic >= 140 || r.diastolic >= 90).length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Build CSV content
      const headers = ['ลำดับ,ชื่อ-นามสกุล,อายุ,กลุ่มสุขภาพ,เบอร์โทร,ที่อยู่,โรคประจำตัว,ความดันล่าสุด(mmHg),ชีพจร,สถานะ'];
      const rows = filteredPatients.map((p, idx) => {
        const pRecords = vitalSignsRecords.filter(r => r.patientId === p.id);
        const lastRec = pRecords.length > 0 ? pRecords[pRecords.length - 1] : null;
        const bpStr = lastRec ? `${lastRec.systolic}/${lastRec.diastolic}` : 'ไม่ได้บันทึก';
        const pulseStr = lastRec?.pulse ? `${lastRec.pulse}` : '-';
        const cat = getPatientCategory(p);
        const diseases = p.diseases.join('; ');
        const addr = formatAddress(p.address).replace(/,/g, ' ');

        return `${idx + 1},${p.firstName} ${p.lastName},${p.age},${cat},${p.phone},"${addr}","${diseases}",${bpStr},${pulseStr},${p.status}`;
      });

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `รายงานตรวจสุขภาพผู้สูงอายุ_อสม_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      showToast('ดาวน์โหลดรายงานสรุป อสม. (CSV) สำเร็จ');
      setTimeout(() => setExportSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            ระบบส่งออกรายงานส่ง รพ.สต. / กองทุน สปสช.
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            รายงานสรุปผลการตรวจเยี่ยมสุขภาพ อสม.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            รวบรวมข้อมูลสัญญาณชีพ การคัดกรอง 15 อาการ และสถานะกลุ่มผู้สูงอายุในความดูแล เพื่อพิมพ์เป็นเอกสารหรือส่งออกไฟล์ Excel/CSV
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadCsv}
            disabled={isExporting}
            className="flex-1 md:flex-none px-4 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'กำลังสร้างไฟล์...' : 'ส่งออกไฟล์ Excel / CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/30 backdrop-blur-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน (Print)</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">ผู้สูงอายุในดูแลทั้งหมด</span>
            <strong className="text-lg font-bold text-slate-900">{totalInCare} คน</strong>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">กลุ่มติดสังคม</span>
            <strong className="text-lg font-bold text-emerald-800">{countSociety} คน</strong>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">กลุ่มติดบ้าน</span>
            <strong className="text-lg font-bold text-amber-800">{countHomebound} คน</strong>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">กลุ่มติดเตียง (เฝ้าระวัง)</span>
            <strong className="text-lg font-bold text-rose-800">{countBedridden} คน</strong>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-blue-700" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">กรองข้อมูลในรายงาน:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">รอบเดือน:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', 'ติดสังคม', 'ติดบ้าน', 'ติดเตียง'] as const).map(grp => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGroup === grp
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grp === 'all' ? 'ทั้งหมด' : grp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Report Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Report Official Header */}
        <div className="text-center space-y-1.5 border-b border-slate-200 pb-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            แบบสรุปการติดตามสุขภาพและสัญญาณชีพผู้สูงอายุในชุมชน
          </h3>
          <p className="text-xs text-slate-600">
            หน่วยบริการสาธารณสุข: รพ.สต.สุเทพ จ.เชียงใหม่ | ผู้รับผิดชอบ: {currentUser?.firstName || 'อสม.สมพร'} {currentUser?.lastName || 'แก้วมณี'} (อสม.ประจำหมู่ที่ 2)
          </p>
          <p className="text-xs text-slate-500">
            ประจำเดือน: {selectedMonth} | จำนวนผู้ได้รับการตรวจ: {filteredPatients.length} ราย
          </p>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-3 text-center w-12">ลำดับ</th>
                <th className="p-3">ชื่อ - นามสกุล</th>
                <th className="p-3 text-center">อายุ</th>
                <th className="p-3 text-center">กลุ่มสุขภาพ</th>
                <th className="p-3">โรคประจำตัว</th>
                <th className="p-3 text-center">ความดันโลหิต (mmHg)</th>
                <th className="p-3 text-center">ชีพจร</th>
                <th className="p-3">เบอร์ติดต่อ / ผู้ดูแล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient, index) => {
                const pRecords = vitalSignsRecords.filter(r => r.patientId === patient.id);
                const lastRec = pRecords.length > 0 ? pRecords[pRecords.length - 1] : null;
                const cat = getPatientCategory(patient);

                const isHigh = lastRec && (lastRec.systolic >= 140 || lastRec.diastolic >= 90);

                return (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {patient.firstName} {patient.lastName}
                      <span className="block text-[11px] font-normal text-slate-500">{patient.address?.houseNo ? `บ้านเลขที่ ${patient.address.houseNo}` : ''}</span>
                    </td>
                    <td className="p-3 text-center">{patient.age} ปี</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat === 'ติดเตียง'
                            ? 'bg-rose-100 text-rose-800'
                            : cat === 'ติดบ้าน'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cat}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">
                      {patient.diseases?.join(', ') || '-'}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {lastRec ? (
                        <span className={isHigh ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md' : 'text-slate-800'}>
                          {lastRec.systolic}/{lastRec.diastolic}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">ยังไม่ได้วัด</span>
                      )}
                    </td>
                    <td className="p-3 text-center text-slate-700">
                      {lastRec?.pulse ? `${lastRec.pulse} bpm` : '-'}
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{patient.phone}</div>
                      {patient.caregiverContacts?.[0] && (
                        <div className="text-[11px] text-slate-400">
                          {patient.caregiverContacts[0].name} ({patient.caregiverContacts[0].relationship})
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-200 flex justify-end">
          <div className="text-center space-y-4 w-64">
            <p className="text-xs text-slate-600">ลงชื่อ.......................................................</p>
            <p className="text-xs font-bold text-slate-800">
              ({currentUser?.firstName || 'อสม.สมพร'} {currentUser?.lastName || 'แก้วมณี'})
            </p>
            <p className="text-[11px] text-slate-500">อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
