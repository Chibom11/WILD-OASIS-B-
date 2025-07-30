import React, { useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
function CreateHostProfile() {
  const [formData, setFormData] = useState({
    businessName: "",
    gstNumber: "",
    panNumber: "",
    contactNumber: "",
    address: "",
    hostBio: "",
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.bankDetails) {
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/users/createhost", formData, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      toast.success("Host profile created successfully!");
    } catch (err) {
        toast.error("Failed to create host profile");
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage:
          "url('imgs/hostpr.jpg')",
      }}
    >
      <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl max-w-3xl w-full p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Become a Host
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Inputs */}
          {[
            ["Business Name", "businessName"],
            ["GST Number", "gstNumber"],
            ["PAN Number", "panNumber"],
            ["Contact Number", "contactNumber"],
            ["Address", "address"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
              />
            </div>
          ))}

          {/* Host Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host Bio
            </label>
            <textarea
              name="hostBio"
              value={formData.hostBio}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
            />
          </div>

          <hr className="my-6" />

          {/* Bank Details */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Bank Details
          </h3>
          {[
            ["Account Holder Name", "accountHolderName"],
            ["Account Number", "accountNumber"],
            ["IFSC Code", "ifscCode"],
            ["UPI ID", "upiId"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData.bankDetails[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-md"
          >
            {loading ? "Submitting..." : "Create Host Profile"}
          </button>

          {message && (
            <p className="text-center text-sm text-green-700 mt-4">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateHostProfile;
