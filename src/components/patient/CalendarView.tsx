import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckSquare,
  Square,
  Clock,
  UserCheck,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { AppointmentStatus, VhvPermissionState } from '../../types';
import { Lock } from 'lucide-react';

interface CalendarViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ patientId, readOnly, permission }) => {
  const {
    currentPatientProfile,
    announcements,
    todos,
    toggleTodo,
    addTodo,
    appointments,
    createAppointmentRequest,
    allVhvs
  } = useApp();

  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);

  const pName = currentPatientProfile?.firstName
    ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}`
    : 'คุณสมศรี ใจดี';
  const pPhone = currentPatientProfile?.phone || '0812345678';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [showAppModal, setShowAppModal] = useState(false);
  const [appTime, setAppTime] = useState('09:30');
  const [appSymptoms, setAppSymptoms] = useState('');
  const [appCause, setAppCause] = useState('');
  const [appNotes, setAppNotes] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNamesTH = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(pId, newTodoTitle.trim(), selectedDay);
      setNewTodoTitle('');
      setShowAddTodo(false);
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultVhv = allVhvs[0]?.id || 'vhv-1';
    createAppointmentRequest({
      patientId: pId,
      patientName: pName,
      patientPhone: pPhone,
      vhvId: defaultVhv,
      date: selectedDay,
      time: appTime,
      symptoms: appSymptoms,
      cause: appCause,
      notes: appNotes,
    });
    setShowAppModal(false);
    setAppSymptoms('');
    setAppCause('');
    setAppNotes('');
  };

  // Check if day has VHV announcements
  const dayHasAnnouncement = (dayNum: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return announcements.some(a => a.date === formattedDate);
  };

  // Filter day todos & appointments
  const selectedDayTodos = todos.filter(t => t.patientId === pId && t.date === selectedDay);
  const patientAppointments = appointments.filter(a => a.patientId === pId);

  const getStatusBadge = (st: AppointmentStatus) => {
    switch (st) {
      case 'อนุมัติแล้ว':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            อสม. อนุมัติแล้ว
          </span>
        );
      case 'ปฏิเสธ':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            คำขอถูกปฏิเสธ
          </span>
        );
      case 'เสนอเวลาใหม่':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            เสนอเวลาใหม่
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full flex items-center gap-1 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5" />
            รออนุมัติจาก อสม.
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            ปฏิทินชุมชน และ นัดหมาย
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามกิจกรรม ประกาศจาก อสม. และนัดหมายตรวจติดตามอาการ
          </p>
        </div>

        <button
          onClick={() => {
            if (isDenied) {
              setShowPermissionWarning(true);
            } else {
              setShowAppModal(true);
            }
          }}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          สร้างคำขอนัดหมาย อสม.
        </button>
      </div>

      {isDenied && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-medium">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-900 block mb-0.5">ดูข้อมูลได้อย่างเดียว (Read-Only)</strong>
            คุณสามารถดูข้อมูลได้ แต่ไม่สามารถแก้ไขข้อมูลนี้ เนื่องจากเจ้าของข้อมูลยังไม่ได้อนุญาต
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Widget (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          {/* Calendar Month Selector */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              {monthNamesTH[month]} {year + 543}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 py-2 border-b border-slate-100">
            <span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDay === formattedDate;
              const hasAnn = dayHasAnnouncement(dayNum);

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(formattedDate)}
                  className={`p-2.5 rounded-2xl text-xs font-bold relative transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[44px] ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-200 scale-105'
                      : 'hover:bg-teal-50 text-slate-800'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasAnn && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-rose-500'
                      }`}
                      title="มีประกาศ อสม."
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details & Todo Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  รายการประจำวันที่ {new Date(selectedDay).toLocaleDateString('th-TH')}
                </h3>
                <p className="text-[11px] text-slate-500">กิจกรรม และ ประกาศในวันดังกล่าว</p>
              </div>

              <button
                onClick={() => setShowAddTodo(!showAddTodo)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + เพิ่มรายการ
              </button>
            </div>

            {/* Add Todo Form */}
            {showAddTodo && (
              <form onSubmit={handleAddTodoSubmit} className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2">
                <input
                  type="text"
                  required
                  placeholder="ระบุกิจกรรม เช่น วัดความดันช่วงเช้า"
                  value={newTodoTitle}
                  onChange={e => setNewTodoTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-xl text-xs font-medium"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  บันทึกกิจกรรม
                </button>
              </form>
            )}

            {/* Todo List */}
            <div className="space-y-2">
              {selectedDayTodos.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">
                  ไม่มีกิจกรรมที่คุณบันทึกไว้ในวันนี้
                </p>
              ) : (
                selectedDayTodos.map(todo => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {todo.completed ? (
                      <CheckSquare className="w-5 h-5 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium flex-1 ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Requests List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-900">ประวัติคำขอนัดหมายถึง อสม.</h3>

        {patientAppointments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ยังไม่มีคำขอนัดหมาย สามารถกดปุ่ม "+ สร้างคำขอนัดหมาย อสม." ด้านบนได้ครับ
          </div>
        ) : (
          <div className="space-y-3">
            {patientAppointments.map(app => (
              <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs text-slate-900">
                      วันที่ {app.date} เวลา {app.time} น.
                    </span>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-800">อาการ:</span> {app.symptoms}</p>
                  <p><span className="font-semibold text-slate-800">สาเหตุ/วัตถุประสงค์:</span> {app.cause}</p>
                  {app.proposedTime && (
                    <p className="text-amber-800 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2">
                      💡 อสม. เสนอเวลาใหม่เป็น: {app.proposedTime}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Creation Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              สร้างคำขอนัดหมายถึง อสม.
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">วันที่ต้องการนัดหมาย</label>
                <input
                  type="date"
                  required
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เวลา</label>
                <input
                  type="time"
                  required
                  value={appTime}
                  onChange={e => setAppTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">อาการสำคัญ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เวียนศีรษะ วัดความดันสูง"
                  value={appSymptoms}
                  onChange={e => setAppSymptoms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">สาเหตุ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ต้องการตรวจเจาะเลือดปลายนิ้ว หรือเยี่ยมบ้าน"
                  value={appCause}
                  onChange={e => setAppCause(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">หมายเหตุ</label>
                <textarea
                  rows={2}
                  placeholder="สถานที่หรือรายละเอียดเพิ่มเติม"
                  value={appNotes}
                  onChange={e => setAppNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  ส่งคำขอนัดหมาย
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
