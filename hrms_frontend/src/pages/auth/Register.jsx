import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCompany } from "../../services/auth.service";
import logo from '../../assets/hrms_logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    industry: "",
    companySize: "",
    country: "",
    state: "",
    city: "",
    address: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault(); 
    setStep(2);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

    
      await registerCompany({
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        phone: formData.phone,
        industry: formData.industry,
        companySize: formData.companySize,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        password: formData.password,
      });

      alert("Company & Admin Registered Successfully");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full p-10 bg-white border border-gray-200 rounded-3xl shadow-lg flex flex-col items-center">
        
     
        <div className="flex flex-col items-center text-center w-full max-w-lg mb-8">
            <img 
                      src={logo} 
                      alt="HRMS Logo" 
                      className="h-24 w-auto object-contain" // h-12 થી લોગો એકદમ પ્રોફેશનલ સાઇઝમાં આવી જશે
                    />
          <h2 className="text-4xl font-extrabold text-black">
            {step === 1 ? "Register Your Company" : "Create Admin Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Step {step} of 2 — {step === 1 ? "Company Profile" : "Credentials"}
          </p>
        </div>

        <form className="w-full space-y-6" onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          
    
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 w-full">
                
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="Cygnux Corp"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Company Email</label>
                  <input
                    type="email"
                    name="companyEmail"
                    required
                    value={formData.companyEmail}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="info@company.com"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Industry</label>
                  <select
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm bg-white"
                  >
                    <option value="">Select Industry</option>
                    <option value="it">Information Technology</option>
                    <option value="finance">Finance</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Company Size</label>
                  <select
                    name="companySize"
                    required
                    value={formData.companySize}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm bg-white"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201+">201+ Employees</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="India"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="Gujarat"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="Surat"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-1">Address</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700 resize-none"
                  placeholder="Enter complete office address..."
                ></textarea>
              </div>

              <div className="w-full pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Continue to Admin Setup
                </button>
              </div>
            </div>
          )}

       
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 w-full">
                
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    name="adminName"
                    required
                    value={formData.adminName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Admin Personal Email</label>
                  <input
                    type="email"
                    name="adminEmail"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 sm:text-sm text-gray-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>

          
              <div className="w-full pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 text-blue-600 focus:ring-blue-200 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="block text-sm text-gray-900">
                    I agree to the <a href="#" className="font-medium text-blue-600 hover:text-blue-700">Terms & Conditions</a>
                  </label>
                </div>
              </div>

         
              <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-1/3 flex justify-center py-4 px-6 border border-gray-300 rounded-full shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-2/3 flex justify-center py-4 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}

       
          <div className="w-full text-center pt-2">
            <p className="text-sm text-slate-500">
              Have an account?{" "}
              <Link to="/login" className="ml-1 text-blue-600 font-bold hover:text-blue-800 transition">
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;