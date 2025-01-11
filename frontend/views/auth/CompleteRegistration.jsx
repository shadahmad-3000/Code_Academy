import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  User,
  MapPin,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  CalendarIcon,
  Layout
} from "lucide-react";
import DatePicker from "react-datepicker";
import { enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/context/authContext.jsx";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { ME_LOCALHOST_KEY } from "@/config.js";

// Components remain the same...
const Card = ({ className, children, ...props }) => (
  <div
    className={`rounded-lg border bg-black/40 backdrop-blur-xl border-white/10 shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Input components remain the same...
const Input = ({ error, className = "", ...props }) => (
  <div className="relative">
    <input
      className={`
        w-full rounded-md border bg-white/5 px-3 py-2 text-sm placeholder:text-slate-400 
        border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-purple-400
        disabled:cursor-not-allowed disabled:opacity-50
        ${error ? "border-red-500" : "border-white/10"}
        ${className}
      `}
      {...props}
    />
    {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
  </div>
);

// Select component remains the same...
const Select = ({
  options = [],
  error,
  placeholder = "Select an option",
  className = "",
  ...props
}) => (
  <div className="relative">
    <select
      className={`
        w-full appearance-none rounded-md border bg-white/5 px-3 py-2 text-sm
        border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-purple-400
        disabled:cursor-not-allowed disabled:opacity-50
        ${error ? "border-red-500" : "border-white/10"}
        ${className}
      `}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-slate-800">
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </div>
    {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
  </div>
);

// Other components remain the same...
const Button = ({ variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90",
    outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-1 
        focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

const CustomDatePicker = ({ value, onChange, error, placeholder = "Select date", className = "" }) => {
  const [date, setDate] = React.useState(value ? new Date(value) : null);

  // Custom Input to match the design
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className={`
        w-full rounded-md border bg-white/5 px-3 py-2 text-sm
        border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-purple-400
        disabled:cursor-not-allowed disabled:opacity-50 text-left flex items-center
        ${error ? 'border-red-500' : 'border-white/10'}
        ${className}
      `}
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
      {value || <span className="text-slate-400">{placeholder}</span>}
    </button>
  ));

  const handleChange = (date) => {
    setDate(date);
    onChange({
      target: {
        name: 'birth_date',
        value: date ? date.toISOString().split('T')[0] : ''
      }
    });
  };

  // Custom styles for the calendar
  const customStyles = `
    .react-datepicker {
      background-color: rgb(15, 23, 42) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 0.5rem;
      font-family: inherit;
    }

    .react-datepicker__header {
      background-color: rgb(15, 23, 42) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .react-datepicker__current-month,
    .react-datepicker__day-name,
    .react-datepicker-time__header {
      color: white !important;
    }

    .react-datepicker__day {
      color: white !important;
    }

    .react-datepicker__day:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 0.3rem;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      background: linear-gradient(to right, rgb(168, 85, 247), rgb(34, 211, 238)) !important;
      border-radius: 0.3rem;
    }

    .react-datepicker__day--disabled {
      color: rgba(255, 255, 255, 0.3) !important;
    }

    .react-datepicker__navigation-icon::before {
      border-color: white !important;
    }

    .react-datepicker__year-dropdown,
    .react-datepicker__month-dropdown {
      background-color: rgb(15, 23, 42) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .react-datepicker__year-option:hover,
    .react-datepicker__month-option:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .react-datepicker__year-option,
    .react-datepicker__month-option {
      color: white !important;
    }

    .react-datepicker__triangle {
      display: none;
    }
  `;

  return (
    <div className="relative">
      <style>{customStyles}</style>
      <DatePicker
        selected={date}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy"
        locale={enUS}
        customInput={<CustomInput />}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        placeholderText={placeholder}
      />
      {error && (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default function CompleteRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated, completUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(undefined);
  const totalSteps = 3;

  const countryOptions = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Barbados", label: "Barbados" },
    { value: "Belarus", label: "Belarus" },
    { value: "Belgium", label: "Belgium" },
    { value: "Belize", label: "Belize" },
    { value: "Benin", label: "Benin" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
    { value: "Botswana", label: "Botswana" },
    { value: "Brazil", label: "Brazil" },
    { value: "Brunei", label: "Brunei" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Burkina Faso", label: "Burkina Faso" },
    { value: "Burundi", label: "Burundi" },
    { value: "Cabo Verde", label: "Cabo Verde" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Cameroon", label: "Cameroon" },
    { value: "Canada", label: "Canada" },
    { value: "Central African Republic", label: "Central African Republic" },
    { value: "Chad", label: "Chad" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "Comoros", label: "Comoros" },
    { value: "Congo", label: "Congo" },
    { value: "Costa Rica", label: "Costa Rica" },
    { value: "Croatia", label: "Croatia" },
    { value: "Cuba", label: "Cuba" },
    { value: "Cyprus", label: "Cyprus" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Democratic Republic of the Congo", label: "Democratic Republic of the Congo" },
    { value: "Denmark", label: "Denmark" },
    { value: "Djibouti", label: "Djibouti" },
    { value: "Dominica", label: "Dominica" },
    { value: "Dominican Republic", label: "Dominican Republic" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Egypt", label: "Egypt" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Equatorial Guinea", label: "Equatorial Guinea" },
    { value: "Eritrea", label: "Eritrea" },
    { value: "Estonia", label: "Estonia" },
    { value: "Eswatini", label: "Eswatini" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Fiji", label: "Fiji" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Gabon", label: "Gabon" },
    { value: "Gambia", label: "Gambia" },
    { value: "Georgia", label: "Georgia" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "Grenada", label: "Grenada" },
    { value: "Guatemala", label: "Guatemala" },
    { value: "Guinea", label: "Guinea" },
    { value: "Guinea-Bissau", label: "Guinea-Bissau" },
    { value: "Guyana", label: "Guyana" },
    { value: "Haiti", label: "Haiti" },
    { value: "Honduras", label: "Honduras" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Ivory Coast", label: "Ivory Coast" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "Kazakhstan", label: "Kazakhstan" },
    { value: "Kenya", label: "Kenya" },
    { value: "Kiribati", label: "Kiribati" },
    { value: "Kosovo", label: "Kosovo" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Kyrgyzstan", label: "Kyrgyzstan" },
    { value: "Laos", label: "Laos" },
    { value: "Latvia", label: "Latvia" },
    { value: "Lebanon", label: "Lebanon" },
    { value: "Lesotho", label: "Lesotho" },
    { value: "Liberia", label: "Liberia" },
    { value: "Libya", label: "Libya" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Madagascar", label: "Madagascar" },
    { value: "Malawi", label: "Malawi" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Maldives", label: "Maldives" },
    { value: "Mali", label: "Mali" },
    { value: "Malta", label: "Malta" },
    { value: "Marshall Islands", label: "Marshall Islands" },
    { value: "Mauritania", label: "Mauritania" },
    { value: "Mauritius", label: "Mauritius" },
    { value: "Mexico", label: "Mexico" },
    { value: "Micronesia", label: "Micronesia" },
    { value: "Moldova", label: "Moldova" },
    { value: "Monaco", label: "Monaco" },
    { value: "Mongolia", label: "Mongolia" },
    { value: "Montenegro", label: "Montenegro" },
    { value: "Morocco", label: "Morocco" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Myanmar", label: "Myanmar" },
    { value: "Namibia", label: "Namibia" },
    { value: "Nauru", label: "Nauru" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Nicaragua", label: "Nicaragua" },
    { value: "Niger", label: "Niger" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "North Korea", label: "North Korea" },
    { value: "North Macedonia", label: "North Macedonia" },
    { value: "Norway", label: "Norway" },
    { value: "Oman", label: "Oman" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Palau", label: "Palau" },
    { value: "Palestine", label: "Palestine" },
    { value: "Panama", label: "Panama" },
    { value: "Papua New Guinea", label: "Papua New Guinea" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Peru" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Qatar", label: "Qatar" },
    { value: "Romania", label: "Romania" },
    { value: "Russia", label: "Russia" },
    { value: "Rwanda", label: "Rwanda" },
    { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
    { value: "Saint Lucia", label: "Saint Lucia" },
    { value: "Saint Vincent and the Grenadines", label: "Saint Vincent and the Grenadines" },
    { value: "Samoa", label: "Samoa" },
    { value: "San Marino", label: "San Marino" },
    { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Senegal", label: "Senegal" },
    { value: "Serbia", label: "Serbia" },
    { value: "Seychelles", label: "Seychelles" },
    { value: "Sierra Leone", label: "Sierra Leone" },
    { value: "Singapore", label: "Singapore" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Solomon Islands", label: "Solomon Islands" },
    { value: "Somalia", label: "Somalia" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Korea", label: "South Korea" },
    { value: "South Sudan", label: "South Sudan" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sudan", label: "Sudan" },
    { value: "Suriname", label: "Suriname" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Syria", label: "Syria" },
    { value: "Taiwan", label: "Taiwan" },
    { value: "Tajikistan", label: "Tajikistan" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Thailand", label: "Thailand" },
    { value: "Timor-Leste", label: "Timor-Leste" },
    { value: "Togo", label: "Togo" },
    { value: "Tonga", label: "Tonga" },
    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
    { value: "Tunisia", label: "Tunisia" },
    { value: "Turkey", label: "Turkey" },
    { value: "Turkmenistan", label: "Turkmenistan" },
    { value: "Tuvalu", label: "Tuvalu" },
    { value: "Uganda", label: "Uganda" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Uzbekistan", label: "Uzbekistan" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Vatican City", label: "Vatican City" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Yemen", label: "Yemen" },
    { value: "Zambia", label: "Zambia" },
    { value: "Zimbabwe", label: "Zimbabwe" }
  ];

  const courseOptions = [
    { value: "B.TECH", label: "B.TECH" },
    { value: "M.TECH", label: "M.TECH" },
    { value: "BCA", label: "BCA" },
    { value: "MCA", label: "MCA" },
  ];

  useEffect(() => {
    async function fetchData() {
      const user = localStorage.getItem(ME_LOCALHOST_KEY);
      if (!user) {
        navigate("/");
      } else {
        setCurrentUser(JSON.parse(user));
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object().shape({
    identification: Yup.string().required("Identification is required"),
    name: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    birth_date: Yup.date().required("Birth date is required"),
    phone: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    address: Yup.string().required("Address is required"),
    cgpi: Yup.string().required("cgpi is required"),
    sgpi: Yup.string().required("sgpi is required"),
    year: Yup.string().required("year is required"),
    course: Yup.string().required("course is required"),
  });

  const validateStep = (step) => {
    const stepFields = {
      1: ['identification', 'name', 'lastname', 'birth_date'],
      2: ['cgpi', 'sgpi', 'year', 'course', 'phone'],
      3: ['country', 'state', 'address']
    };

    const currentFields = stepFields[step];
    const hasErrors = currentFields.some(field => {
      const value = formik.values[field];
      return !value || (formik.touched[field] && formik.errors[field]);
    });

    return !hasErrors;
  };

  const handleNext = () => {
    // Mark all fields in current step as touched
    const stepFields = {
      1: ['identification', 'name', 'lastname', 'birth_date'],
      2: ['classroom', 'career', 'phone'],
      3: ['country', 'state', 'address']
    };

    const currentFields = stepFields[currentStep];
    const touchedFields = {};
    currentFields.forEach(field => {
      touchedFields[field] = true;
    });

    formik.setTouched({ ...formik.touched, ...touchedFields }, true)
      .then(() => {
        if (validateStep(currentStep)) {
          setCurrentStep(current => current + 1);
        }
      });
  }

  const formik = useFormik({
    initialValues: {
      identification: "",
      name: "",
      lastname: "",
      birth_date: "",
      phone: "",
      country: "United States",
      state: "",
      address: "",
      cgpi: "",
      sgpi: "",
      year: "",
      course: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await completUser(values);
      navigate("/dashboard");
    },
  });

  // Form fields rendering logic remains the same...
  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              name="identification"
              placeholder="Enrollment Number"
              value={formik.values.identification}
              onChange={formik.handleChange}
              error={formik.touched.identification && formik.errors.identification}
            />
            <Input
              name="name"
              placeholder="First Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
            />
            <Input
              name="lastname"
              placeholder="Last Name"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              error={formik.touched.lastname && formik.errors.lastname}
            />
            <CustomDatePicker
              type="date"
              name="birth_date"
              placeholder="Birth Date"
              value={formik.values.birth_date}
              onChange={formik.handleChange}
              error={formik.touched.birth_date && formik.errors.birth_date}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Input
              name="cgpi"
              placeholder="CGPI"
              value={formik.values.cgpi}
              onChange={formik.handleChange}
              error={formik.touched.cgpi && formik.errors.cgpi}
            />
            <Input
              name="sgpi"
              placeholder="SGPI"
              value={formik.values.sgpi}
              onChange={formik.handleChange}
              error={formik.touched.sgpi && formik.errors.sgpi}
            />
            <Input
              name="year"
              placeholder="Year"
              value={formik.values.year}
              onChange={formik.handleChange}
              error={formik.touched.year && formik.errors.year}
            />
            <Select
              name="course"
              placeholder="Select Course"
              options={courseOptions}
              value={formik.values.course}
              onChange={formik.handleChange}
              error={formik.touched.course && formik.errors.course}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && formik.errors.phone}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select
              name="country"
              placeholder="Country"
              options={countryOptions}
              value={formik.values.country}
              onChange={formik.handleChange}
              error={formik.touched.country && formik.errors.country}
            />
            <Input
              name="state"
              placeholder="State/Province/Region"
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && formik.errors.state}
            />
            <Input
              name="address"
              placeholder="Detailed Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && formik.errors.address}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main className="relative overflow-hidden bg-[#0A0A1E] pt-0">
        {/* Static background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative container mx-auto px-4 py-4 flex flex-col md:flex-row items-start justify-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:hidden">
            <Sidebar />
          </div>
          <div className="w-full">
            <AdminNavbar nav="Complete Registration" />

            <div className="container mx-auto mt-4 px-4 py-8 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl">
              {/* Form Header */}
              <div className="mb-12 text-center relative">
                <div className="inline-block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                    <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                      <Layout size={40} className="text-white" />
                    </div>
                  </div>
                </div>
                <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                  Complete Your Registration
                </h1>
                <p className="mt-2 text-slate-400">
                  Please fill in your personal information
                </p>
              </div>

              {/* Form Content */}
              <div className="max-w-2xl mx-auto">
                <form onSubmit={formik.handleSubmit} className="space-y-8">
                  {/* Progress Steps */}
                  <div className="flex justify-between mb-8">
                    {[
                      { icon: User, label: "Personal" },
                      { icon: BookOpen, label: "Academic" },
                      { icon: MapPin, label: "Location" },
                    ].map((step, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${currentStep === index + 1
                              ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                              : currentStep > index + 1
                                ? "bg-green-500"
                                : "bg-white/10"
                            }
                          `}
                        >
                          {currentStep > index + 1 ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <step.icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <span className="text-sm text-slate-400">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Form Fields */}
                  {renderFormFields()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep((current) => current - 1)}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    )}
                    {currentStep < totalSteps ? (
                      <Button
                        onClick={handleNext}
                        className="flex items-center gap-2 ml-auto"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex items-center gap-2 ml-auto"
                        onClick={() => {
                          formik.setTouched({
                            identification: true,
                            first_name: true,
                            last_name: true,
                            birth_date: true,
                            phone: true,
                            country: true,
                            state: true,
                            address: true,
                            classroom: true,
                            career: true
                          });
                        }}
                      >
                        Complete Registration
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
