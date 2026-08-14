import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, User, KeyRound, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginRegisterFormProps {
  mode?: 'login' | 'register';
  onBack: () => void;
  onProceedToRoleSelection?: (userData: { firstName: string; lastName: string; phone: string }) => void;
}

export const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({
  mode = 'login',
  onBack,
  onProceedToRoleSelection,
}) => {
  const { loginByPhone, showToast } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']); // Auto prefill 123456 for effortless user testing
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์มือถือให้ครบ 10 หลัก');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('กรุณากรอกชื่อและนามสกุลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      showToast('รหัส OTP ทดสอบถูกส่งแล้ว (รหัสทดสอบ: 123456)');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check if user account already exists by phone
      const result = loginByPhone(phone, firstName, lastName);
      if (result.isNew) {
        // Proceed to Role Selection
        onProceedToRoleSelection?.({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.replace(/\D/g, ''),
        });
      }
    }, 600);
  };

  const handleResendOtp = () => {
    showToast('ขอรหัส OTP ใหม่เรียบร้อยแล้ว (รหัสคือ 123456)');
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 my-6">
      <button
        onClick={step === 'otp' ? () => setStep('info') : onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <div className="text-center mb-6 space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">
          {mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียนใหม่'}
        </h2>
        <p className="text-xs text-slate-500">
          {step === 'info' ? 'กรอกข้อมูลส่วนตัวเพื่อเข้าใช้งานระบบ' : 'ยืนยันตัวตนด้วยรหัส OTP'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 'info' ? (
        <form onSubmit={handleNextStep} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="เช่น สมศรี"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="เช่น ใจดี"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เบอร์โทรศัพท์ (10 หลัก) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                maxLength={10}
                required
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="0812345678"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-base shadow-md shadow-teal-200 transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'ต่อไป'
            )}
          </button>
        </form>
      ) : (
        /* OTP Step (Requirement #4) */
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center bg-teal-50 p-4 rounded-2xl border border-teal-100 space-y-1">
            <KeyRound className="w-8 h-8 text-teal-600 mx-auto" />
            <p className="text-xs text-teal-900 font-medium">
              กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์ของคุณ
            </p>
            <p className="text-sm font-bold text-teal-800">{phone}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 text-center mb-2">
              รหัส OTP (6 หลัก)
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                  }}
                  className="w-11 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-600 focus:bg-white outline-none"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-base shadow-md shadow-teal-200 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'ยืนยันตัวตน'
            )}
          </button>

          {/* Action Links Below OTP */}
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => setStep('info')}
              className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              แก้ไขข้อมูล
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-teal-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ขอรหัสใหม่
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
