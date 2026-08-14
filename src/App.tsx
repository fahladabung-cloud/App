import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';

// Auth Components
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { RoleSelection } from './components/auth/RoleSelection';
import { LoginRegisterForm } from './components/auth/LoginRegisterForm';
import { PatientRegisterForm } from './components/auth/PatientRegisterForm';
import { CaregiverRegisterForm } from './components/auth/CaregiverRegisterForm';
import { VhvRegisterForm } from './components/auth/VhvRegisterForm';
import { DeviceSelectionModal } from './components/auth/DeviceSelectionModal';
import { LocationPermissionModal } from './components/auth/LocationPermissionModal';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { VitalSignsView } from './components/patient/VitalSignsView';
import { SymptomsView } from './components/patient/SymptomsView';
import { MedicationsView } from './components/patient/MedicationsView';
import { NhsoView } from './components/patient/NhsoView';
import { CalendarView } from './components/patient/CalendarView';
import { NearbyHospitalsView } from './components/patient/NearbyHospitalsView';

// Caregiver Components
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';

// VHV Components
import { VhvDashboard } from './components/vhv/VhvDashboard';
import { VhvQueuePageView } from './components/vhv/VhvQueuePageView';
import { VhvElderlyPageView } from './components/vhv/VhvElderlyPageView';
import { VhvAnnouncementsPageView } from './components/vhv/VhvAnnouncementsPageView';
import { VhvGisMapView } from './components/vhv/VhvGisMapView';
import { VhvReportExportView } from './components/vhv/VhvReportExportView';

// Common Views
import { AnnouncementsView } from './components/common/AnnouncementsView';
import { ProfileView } from './components/common/ProfileView';

import { Role } from './types';

function AppContent() {
  const {
    currentUser,
    hasChosenDevice,
    markDeviceChosen,
    activeTab,
    locationPermission,
    setLocationPermission,
    registerNewAccount,
    patientHealthSubTab,
    setPatientHealthSubTab,
  } = useApp();

  // Auth Flow States
  const [authStep, setAuthStep] = useState<'device' | 'welcome' | 'role_select' | 'login' | 'register_form'>('welcome');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [registeredUserData, setRegisteredUserData] = useState<{ firstName: string; lastName: string; phone: string }>({
    firstName: 'สมศรี',
    lastName: 'ใจดี',
    phone: '0812345678',
  });

  const handleRegisterSubmit = (profileData: any) => {
    if (!selectedRole) return;
    registerNewAccount(
      {
        phone: registeredUserData.phone,
        firstName: registeredUserData.firstName,
        lastName: registeredUserData.lastName,
        role: selectedRole,
      },
      profileData
    );
  };

  // Determine actual active step: force 'device' selection if not chosen yet
  const activeAuthStep = !hasChosenDevice ? 'device' : authStep;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        {activeAuthStep === 'device' && (
          <DeviceSelectionModal
            onConfirm={() => {
              markDeviceChosen();
              setAuthStep('welcome');
            }}
          />
        )}

        {activeAuthStep === 'welcome' && (
          <WelcomeScreen
            onLoginClick={() => setAuthStep('login')}
            onRegisterClick={() => setAuthStep('role_select')}
          />
        )}

        {activeAuthStep === 'role_select' && (
          <RoleSelection
            selectedRole={selectedRole}
            onSelectRole={role => setSelectedRole(role)}
            onBack={() => setAuthStep('welcome')}
            onNext={() => setAuthStep('register_form')}
          />
        )}

        {activeAuthStep === 'login' && (
          <LoginRegisterForm
            onBack={() => setAuthStep('welcome')}
            onProceedToRoleSelection={(userData) => {
              if (userData) {
                setRegisteredUserData(userData);
              }
              setAuthStep('role_select');
            }}
          />
        )}

        {activeAuthStep === 'register_form' && selectedRole === 'PATIENT' && (
          <PatientRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {activeAuthStep === 'register_form' && selectedRole === 'CAREGIVER' && (
          <CaregiverRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {activeAuthStep === 'register_form' && selectedRole === 'VHV' && (
          <VhvRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}
      </div>
    );
  }

  // Location permission prompt banner modal
  const showLocationModal = locationPermission === 'prompt';

  return (
    <>
      {showLocationModal && (
        <LocationPermissionModal
          onAllow={() => setLocationPermission('granted')}
          onAllowOnce={() => setLocationPermission('granted_once')}
          onDeny={() => setLocationPermission('denied')}
        />
      )}

      {/* Post-login device choice modal if not confirmed yet */}
      {!hasChosenDevice && (
        <DeviceSelectionModal
          isModal
          onConfirm={markDeviceChosen}
        />
      )}

      <Header />

      <DeviceFrameWrapper>
        {/* PATIENT VIEWS */}
        {currentUser.role === 'PATIENT' && (
          <>
            {activeTab === 'dashboard' && <PatientDashboard />}

            {activeTab === 'health' && (
              <div className="space-y-6">
                {/* Health Sub-tab Bar */}
                <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex flex-wrap gap-2">
                  <button
                    onClick={() => setPatientHealthSubTab('vitals')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      patientHealthSubTab === 'vitals'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    บันทึกสัญญาณชีพ
                  </button>
                  <button
                    onClick={() => setPatientHealthSubTab('symptoms')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      patientHealthSubTab === 'symptoms'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    บันทึกอาการ
                  </button>
                  <button
                    onClick={() => setPatientHealthSubTab('meds')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      patientHealthSubTab === 'meds'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ยาที่ใช้ประจำ
                  </button>
                  <button
                    onClick={() => setPatientHealthSubTab('nhso')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      patientHealthSubTab === 'nhso'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    สิทธิ สปสช.
                  </button>
                  <button
                    onClick={() => setPatientHealthSubTab('calendar')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      patientHealthSubTab === 'calendar'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ปฏิทินชุมชน
                  </button>
                </div>

                {patientHealthSubTab === 'vitals' && <VitalSignsView />}
                {patientHealthSubTab === 'symptoms' && <SymptomsView />}
                {patientHealthSubTab === 'meds' && <MedicationsView />}
                {patientHealthSubTab === 'nhso' && <NhsoView />}
                {patientHealthSubTab === 'calendar' && <CalendarView />}
              </div>
            )}

            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'hospitals' && <NearbyHospitalsView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}

        {/* CAREGIVER VIEWS */}
        {currentUser.role === 'CAREGIVER' && (
          <>
            {(activeTab === 'dashboard' || activeTab === 'patients') && <CaregiverDashboard />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'hospitals' && <NearbyHospitalsView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}

        {/* VHV VIEWS */}
        {currentUser.role === 'VHV' && (
          <>
            {activeTab === 'dashboard' && <VhvDashboard />}
            {activeTab === 'queue' && <VhvQueuePageView />}
            {activeTab === 'elderly' && <VhvElderlyPageView />}
            {activeTab === 'gis_map' && <VhvGisMapView />}
            {activeTab === 'reports' && <VhvReportExportView />}
            {activeTab === 'announcements' && <VhvAnnouncementsPageView />}
            {activeTab === 'hospitals' && <NearbyHospitalsView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </DeviceFrameWrapper>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
