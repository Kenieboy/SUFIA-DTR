import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  User,
  Briefcase,
  Phone,
  MapPin,
  CalendarDays,
  Mail,
  Users,
  CreditCard,
  Clock,
  Camera,
} from "lucide-react";
import api from "../services/api";

import { getDepartments } from "../services/departmentServices";
import ComboboxField from "./ComboboxField";

/* =================================
   INITIAL FORM
================================= */

const initialForm = {
  employeeNo: "",
  biometricId: "",
  photo: "",

  prefix: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",

  street1: "",
  street2: "",
  city: "",
  province: "",
  postalCode: "",

  homePhone: "",
  mobilePhone: "",
  emailAddress: "",

  spouseName: "",
  spouseOccupation: "",

  emergencyName: "",
  emergencyAddress: "",
  emergencyPhone: "",

  sex: "",
  civilStatus: "",
  birthDate: "",
  birthPlace: "",
  religion: "",
  citizenship: "",

  tinNo: "",
  sssNo: "",
  philhealthNo: "",
  pagibigNo: "",

  remarks: "",

  dateHired: "",
  typeId: "",
  departmentId: "",
  jobTitleId: "",

  schedIn: "",
  schedOut: "",

  payType: "",
  yearlyCount: "",
  isActive: true,
  minAllow: "0.00",
};

/* =================================
   API → FORM MAPPING
================================= */

function mapEmployeeToForm(employee) {
  return {
    employeeNo: employee.employee_no ?? "",
    biometricId: employee.biometric_id ?? "",
    photo: employee.photo ?? "",

    prefix: employee.prefix ?? "",
    firstName: employee.first_name ?? "",
    middleName: employee.middle_name ?? "",
    lastName: employee.last_name ?? "",
    suffix: employee.suffix ?? "",

    street1: employee.street1 ?? "",
    street2: employee.street2 ?? "",
    city: employee.city ?? "",
    province: employee.province ?? "",
    postalCode: employee.postal_code ?? "",

    homePhone: employee.home_phone ?? "",
    mobilePhone: employee.mobile_phone ?? "",
    emailAddress: employee.email_address ?? "",

    spouseName: employee.spouse_name ?? "",
    spouseOccupation: employee.spouse_occupation ?? "",

    emergencyName: employee.emergency_name ?? "",
    emergencyAddress: employee.emergency_address ?? "",
    emergencyPhone: employee.emergency_phone ?? "",

    sex: employee.sex ?? "",
    civilStatus: employee.civil_status ?? "",

    birthDate: employee.birth_date ? employee.birth_date.substring(0, 10) : "",

    birthPlace: employee.birth_place ?? "",
    religion: employee.religion ?? "",
    citizenship: employee.citizenship ?? "",

    tinNo: employee.tin_no ?? "",
    sssNo: employee.sss_no ?? "",
    philhealthNo: employee.philhealth_no ?? "",
    pagibigNo: employee.pagibig_no ?? "",

    remarks: employee.remarks ?? "",

    dateHired: employee.date_hired ? employee.date_hired.substring(0, 10) : "",

    typeId: employee.type_id ?? "",
    departmentId: employee.department_id ?? "",
    jobTitleId: employee.job_title_id ?? "",

    schedIn: employee.sched_in ?? "",
    schedOut: employee.sched_out ?? "",

    payType: employee.pay_type ?? "",
    yearlyCount: employee.yearly_count ?? "",

    isActive: Boolean(employee.is_active),

    minAllow: employee.min_allow ?? "0.00",
  };
}

/* =================================
   COMPONENT
================================= */

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [photoPreview, setPhotoPreview] = useState("");

  /* =================================
     GET EMPLOYEE
  ================================= */

  const {
    data: employee,
    isLoading,
    isError,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const response = await api.get(`/employees/${id}`);

      /*
       * Your backend response is:
       *
       * {
       *   success: true,
       *   data: {...}
       * }
       */

      return response.data.data;
    },
    enabled: isEdit,
  });

  /* =================================
   GET DEPARTMENTS
================================= */

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  /* =================================
     SET FORM AFTER LOAD
  ================================= */

  useEffect(() => {
    if (!employee) return;

    const mappedEmployee = mapEmployeeToForm(employee);

    setForm(mappedEmployee);

    if (employee.photo) {
      /*
       * Change this to your actual backend URL.
       *
       * Example:
       * http://localhost:5000/uploads/employees/EMP-0007.jpg
       */

      setPhotoPreview(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${employee.photo}`,
      );
    }
  }, [employee]);

  /* =================================
     CREATE / UPDATE MUTATION
  ================================= */

  const saveMutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      if (id) {
        return api.put(`/employees/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      return api.post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: async () => {
      /*
       * Refresh employee list
       */
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      /*
       * Refresh current employee
       */
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: ["employee", id],
        });
      }

      navigate("/employee");
    },
  });

  /* =================================
     HANDLE INPUT
  ================================= */

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /* =================================
     HANDLE PHOTO
  ================================= */

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      photo: file,
    }));

    setPhotoPreview(URL.createObjectURL(file));
  }

  /* =================================
     SAVE EMPLOYEE
  ================================= */

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    /*
     * IMPORTANT:
     * Convert React camelCase fields
     * to backend snake_case fields.
     */

    data.append("employee_no", form.employeeNo);
    data.append("biometric_id", form.biometricId);

    if (form.photo instanceof File) {
      data.append("photo", form.photo);
    }

    data.append("prefix", form.prefix);
    data.append("first_name", form.firstName);
    data.append("middle_name", form.middleName);
    data.append("last_name", form.lastName);
    data.append("suffix", form.suffix);

    data.append("street1", form.street1);
    data.append("street2", form.street2);
    data.append("city", form.city);
    data.append("province", form.province);
    data.append("postal_code", form.postalCode);

    data.append("home_phone", form.homePhone);
    data.append("mobile_phone", form.mobilePhone);
    data.append("email_address", form.emailAddress);

    data.append("spouse_name", form.spouseName);
    data.append("spouse_occupation", form.spouseOccupation);

    data.append("emergency_name", form.emergencyName);
    data.append("emergency_address", form.emergencyAddress);
    data.append("emergency_phone", form.emergencyPhone);

    data.append("sex", form.sex);
    data.append("civil_status", form.civilStatus);
    data.append("birth_date", form.birthDate);
    data.append("birth_place", form.birthPlace);
    data.append("religion", form.religion);
    data.append("citizenship", form.citizenship);

    data.append("tin_no", form.tinNo);
    data.append("sss_no", form.sssNo);
    data.append("philhealth_no", form.philhealthNo);
    data.append("pagibig_no", form.pagibigNo);

    data.append("remarks", form.remarks);

    data.append("date_hired", form.dateHired);
    data.append("type_id", form.typeId);
    data.append("department_id", form.departmentId);
    data.append("job_title_id", form.jobTitleId);

    data.append("sched_in", form.schedIn);
    data.append("sched_out", form.schedOut);

    data.append("pay_type", form.payType);
    data.append("yearly_count", form.yearlyCount);
    data.append("is_active", form.isActive ? "1" : "0");
    data.append("min_allow", form.minAllow);

    saveMutation.mutate({
      formData: data,
      id: isEdit ? id : null,
    });
  }

  /* =================================
     LOADING
  ================================= */

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[12px] text-slate-500">
          Loading employee information...
        </p>
      </div>
    );
  }

  /* =================================
     ERROR
  ================================= */

  const errorMessage =
    saveMutation.error?.response?.data?.message ||
    employeeError?.response?.data?.message ||
    "Unable to save employee information.";

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/employee")}
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg border border-slate-200
              bg-white text-slate-500
              transition hover:bg-slate-50
            "
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-800">
              {isEdit ? "Edit Employee" : "New Employee"}
            </h1>

            <p className="mt-0.5 text-[12px] text-slate-500">
              {isEdit
                ? "Update employee information and records."
                : "Add a new employee record."}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {(saveMutation.isError || isError) && (
        <div
          className="
            rounded-lg border border-red-200
            bg-red-50 px-4 py-3
            text-[12px] text-red-600
          "
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* =================================
              EMPLOYEE PHOTO
          ================================= */}

          <FormSection
            icon={Camera}
            iconClass="bg-blue-50 text-blue-600"
            title="Employee Photo"
            description="Employee identification photo"
          >
            <div className="lg:col-span-4">
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex h-24 w-24 shrink-0
                    items-center justify-center
                    overflow-hidden rounded-xl
                    border border-dashed border-slate-300
                    bg-slate-50
                  "
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Employee"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-slate-300" />
                  )}
                </div>

                <div>
                  <label
                    className="
                      inline-flex cursor-pointer
                      items-center rounded-lg
                      border border-slate-200
                      bg-white px-3 py-2
                      text-[12px] font-medium
                      text-slate-600
                      transition hover:bg-slate-50
                    "
                  >
                    <Camera size={14} className="mr-2" />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    JPG, PNG or WEBP. Recommended square image.
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* =================================
              PERSONAL INFORMATION
          ================================= */}

          <FormSection
            icon={User}
            iconClass="bg-blue-50 text-blue-600"
            title="Personal Information"
            description="Basic employee information"
          >
            <InputField
              label="Employee No."
              name="employeeNo"
              value={form.employeeNo}
              onChange={handleChange}
              placeholder="EMP-0001"
              required
            />

            <InputField
              label="Biometric ID"
              name="biometricId"
              value={form.biometricId}
              onChange={handleChange}
              placeholder="Biometric ID"
              required
            />

            <SelectField
              label="Prefix"
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
              options={["Mr.", "Ms.", "Mrs.", "Dr."]}
            />

            <SelectField
              label="Suffix"
              name="suffix"
              value={form.suffix}
              onChange={handleChange}
              options={["Jr.", "Sr.", "II", "III", "IV"]}
            />

            <InputField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />

            <InputField
              label="Middle Name"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              placeholder="Middle name"
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />

            <SelectField
              label="Sex"
              name="sex"
              value={form.sex}
              onChange={handleChange}
              options={["Male", "Female"]}
            />

            <SelectField
              label="Civil Status"
              name="civilStatus"
              value={form.civilStatus}
              onChange={handleChange}
              options={[
                "Single",
                "Married",
                "Widowed",
                "Separated",
                "Divorced",
              ]}
            />

            <InputField
              label="Birth Date"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />

            <InputField
              label="Birth Place"
              name="birthPlace"
              value={form.birthPlace}
              onChange={handleChange}
              placeholder="Place of birth"
            />

            <InputField
              label="Religion"
              name="religion"
              value={form.religion}
              onChange={handleChange}
              placeholder="Religion"
            />

            <InputField
              label="Citizenship"
              name="citizenship"
              value={form.citizenship}
              onChange={handleChange}
              placeholder="Citizenship"
            />
          </FormSection>

          {/* =================================
              CONTACT INFORMATION
          ================================= */}

          <FormSection
            icon={Phone}
            iconClass="bg-emerald-50 text-emerald-600"
            title="Contact Information"
            description="Employee contact details"
          >
            <InputField
              label="Email Address"
              name="emailAddress"
              type="email"
              value={form.emailAddress}
              onChange={handleChange}
              placeholder="employee@example.com"
              icon={Mail}
            />

            <InputField
              label="Mobile Phone"
              name="mobilePhone"
              value={form.mobilePhone}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              icon={Phone}
            />

            <InputField
              label="Home Phone"
              name="homePhone"
              value={form.homePhone}
              onChange={handleChange}
              placeholder="Home phone number"
            />
          </FormSection>

          {/* =================================
              ADDRESS
          ================================= */}

          <FormSection
            icon={MapPin}
            iconClass="bg-amber-50 text-amber-600"
            title="Address"
            description="Current residential address"
          >
            <div className="lg:col-span-2">
              <InputField
                label="Street 1"
                name="street1"
                value={form.street1}
                onChange={handleChange}
                placeholder="House / Building / Street"
              />
            </div>

            <div className="lg:col-span-2">
              <InputField
                label="Street 2"
                name="street2"
                value={form.street2}
                onChange={handleChange}
                placeholder="Apartment / Unit / Barangay"
              />
            </div>

            <InputField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City / Municipality"
            />

            <InputField
              label="Province"
              name="province"
              value={form.province}
              onChange={handleChange}
              placeholder="Province"
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
            />
          </FormSection>

          {/* =================================
              FAMILY
          ================================= */}

          <FormSection
            icon={Users}
            iconClass="bg-pink-50 text-pink-600"
            title="Family Information"
            description="Spouse information"
          >
            <div className="lg:col-span-2">
              <InputField
                label="Spouse Name"
                name="spouseName"
                value={form.spouseName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>

            <div className="lg:col-span-2">
              <InputField
                label="Spouse Occupation"
                name="spouseOccupation"
                value={form.spouseOccupation}
                onChange={handleChange}
                placeholder="Occupation"
              />
            </div>
          </FormSection>

          {/* =================================
              EMERGENCY
          ================================= */}

          <FormSection
            icon={Phone}
            iconClass="bg-red-50 text-red-600"
            title="Emergency Contact"
            description="Person to contact during emergencies"
          >
            <div className="lg:col-span-2">
              <InputField
                label="Contact Name"
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>

            <InputField
              label="Phone Number"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              placeholder="Phone number"
            />

            <div className="lg:col-span-4">
              <InputField
                label="Address"
                name="emergencyAddress"
                value={form.emergencyAddress}
                onChange={handleChange}
                placeholder="Emergency contact address"
              />
            </div>
          </FormSection>

          {/* =================================
              GOVERNMENT IDS
          ================================= */}

          <FormSection
            icon={CreditCard}
            iconClass="bg-indigo-50 text-indigo-600"
            title="Government Information"
            description="Government identification numbers"
          >
            <InputField
              label="TIN No."
              name="tinNo"
              value={form.tinNo}
              onChange={handleChange}
              placeholder="TIN number"
            />

            <InputField
              label="SSS No."
              name="sssNo"
              value={form.sssNo}
              onChange={handleChange}
              placeholder="SSS number"
            />

            <InputField
              label="PhilHealth No."
              name="philhealthNo"
              value={form.philhealthNo}
              onChange={handleChange}
              placeholder="PhilHealth number"
            />

            <InputField
              label="Pag-IBIG No."
              name="pagibigNo"
              value={form.pagibigNo}
              onChange={handleChange}
              placeholder="Pag-IBIG number"
            />
          </FormSection>

          {/* =================================
              EMPLOYMENT
          ================================= */}

          <FormSection
            icon={Briefcase}
            iconClass="bg-purple-50 text-purple-600"
            title="Employment Information"
            description="Position and employment details"
          >
            <InputField
              label="Department ID"
              name="departmentId"
              type="number"
              value={form.departmentId}
              onChange={handleChange}
              placeholder="Department ID"
            />

            <ComboboxField
              label="Department"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              options={departments}
              loading={departmentsLoading}
            />

            <InputField
              label="Date Hired"
              name="dateHired"
              type="date"
              value={form.dateHired}
              onChange={handleChange}
              icon={CalendarDays}
            />

            <SelectField
              label="Pay Type"
              name="payType"
              value={form.payType}
              onChange={handleChange}
              options={["1", "2"]}
            />

            <InputField
              label="Minimum Allowance"
              name="minAllow"
              type="number"
              step="0.01"
              value={form.minAllow}
              onChange={handleChange}
              placeholder="0.00"
            />

            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Status
              </label>

              <label
                className="
                  flex h-[34px] cursor-pointer
                  items-center gap-2
                  rounded-lg border border-slate-200
                  px-3
                "
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={Boolean(form.isActive)}
                  onChange={handleChange}
                  className="h-3.5 w-3.5"
                />

                <span className="text-[12px] text-slate-700">
                  Active Employee
                </span>
              </label>
            </div>
          </FormSection>

          {/* =================================
              WORK SCHEDULE
          ================================= */}

          <FormSection
            icon={Clock}
            iconClass="bg-cyan-50 text-cyan-600"
            title="Work Schedule"
            description="Employee working hours"
          >
            <InputField
              label="Schedule In"
              name="schedIn"
              type="time"
              value={form.schedIn}
              onChange={handleChange}
            />

            <InputField
              label="Schedule Out"
              name="schedOut"
              type="time"
              value={form.schedOut}
              onChange={handleChange}
            />
          </FormSection>

          {/* =================================
              REMARKS
          ================================= */}

          <FormSection
            icon={CalendarDays}
            iconClass="bg-slate-100 text-slate-600"
            title="Remarks"
            description="Additional employee notes"
          >
            <div className="lg:col-span-4">
              <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Remarks
              </label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes or remarks..."
                className="
                  w-full resize-none rounded-lg
                  border border-slate-200 bg-white
                  px-3 py-2 text-[12px]
                  text-slate-700 outline-none
                  transition placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/10
                "
              />
            </div>
          </FormSection>

          {/* =================================
              ACTIONS
          ================================= */}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="
                rounded-lg border border-slate-200
                bg-white px-4 py-2
                text-[12px] font-medium text-slate-600
                transition hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="
                flex items-center gap-2
                rounded-lg bg-blue-600
                px-4 py-2
                text-[12px] font-medium text-white
                shadow-sm transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save size={15} />

              {saveMutation.isPending
                ? "Saving..."
                : isEdit
                  ? "Update Employee"
                  : "Save Employee"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =================================
   FORM SECTION
================================= */

function FormSection({ icon: Icon, iconClass, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
        <div
          className={`
            flex h-8 w-8 items-center
            justify-center rounded-lg
            ${iconClass}
          `}
        >
          <Icon size={16} />
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-slate-700">{title}</h2>

          <p className="text-[11px] text-slate-400">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  );
}

/* =================================
   INPUT FIELD
================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
  step,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />
        )}

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          step={step}
          className={`
            w-full rounded-lg
            border border-slate-200
            bg-white py-2
            ${Icon ? "pl-9" : "pl-3"}
            pr-3 text-[12px]
            text-slate-700
            outline-none transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/10
          `}
        />
      </div>
    </div>
  );
}

/* =================================
   SELECT FIELD
================================= */

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
        {label}
      </label>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="
          w-full rounded-lg
          border border-slate-200
          bg-white px-3 py-2
          text-[12px] text-slate-700
          outline-none transition
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500/10
        "
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
