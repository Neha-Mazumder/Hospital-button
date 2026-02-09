import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const [user, setUser] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [additionalMsg, setAdditionalMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/user/${user.user_id}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDept || !appointmentDate) {
      setError("Please select department and date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          department_id: parseInt(selectedDept),
          appointment_date: appointmentDate,
          additional_message: additionalMsg,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess("Appointment booked successfully!");
      setAppointmentDate("");
      setSelectedDept("");
      setAdditionalMsg("");
      fetchAppointments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/cancel/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to cancel");

      fetchAppointments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Appointment Booking</h1>
          <p className="text-gray-600">Welcome, {user.full_name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">New Appointment</h2>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  disabled={loading}
                  className="w-full border rounded-md px-4 py-2 outline-none"
                >
                  <option value="">--Select--</option>
                  {departments.map((dept: any) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  disabled={loading}
                  className="w-full border rounded-md px-4 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <textarea
                  value={additionalMsg}
                  onChange={(e) => setAdditionalMsg(e.target.value)}
                  disabled={loading}
                  placeholder="Enter additional information"
                  className="w-full border rounded-md px-4 py-2 outline-none h-20"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-2 font-medium text-white hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>

          {/* My Appointments */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">My Appointments</h2>

            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.map((apt: any) => (
                  <div key={apt.appointment_id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-primary">{apt.department_name}</h3>
                        <p className="text-sm text-gray-600">{apt.appointment_date}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        apt.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        apt.status === "Cancelled" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {apt.status === "Pending" ? "Pending" : apt.status === "Cancelled" ? "Cancelled" : "Completed"}
                      </span>
                    </div>

                    {apt.additional_message && (
                      <p className="text-sm text-gray-600 mb-3">{apt.additional_message}</p>
                    )}

                    {apt.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(apt.appointment_id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
