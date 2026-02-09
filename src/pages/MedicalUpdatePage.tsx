import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Pill, 
  User, 
  Lock, 
  Heart, 
  Activity, 
  Thermometer,
  Droplets,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bell,
  TrendingUp,
  LogOut,
  RefreshCw,
  UserCheck,
  Bed
} from 'lucide-react';

// Types
interface Patient {
  patient_id: string;
  full_name: string;
  age: number;
  gender: string;
  blood_group: string;
  phone: string;
  email: string;
  address: string;
  emergency_contact: string;
  admission_date: string;
  discharge_date: string | null;
  current_status: string;
  assigned_doctor: string;
  department: string;
  room_number: string;
  bed_number: string;
}

interface StatusUpdate {
  update_id: number;
  status_type: string;
  title: string;
  description: string;
  updated_by: string;
  updated_at: string;
  is_important: boolean;
}

interface DoctorVisit {
  visit_id: number;
  doctor_name: string;
  doctor_specialization: string;
  visit_date: string;
  visit_time: string;
  visit_type: string;
  status: string;
  notes: string;
}

interface Medicine {
  medicine_id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
  prescribed_by: string;
  next_dose_time: string;
  is_active: boolean;
}

interface Vital {
  vital_id: number;
  blood_pressure: string;
  heart_rate: number;
  temperature: number;
  oxygen_level: number;
  weight: number;
  blood_sugar: number;
  respiratory_rate: number;
  recorded_at: string;
  recorded_by: string;
  notes: string;
}

interface Diagnosis {
  diagnosis_id: number;
  diagnosis: string;
  diagnosis_details: string;
  severity: string;
  symptoms: string;
  treatment_plan: string;
  diagnosed_by: string;
  diagnosis_date: string;
  follow_up_date: string;
  is_primary: boolean;
}

const MedicalUpdatePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('updates');
  
  // Data states
  const [patient, setPatient] = useState<Patient | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<DoctorVisit[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const fetchDashboardData = async (pid: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patientcare/dashboard/${pid}`);
      const data = await response.json();
      
      if (data.success) {
        setPatient(data.data.patient);
        setStatusUpdates(data.data.statusUpdates);
        setDoctorVisits(data.data.doctorVisits);
        setMedicines(data.data.medicines);
        setVitals(data.data.vitals);
        setDiagnoses(data.data.diagnoses);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Fetch error:', err);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!patientId.trim()) {
      setError('Patient ID প্রদান করুন');
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await fetch('http://localhost:5000/api/patientcare/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patientId.trim() }),
      });

      const loginData = await loginResponse.json();

      if (!loginData.success) {
        setError(loginData.message || 'লগইন ব্যর্থ');
        setLoading(false);
        return;
      }

      const success = await fetchDashboardData(patientId.trim());
      if (success) {
        setIsLoggedIn(true);
      } else {
        setError('তথ্য লোড করতে ব্যর্থ');
      }
    } catch (err) {
      setError('সার্ভারের সাথে সংযোগ ব্যর্থ। Backend চালু আছে কি?');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!patient) return;
    setRefreshing(true);
    await fetchDashboardData(patient.patient_id);
    setRefreshing(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPatient(null);
    setStatusUpdates([]);
    setDoctorVisits([]);
    setMedicines([]);
    setVitals([]);
    setDiagnoses([]);
    setPatientId('');
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Admitted': 'bg-blue-100 text-blue-800',
      'Under Treatment': 'bg-yellow-100 text-yellow-800',
      'Critical': 'bg-red-100 text-red-800',
      'Stable': 'bg-green-100 text-green-800',
      'Recovering': 'bg-emerald-100 text-emerald-800',
      'Discharged': 'bg-gray-100 text-gray-800',
      'In Surgery': 'bg-purple-100 text-purple-800',
      'Observation': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUpdateIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'Health Update': <Heart className="h-5 w-5 text-red-500" />,
      'Doctor Visit': <UserCheck className="h-5 w-5 text-blue-500" />,
      'Treatment': <Activity className="h-5 w-5 text-purple-500" />,
      'Medicine': <Pill className="h-5 w-5 text-green-500" />,
      'Test': <FileText className="h-5 w-5 text-orange-500" />,
      'Surgery': <Stethoscope className="h-5 w-5 text-red-600" />,
      'Emergency': <AlertTriangle className="h-5 w-5 text-red-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('bn-BD', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const latestVital = vitals.length > 0 ? vitals[0] : null;

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Stethoscope className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Patient Care Portal</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              আপনার Patient ID দিয়ে লগইন করুন এবং Real-Time মেডিকেল আপডেট, 
              ডাক্তারের ভিজিট, ওষুধের তথ্য দেখুন
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold">Patient Login</h3>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="যেমন: PAT-2026-001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw className="h-5 w-5 animate-spin" /> লোড হচ্ছে...</>
                  ) : (
                    <><User className="h-5 w-5" /> লগইন করুন</>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-800 mb-2">🔍 ডেমো Patient IDs:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">PAT-2026-001</code> - রহিম উদ্দিন</li>
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">PAT-2026-002</code> - ফাতেমা বেগম</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{patient?.full_name}</h1>
                <p className="text-white/80 text-sm">
                  {patient?.patient_id} | Room: {patient?.room_number}-{patient?.bed_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(patient?.current_status || '')}`}>
                {patient?.current_status}
              </span>
              <button onClick={handleRefresh} disabled={refreshing}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <LogOut className="h-4 w-4" /> লগআউট
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Heart Rate</p>
                <p className="text-lg font-bold">{latestVital?.heart_rate || '--'} bpm</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Blood Pressure</p>
                <p className="text-lg font-bold">{latestVital?.blood_pressure || '--'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Droplets className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Oxygen</p>
                <p className="text-lg font-bold">{latestVital?.oxygen_level || '--'}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-lg font-bold">{latestVital?.temperature || '--'}°F</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Doctor</p>
                <p className="text-sm font-bold truncate">{patient?.assigned_doctor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
              <Bed className="h-8 w-8 text-cyan-500" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-bold">{patient?.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'updates', label: 'আপডেট', icon: Bell },
              { id: 'visits', label: 'ডাক্তার ভিজিট', icon: UserCheck },
              { id: 'medicines', label: 'ওষুধ', icon: Pill },
              { id: 'vitals', label: 'স্বাস্থ্য', icon: Activity },
              { id: 'diagnoses', label: 'রোগ নির্ণয়', icon: Stethoscope },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Real-Time আপডেট</h2>
            {statusUpdates.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো আপডেট নেই</p>
              </div>
            ) : (
              <div className="space-y-3">
                {statusUpdates.map((update) => (
                  <div key={update.update_id}
                    className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                      update.is_important ? 'border-l-red-500' : 'border-l-blue-500'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getUpdateIcon(update.status_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                            {update.status_type}
                          </span>
                          {update.is_important && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">গুরুত্বপূর্ণ</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-800">{update.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{update.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {update.updated_by} • {formatDateTime(update.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doctor Visits Tab */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">ডাক্তার ভিজিট শিডিউল</h2>
            {doctorVisits.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো ভিজিট শিডিউল নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {doctorVisits.map((visit) => (
                  <div key={visit.visit_id} className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        visit.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        visit.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{visit.status}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {visit.visit_type}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">{visit.doctor_name}</h4>
                    <p className="text-sm text-gray-500">{visit.doctor_specialization}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-4 w-4" /> {formatDate(visit.visit_date)}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" /> {formatTime(visit.visit_time)}
                      </span>
                    </div>
                    {visit.notes && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">{visit.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">ওষুধের তালিকা</h2>
            {medicines.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Pill className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো ওষুধ নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {medicines.map((med) => (
                  <div key={med.medicine_id}
                    className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                      med.is_active ? 'border-green-200' : 'border-gray-200 opacity-60'
                    }`}>
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      med.is_active ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Pill className={`h-5 w-5 ${med.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="font-bold">{med.medicine_name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        med.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}>{med.is_active ? 'সক্রিয়' : 'সম্পন্ন'}</span>
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-gray-500">ডোজ:</span> <span className="font-medium">{med.dosage}</span></div>
                        <div><span className="text-gray-500">সময়:</span> <span className="font-medium">{med.frequency}</span></div>
                      </div>
                      <div><span className="text-gray-500">কখন:</span> <span className="font-medium">{med.timing}</span></div>
                      {med.instructions && (
                        <div className="bg-yellow-50 p-2 rounded text-yellow-800">
                          <strong>নির্দেশনা:</strong> {med.instructions}
                        </div>
                      )}
                      {med.next_dose_time && med.is_active && (
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <Clock className="h-4 w-4" />
                          পরবর্তী ডোজ: {formatDateTime(med.next_dose_time)}
                        </div>
                      )}
                      <p className="text-xs text-gray-400">প্রেসক্রাইব: {med.prescribed_by}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">স্বাস্থ্য অবস্থা (Vitals History)</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">তারিখ</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">BP</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Heart</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Temp</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">O2</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Sugar</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {vitals.map((v) => (
                      <tr key={v.vital_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{formatDateTime(v.recorded_at)}</td>
                        <td className="px-4 py-3 text-center font-medium">{v.blood_pressure}</td>
                        <td className="px-4 py-3 text-center">{v.heart_rate} bpm</td>
                        <td className="px-4 py-3 text-center">{v.temperature}°F</td>
                        <td className="px-4 py-3 text-center">{v.oxygen_level}%</td>
                        <td className="px-4 py-3 text-center">{v.blood_sugar}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{v.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Diagnoses Tab */}
        {activeTab === 'diagnoses' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">রোগ নির্ণয় / Diagnoses</h2>
            {diagnoses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো রোগ নির্ণয় নেই</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diagnoses.map((d) => (
                  <div key={d.diagnosis_id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className={`px-5 py-4 border-b flex items-center justify-between ${
                      d.severity === 'Critical' ? 'bg-red-50' :
                      d.severity === 'Severe' ? 'bg-orange-50' :
                      d.severity === 'Moderate' ? 'bg-yellow-50' : 'bg-green-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        {d.is_primary && <span className="bg-primary text-white text-xs px-2 py-1 rounded">Primary</span>}
                        <h4 className="font-bold text-lg">{d.diagnosis}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        d.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        d.severity === 'Severe' ? 'bg-orange-100 text-orange-700' :
                        d.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{d.severity}</span>
                    </div>
                    <div className="p-5 space-y-3">
                      {d.diagnosis_details && <div><strong>বিস্তারিত:</strong> {d.diagnosis_details}</div>}
                      {d.symptoms && <div><strong>লক্ষণ:</strong> {d.symptoms}</div>}
                      {d.treatment_plan && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <strong className="text-blue-700">চিকিৎসা পরিকল্পনা:</strong>
                          <p className="text-blue-800 mt-1">{d.treatment_plan}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>নির্ণয়ের তারিখ: {formatDate(d.diagnosis_date)}</span>
                        {d.follow_up_date && <span>Follow-up: {formatDate(d.follow_up_date)}</span>}
                        <span>ডাক্তার: {d.diagnosed_by}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalUpdatePage; 