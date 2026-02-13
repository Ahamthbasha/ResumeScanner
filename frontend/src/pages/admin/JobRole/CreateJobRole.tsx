// src/pages/admin/JobRole/CreateJobRole.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createJobRole } from "../../../api/auth/adminAuth";
import type { AxiosError } from "axios";

interface CreateJobRoleFormValues {
  title: string;
  description: string;
  requiredSkills: string;
  category: string;
  experienceLevel: string;
  minExperience: string;
  maxExperience: string;
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
}

const jobRoleSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required"),
  requiredSkills: Yup.string()
    .required("Skills are required")
    .test("skills", "Enter at least one skill", (value) => {
      return value ? value.split(",").filter(s => s.trim()).length > 0 : false;
    }),
  category: Yup.string(),
  experienceLevel: Yup.string(),
  minExperience: Yup.number()
    .min(0, "Minimum experience must be 0 or more")
    .nullable()
    .transform((value) => (isNaN(value) ? undefined : value)),
  maxExperience: Yup.number()
    .min(0, "Maximum experience must be 0 or more")
    .nullable()
    .transform((value) => (isNaN(value) ? undefined : value))
    .test("max", "Maximum experience must be greater than minimum", function(value) {
      const { minExperience } = this.parent;
      if (minExperience && value) {
        return value > minExperience;
      }
      return true;
    }),
});

const CreateJobRole = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: CreateJobRoleFormValues = {
    title: "",
    description: "",
    requiredSkills: "",
    category: "",
    experienceLevel: "",
    minExperience: "",
    maxExperience: "",
  };

  const onSubmit = async (values: CreateJobRoleFormValues) => {
    setIsLoading(true);
    try {
      const skillsArray = values.requiredSkills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill);

      const payload = {
        title: values.title,
        description: values.description,
        requiredSkills: skillsArray,
        category: values.category || undefined,
        experienceLevel: values.experienceLevel || undefined,
        minExperience: values.minExperience ? Number(values.minExperience) : undefined,
        maxExperience: values.maxExperience ? Number(values.maxExperience) : undefined,
      };

      const response = await createJobRole(payload);
      
      if (response.success) {
        toast.success("Job role created successfully");
        navigate("/admin/job-roles");
      }
    } catch (error) {
      console.error("Create error:", error);
      
      let errorMessage = "Failed to create job role";
      const axiosError = error as AxiosError<ErrorResponse>;
      
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Job Role</h1>
        <p className="text-gray-500 mt-1">Add a new job role to the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={jobRoleSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <Field
                  name="title"
                  type="text"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                    errors.title && touched.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Senior Frontend Developer"
                  disabled={isLoading}
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the job role responsibilities and requirements..."
                  disabled={isLoading}
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>

              {/* Required Skills Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills *
                </label>
                <Field
                  name="requiredSkills"
                  type="text"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                    errors.requiredSkills && touched.requiredSkills ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="React, TypeScript, Node.js, MongoDB (comma separated)"
                  disabled={isLoading}
                />
                {errors.requiredSkills && touched.requiredSkills && (
                  <div className="text-red-500 text-sm mt-1">{errors.requiredSkills}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Field
                    name="category"
                    type="text"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                      errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Development, Design, DevOps"
                    disabled={isLoading}
                  />
                  {errors.category && touched.category && (
                    <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                  )}
                </div>

                {/* Experience Level Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <Field
                    name="experienceLevel"
                    type="text"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                      errors.experienceLevel && touched.experienceLevel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Entry, Mid, Senior"
                    disabled={isLoading}
                  />
                  {errors.experienceLevel && touched.experienceLevel && (
                    <div className="text-red-500 text-sm mt-1">{errors.experienceLevel}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Min Experience Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Experience (years)
                  </label>
                  <Field
                    name="minExperience"
                    type="number"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                      errors.minExperience && touched.minExperience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.minExperience && touched.minExperience && (
                    <div className="text-red-500 text-sm mt-1">{errors.minExperience}</div>
                  )}
                </div>

                {/* Max Experience Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Experience (years)
                  </label>
                  <Field
                    name="maxExperience"
                    type="number"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${
                      errors.maxExperience && touched.maxExperience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="5"
                    disabled={isLoading}
                  />
                  {errors.maxExperience && touched.maxExperience && (
                    <div className="text-red-500 text-sm mt-1">{errors.maxExperience}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/job-roles")}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Job Role"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateJobRole;