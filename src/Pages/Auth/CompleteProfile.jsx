import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Loader from "../../Components/Loader/Loader";

const CompleteProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({ bloodGroup: "", selectedDistrict: "", selectedUpazila: "" });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (user === null) return;
    // when user available, proceed
  }, [user]);

  // Load districts
  useEffect(() => {
    fetch("/distric.json")
      .then((r) => r.json())
      .then((data) => setDistricts(data))
      .catch(() => {
        Swal.fire({ icon: "error", title: "Failed to load districts" });
      });
  }, []);

  // Check if user already exists; if yes, redirect away
  useEffect(() => {
    const run = async () => {
      if (!user?.email) {
        setChecking(false);
        return;
      }
      try {
        const res = await axios.get(`https://blood-sync-server-side.vercel.app/users/${user.email}`);
        if (res?.data && res.data.email) {
          // Already completed/exists; go home
          navigate(location?.state?.from || "/", { replace: true });
        }
      } catch (_) {
        // Not found -> stay here
      } finally {
        setChecking(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const upazilas = useMemo(() => {
    const d = districts.find((x) => x.id === form.selectedDistrict);
    return d ? d.upazilas : [];
  }, [districts, form.selectedDistrict]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;
    setLoading(true);
    try {
      const districtObj = districts.find((d) => d.id === form.selectedDistrict);
      const districtName = districtObj ? districtObj.name.charAt(0).toUpperCase() + districtObj.name.slice(1) : form.selectedDistrict;

      const payload = {
        name: user.displayName || "",
        email: user.email.toLowerCase(),
        photoURL: user.photoURL || "",
        bloodGroup: form.bloodGroup,
        district: districtName,
        upazila: form.selectedUpazila,
        status: "active",
        role: "donor",
        createdAt: new Date().toISOString(),
      };

      await axios.post("https://blood-sync-server-side.vercel.app/users", payload);

      Swal.fire({ icon: "success", title: "Profile completed" }).then(() => {
        navigate(location?.state?.from || "/", { replace: true });
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to complete profile", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader size="md" /></div>;

  return (
    <div className="min-h-screen pt-20 p-6 flex items-center justify-center">
      <div className="card max-w-xl w-full p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-1">Complete your profile</h2>
        <p className="text-center text-[var(--color-muted)] mb-6">We need a few more details to finish setting up your account.</p>

        <div className="mb-4 flex items-center gap-3">
          <img src={user?.photoURL} alt={user?.displayName} className="w-12 h-12 rounded-full object-cover border-token" />
          <div>
            <div className="font-medium">{user?.displayName}</div>
            <div className="text-sm text-[var(--color-muted)]">{user?.email}</div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1,2,3].map((s) => (
            <div key={s} className={`h-2 w-8 rounded-full ${step>=s? 'bg-[var(--color-primary)]':'bg-[var(--color-border)]'}`} />
          ))}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-muted)]">Blood Group</label>
              <select
                name="bloodGroup"
                className="input-style bg-[var(--color-surface)]"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-muted)]">District</label>
              <select
                name="selectedDistrict"
                className="input-style bg-[var(--color-surface)]"
                value={form.selectedDistrict}
                onChange={(e) => setForm({ ...form, selectedDistrict: e.target.value, selectedUpazila: "" })}
                required
              >
                <option value="" disabled>
                  Select District
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-muted)]">Upazila</label>
              <select
                name="selectedUpazila"
                className="input-style bg-[var(--color-surface)]"
                value={form.selectedUpazila}
                onChange={(e) => setForm({ ...form, selectedUpazila: e.target.value })}
                required
                disabled={!form.selectedDistrict}
              >
                <option value="" disabled>
                  Select Upazila
                </option>
                {upazilas.map((u, i) => (
                  <option key={i} value={u}>{u}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" className="btn-outline flex-1 p-3 rounded-xl" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                className="btn-primary flex-1 p-3 rounded-xl"
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 1 && !form.bloodGroup) || (step === 2 && !form.selectedDistrict)}
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="btn-primary flex-1 p-3 rounded-xl" disabled={loading || !form.selectedUpazila}>
                {loading ? "Saving..." : "Save and continue"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
