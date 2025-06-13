/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GenratePdf from "./GeneratePdf";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useStorage } from "@/components/hooks/useStorage"; // Custom hook shown below
import FileUploadForm from "./FileUploadForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Personal from "./Personal";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  middleName: string;
  dob: string;
  gender: string;
  email: string;
  programName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  religion: string;
  country: string;
  applicationNumber?: string;
  departmentId: string;
  programId: string;
  profileImage: File | null;
  imageUrl: string;
  // Academic Information
  highSchool: string;
  graduationYear: string;
  gpa: string;
  satScore: string;
  actScore: string;
  previousCollege: boolean;
  collegeCourses: string;
  studentName: string;
  secondarySchool: string;
  examType: string;
  examYear: string;
  subject1Name: string;
  subject1Grade: string;
  subject2Name: string;
  subject2Grade: string;
  subject3Name: string;
  subject3Grade: string;
  subject4Name: string;
  subject4Grade: string;
  subject5Name: string;
  subject5Grade: string;
  subject6Name: string;
  subject6Grade: string;
  subject7Name: string;
  subject7Grade: string;
  subject8Name: string;
  subject8Grade: string;
  subject9Name: string;
  subject9Grade: string;

  // Program Selection
  program: string;
  concentration: string;
  startTerm: string;

  // Health Information
  allergies: string;
  medications: string;
  conditions: string;
  emergencyContact: string;
  emergencyPhone: string;

  // Documents
  transcriptFile: File | null;
  secondarySchoolResultFile: File | null;
  birthCertificateFile: File | null;
  nationalIdFile: File | null;
  primaryCertificateFile: File | null;
  recommendationLetters: number;
  personalStatementFile: File | null;

  // Terms
  agreeTerms: boolean;
}

type Course = {
  _id: string;
  name: string;
};

const ApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    dob: "",
    programName: "",
    gender: "",
    departmentId: "",
     programId: "",
      profileImage: null,
    imageUrl: "",
    email: "",
    religion: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    highSchool: "",
    graduationYear: "",
    gpa: "",
    satScore: "",
    actScore: "",
    previousCollege: false,
    collegeCourses: "",
    program: "",
    concentration: "",
    startTerm: "",
    allergies: "",
    medications: "",
    conditions: "",
    emergencyContact: "",
    emergencyPhone: "",
    transcriptFile: null,
    secondarySchoolResultFile: null,
    birthCertificateFile: null,
    nationalIdFile: null,
    primaryCertificateFile: null,
    recommendationLetters: 0,
    personalStatementFile: null,
    agreeTerms: false,
    studentName: "",
    secondarySchool: "",
    examType: "WAEC",
    examYear: "",
    subject1Name: "",
    subject1Grade: "",
    subject2Name: "",
    subject2Grade: "",
    subject3Name: "",
    subject3Grade: "",
    subject4Name: "",
    subject4Grade: "",
    subject5Name: "",
    subject5Grade: "",
    subject6Name: "",
    subject6Grade: "",
    subject7Name: "",
    subject7Grade: "",
    subject8Name: "",
    subject8Grade: "",
    subject9Name: "",
    subject9Grade: "",
  });
  const departments = useQuery(api.departments.getDepartments) || [];
  const [program, setProgram] = useState<Course[]>([]);
  const convex = useConvex();

  const getProgramByDepartment = async ({
    departmentId
  }: {
    departmentId: string
  }) => {
    return await convex.query(api.program.getProgramByDepartment, {
      departmentId,
    });
  };
  useEffect(() => {
    const fetchCourses = async () => {
      if (formData.departmentId) {
        const program = await getProgramByDepartment({
          departmentId: formData.departmentId,
        });
        setProgram(program);
      } else {
        setProgram([]);
      }
    };

    fetchCourses();
  }, [formData.departmentId]);
  const { uploadFile } = useStorage();
  const submitMutation = useMutation(api.students.submitApplication);

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement |SelectChangeEvent<string> |{ name?: string; value: unknown }
  //   >
  // ) => {
  //   const { name, value, type } = e.target as HTMLInputElement;
  //   const checked = (e.target as HTMLInputElement).checked;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name as string]: type === "checkbox" ? checked : value,
  //   }));

  //   if (errors[name as string]) {
  //     setErrors((prev) => ({ ...prev, [name as string]: false }));
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | SelectChangeEvent<string>
      | { name?: string; value: unknown }
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    // Handle department selection separately to reset course
    if (name === "departmentId") {
      setFormData((prev) => ({
        ...prev,
        departmentId: value as string,
        programId: "",
        program: departments.find((d) => d._id === value)?.name || "",
        // Set program name
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name as string]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name as string]: false }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.firstName) newErrors.firstName = true;
        if (!formData.lastName) newErrors.lastName = true;
        if (!formData.dob) newErrors.dob = true;
        if (!formData.gender) newErrors.gender = true;
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
          newErrors.email = true;
        if (!formData.phone) newErrors.phone = true;
        if (!formData.address) newErrors.address = true;
        if (!formData.city) newErrors.city = true;
        if (!formData.state) newErrors.state = true;
        if (!formData.zipCode) newErrors.zipCode = true;
        if (!formData.country) newErrors.country = true;
        if (!formData.religion) newErrors.religion = true;
        break;
      case 1: // Academic Background
        if (!formData.studentName) newErrors.studentName = true;
        if (!formData.secondarySchool) newErrors.secondarySchool = true;
        if (!formData.examYear) newErrors.examYear = true;

        // Validate at least 5 subjects (common requirement for WAEC/NECO)
        const filledSubjects = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((i) => {
          const name = formData[`subject${i}Name` as keyof FormData];
          const grade = formData[`subject${i}Grade` as keyof FormData];
          return name && grade;
        }).length;

        if (filledSubjects < 5) newErrors.subjects = true;
        break;
      case 2: // Program Selection
        if (!formData.departmentId) newErrors.departmentId = true;
        if (!formData.programId) newErrors.programId = true;
        if (!formData.startTerm) newErrors.startTerm = true;
        break;
      case 3: // Health Information
        if (!formData.emergencyContact) newErrors.emergencyContact = true;
        if (!formData.emergencyPhone) newErrors.emergencyPhone = true;
        break;
      case 4:
        if (!formData.secondarySchoolResultFile)
          newErrors.secondarySchoolResultFile = true;
        if (!formData.birthCertificateFile)
          newErrors.birthCertificateFile = true;
        if (!formData.nationalIdFile) newErrors.nationalIdFile = true;
        if (!formData.primaryCertificateFile) newErrors.transcriptFile = true;

        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const reserveSlotMutation = useMutation(api.screening.reserveScreeningSlot);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (validateStep(activeStep) && formData.agreeTerms) {
  //     try {
  //       setLoading(true);
  //       const applicationDate = Date.now();
  //       const applicationNumber = `JICO-${applicationDate.toString().slice(-6)}-${Math.floor(
  //         Math.random() * 10000
  //       )
  //         .toString()
  //         .padStart(4, "0")}`;

  //       // Reserve a screening slot
  //       const slotDetails = await reserveSlotMutation();
  //       if (!slotDetails) throw new Error("No available screening slots");

  //       // Add screening details to form data for PDF
  //       const formDataWithScreening = {
  //         ...formData,
  //         screeningDate: slotDetails.date,
  //         screeningTime: slotDetails.startTime,
  //         screeningLocation: slotDetails.location,
  //       };

  //       // Generate PDF without saving it locally
  //       const pdfBlob = await GenratePdf(
  //         formDataWithScreening,
  //         applicationNumber
  //       );
  //       const pdfFile = new File([pdfBlob], "application.pdf", {
  //         type: "application/pdf",
  //       });

  //       // Function to upload files and get storage IDs
  //       const uploadFileAndGetId = async (file: File | null) => {
  //         if (!file) return undefined;
  //         return await uploadFile(file);
  //       };

  //       // Upload all required files
  //       const [
  //         secondarySchoolResultId,
  //         birthCertificateId,
  //         nationalIdId,
  //         primaryCertificateId,
  //         transcriptId,
  //         personalStatementId,
  //         generatedPdfId,
  //       ] = await Promise.all([
  //         uploadFileAndGetId(formData.secondarySchoolResultFile || null),
  //         uploadFileAndGetId(formData.birthCertificateFile || null),
  //         uploadFileAndGetId(formData.nationalIdFile || null),
  //         uploadFileAndGetId(formData.primaryCertificateFile || null),
  //         uploadFileAndGetId(formData.transcriptFile || null),
  //         uploadFileAndGetId(formData.personalStatementFile || null),
  //         uploadFileAndGetId(pdfFile),
  //       ]);

  //       // Prepare the form data for submission
  //       const {
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         secondarySchoolResultFile,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         birthCertificateFile,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         nationalIdFile,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         primaryCertificateFile,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         transcriptFile,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         personalStatementFile,
  //         ...formDataWithoutFiles
  //       } = formData;
  //   const profileImageId = formData.profileImage 
  //       ? await uploadFile(formData.profileImage) 
  //       : undefined;
  //       const processedFormData = {
  //         ...formDataWithoutFiles,
  //         applicationNumber,
  //         recommendationLetters: Number(
  //           formDataWithoutFiles.recommendationLetters
  //         ),
  //       };

  //       // Submit form data
  //       await submitMutation({
  //         formData: processedFormData,
  //         files: {
  //           secondarySchoolResult: secondarySchoolResultId,
  //           birthCertificate: birthCertificateId,
  //           nationalId: nationalIdId,
  //           primaryCertificate: primaryCertificateId,
  //           transcript: transcriptId,
  //           personalStatement: personalStatementId,
  //           generatedPdf: generatedPdfId,
  //            profileImage: profileImageId,
  //         },
  //       });

  //       toast.success("Application submitted successfully!");
  //       setLoading(false);
  //       router.push("/");
  //     } catch (error) {
  //       console.error("Submission failed:", error);
  //       toast.error("Submission failed. Please try again.");
  //       setLoading(false);
  //     }
  //   } else if (!formData.agreeTerms) {
  //     setErrors((prev) => ({ ...prev, agreeTerms: true }));
  //   }
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name as keyof FormData]: files && files.length > 0 ? files[0] : null,
  //   }));

  //   if (errors[name as string]) {
  //     setErrors((prev) => ({ ...prev, [name as string]: false }));
  //   }
  // };
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validateStep(activeStep) && formData.agreeTerms) {
    try {
      setLoading(true);
      const applicationDate = Date.now();
      const applicationNumber = `JICO-${applicationDate.toString().slice(-6)}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      // Reserve a screening slot
      const slotDetails = await reserveSlotMutation();
      if (!slotDetails) throw new Error("No available screening slots");

      // Add screening details to form data for PDF
      const formDataWithScreening = {
        ...formData,
        screeningDate: slotDetails.date,
        screeningTime: slotDetails.startTime,
        screeningLocation: slotDetails.location,
      };

      // Generate PDF without saving it locally
      const pdfBlob = await GenratePdf(formDataWithScreening, applicationNumber);
      const pdfFile = new File([pdfBlob], "application.pdf", {
        type: "application/pdf",
      });

      // Function to upload files and get storage IDs
      const uploadFileAndGetId = async (file: File | null) => {
        if (!file) return undefined;
        try {
          return await uploadFile(file);
        } catch (error) {
          console.error(`Failed to upload file: ${file.name}`, error);
          return undefined;
        }
      };

      // Upload all files in parallel
      const uploadPromises = [
        uploadFileAndGetId(formData.secondarySchoolResultFile),
        uploadFileAndGetId(formData.birthCertificateFile),
        uploadFileAndGetId(formData.nationalIdFile),
        uploadFileAndGetId(formData.primaryCertificateFile),
        uploadFileAndGetId(formData.transcriptFile),
        uploadFileAndGetId(formData.personalStatementFile),
        uploadFileAndGetId(pdfFile),
        uploadFileAndGetId(formData.profileImage), // Add profile image upload
      ];

      const [
        secondarySchoolResultId,
        birthCertificateId,
        nationalIdId,
        primaryCertificateId,
        transcriptId,
        personalStatementId,
        generatedPdfId,
        profileImageId,
      ] = await Promise.all(uploadPromises);

      // Prepare the form data for submission
      const {
        secondarySchoolResultFile,
        birthCertificateFile,
        nationalIdFile,
        primaryCertificateFile,
        transcriptFile,
        personalStatementFile,
        profileImage, // Remove File object from submission
        ...formDataWithoutFiles
      } = formData;

      const processedFormData = {
        ...formDataWithoutFiles,
        applicationNumber,
        recommendationLetters: Number(formDataWithoutFiles.recommendationLetters),
      };

      // Submit form data
      await submitMutation({
        formData: processedFormData,
        files: {
          secondarySchoolResult: secondarySchoolResultId || undefined,
          birthCertificate: birthCertificateId || undefined,
          nationalId: nationalIdId || undefined,
          primaryCertificate: primaryCertificateId || undefined,
          transcript: transcriptId || undefined,
          personalStatement: personalStatementId || undefined,
          generatedPdf: generatedPdfId || undefined,
          profileImage: profileImageId || undefined,
        },
      });

      toast.success("Application submitted successfully!");
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
      setLoading(false);
    }
  } else if (!formData.agreeTerms) {
    setErrors((prev) => ({ ...prev, agreeTerms: true }));
  }
};
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "profileImage" && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        imageUrl
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as keyof FormData]: files && files.length > 0 ? files[0] : null,
      }));
    }

    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name as string]: false }));
    }
  };
  const steps: string[] = [
    "Personal Information",
    "Academic Background",
    "Program Selection",
    "Health Information",
    "Documents",
    "Review & Submit",
  ];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1">Profile Photo</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Profile Preview"
                    width={150}
                    height={150}
                    style={{
                     
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption">No Image</Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#f7ba34",
                    "&:hover": {
                      backgroundColor: "#e0a82a",
                    },
                    color: "#fff",
                  }}
                >
                  Upload Photo
                  <input
                    type="file"
                    name="profileImage"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Grid>
          <Personal
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          </>
          
        );
      case 1:
        return (
          <Grid container spacing={3}>
           
          
         
            <Grid item xs={12}>
              <Typography variant="subtitle1">Student Full Name</Typography>
              <TextField
                required
                fullWidth
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                error={errors.studentName}
                helperText={
                  errors.studentName ? "Student name is required" : ""
                }
              />
            </Grid>

            {/* School Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Secondary School Name</Typography>
              <TextField
                required
                fullWidth
                name="secondarySchool"
                value={formData.secondarySchool}
                onChange={handleChange}
                error={errors.secondarySchool}
                helperText={
                  errors.secondarySchool ? "School name is required" : ""
                }
              />
            </Grid>

            {/* Examination Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Examination Type</Typography>
              <FormControl fullWidth required>
                <Select
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                >
                  <MenuItem value="WAEC">WAEC</MenuItem>
                  <MenuItem value="NECO">NECO</MenuItem>
                  <MenuItem value="NABTEB">NABTEB</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Examination Year</Typography>
              <TextField
                required
                fullWidth
                type="number"
                name="examYear"
                value={formData.examYear}
                onChange={handleChange}
                inputProps={{
                  min: 2000,
                  max: new Date().getFullYear(),
                }}
                error={errors.examYear}
                helperText={errors.examYear ? "Exam year is required" : ""}
              />
            </Grid>

            {/* Examination Subjects */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Examination Subjects and Scores
              </Typography>
              {errors.subjects && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Please provide at least 5 subjects with grades
                </Alert>
              )}

              {[...Array(9)].map((_, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={7}>
                    <Typography variant="subtitle1">
                      Subject {index + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      name={`subject${index + 1}Name` as keyof FormData}
                      value={
                        formData[`subject${index + 1}Name` as keyof FormData] ||
                        ""
                      }
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={5}>
                    <Typography variant="subtitle1">Grade</Typography>
                    <FormControl fullWidth>
                      <Select
                        name={`subject${index + 1}Grade` as keyof FormData}
                        value={
                          formData[
                            `subject${index + 1}Grade` as keyof FormData
                          ] || ""
                        }
                        onChange={handleChange}
                      >
                        <MenuItem value="A1">A1 (Excellent)</MenuItem>
                        <MenuItem value="B2">B2 (Very Good)</MenuItem>
                        <MenuItem value="B3">B3 (Good)</MenuItem>
                        <MenuItem value="C4">C4 (Credit)</MenuItem>
                        <MenuItem value="C5">C5 (Credit)</MenuItem>
                        <MenuItem value="C6">C6 (Credit)</MenuItem>
                        <MenuItem value="D7">D7 (Pass)</MenuItem>
                        <MenuItem value="E8">E8 (Pass)</MenuItem>
                        <MenuItem value="F9">F9 (Fail)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/* Previous College Attendance */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.previousCollege}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        previousCollege: !prev.previousCollege,
                      }))
                    }
                  />
                }
                label="Have you attended college/university before?"
              />
              {formData.previousCollege && (
                <>
                  <Typography variant="subtitle1">
                    List institution(s) attended and courses completed
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="collegeCourses"
                    value={formData.collegeCourses}
                    onChange={handleChange}
                    margin="normal"
                  />
                </>
              )}
            </Grid>
          </Grid>
        );
      case 2: // Program Selection
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Department</Typography>
              <FormControl fullWidth required error={errors.departmentId}>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    <em>Select a department</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departmentId && (
                  <Typography color="error" variant="caption">
                    Please select a department
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {formData.departmentId && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Program</Typography>
                <FormControl fullWidth required error={errors.programId}>
                  <Select
                    name="programId"
                    value={formData.programId}
                    onChange={(e) => {
                      const programId = e.target.value;
                      const selectedProgram = program.find(
                        (c) => c._id === programId
                      );
                      setFormData((prev) => ({
                        ...prev,
                        programId,
                        programName: selectedProgram ? selectedProgram.name : "",
                      }));
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a Program</em>
                    </MenuItem>
                    {program.map((programm) => (
                      <MenuItem key={programm._id} value={programm._id}>
                        {programm.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.programId && (
                    <Typography color="error" variant="caption">
                      Please select a Program
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1">Preferred Start Term</Typography>
              <FormControl error={errors.startTerm}>
                <RadioGroup
                  row
                  name="startTerm"
                  value={formData.startTerm}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="fall"
                    control={<Radio />}
                    label="Fall"
                  />
                  <FormControlLabel
                    value="spring"
                    control={<Radio />}
                    label="Spring"
                  />
                  <FormControlLabel
                    value="summer"
                    control={<Radio />}
                    label="Summer"
                  />
                </RadioGroup>
                {errors.startTerm && (
                  <Typography color="error" variant="caption">
                    Please select a start term
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Health Information
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                This information is required for clinical placements and lab
                safety.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Allergies (if any)</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Current Medications (if any)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="medications"
                value={formData.medications}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Medical Conditions (if any)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Emergency Contact Name
              </Typography>
              <TextField
                required
                fullWidth
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                error={errors.emergencyContact}
                helperText={
                  errors.emergencyContact ? "Emergency contact is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Emergency Contact Phone
              </Typography>
              <TextField
                required
                fullWidth
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                error={errors.emergencyPhone}
                helperText={
                  errors.emergencyPhone ? "Emergency phone is required" : ""
                }
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <FileUploadForm
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Review Your Application
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Personal Information</Typography>
              <Typography>
                Name: {formData.firstName} {formData.lastName}
              </Typography>
              <Typography>Date of Birth: {formData.dob}</Typography>
              <Typography>Email: {formData.email}</Typography>
              <Typography>Phone: {formData.phone}</Typography>
              <Typography>
                Address: {formData.address}, {formData.city}, {formData.state}{" "}
                {formData.zipCode}, {formData.country}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6">Academic Background</Typography>
              <Typography>
                Secondary School: {formData.secondarySchool}
              </Typography>

              {/* Examination Information */}
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Examination Details:
              </Typography>
              <Typography>Type: {formData.examType}</Typography>
              <Typography>Year: {formData.examYear}</Typography>

              {/* Examination Subjects */}
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Subjects:
              </Typography>
              {[...Array(9)].map((_, index) => {
                const subjectName =
                  formData[`subject${index + 1}Name` as keyof FormData];
                const subjectGrade =
                  formData[`subject${index + 1}Grade` as keyof FormData];

                return subjectName && subjectGrade ? (
                  <Typography key={index}>
                    {subjectName}: {subjectGrade}
                  </Typography>
                ) : null;
              })}
              <Typography>College: {formData.highSchool}</Typography>
              <Typography>
                Graduation Year: {formData.graduationYear}
              </Typography>
              <Typography>GPA: {formData.gpa}</Typography>
              {formData.satScore && (
                <Typography>SAT Score: {formData.satScore}</Typography>
              )}
              {formData.actScore && (
                <Typography>ACT Score: {formData.actScore}</Typography>
              )}
              {formData.previousCollege && (
                <Typography>
                  Previous College: Yes - {formData.collegeCourses}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6">Program Information</Typography>
              <Typography>
                Department:{" "}
                {departments.find((d) => d._id === formData.departmentId)?.name}
              </Typography>
              <Typography>
                Program: {program.find((c) => c._id === formData.programId)?.name}
              </Typography>
              <Typography>Start Term: {formData.startTerm}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6">Health Information</Typography>
              {formData.allergies && (
                <Typography>Allergies: {formData.allergies}</Typography>
              )}
              {formData.medications && (
                <Typography>Medications: {formData.medications}</Typography>
              )}
              {formData.conditions && (
                <Typography>
                  Medical Conditions: {formData.conditions}
                </Typography>
              )}
              <Typography>
                Emergency Contact: {formData.emergencyContact} (
                {formData.emergencyPhone})
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6">Documents</Typography>
              <Typography>
                Secondary School Result:{" "}
                {formData.secondarySchoolResultFile
                  ? formData.secondarySchoolResultFile.name
                  : "Not uploaded"}
              </Typography>
              <Typography>
                Birth Certificate:{" "}
                {formData.birthCertificateFile
                  ? formData.birthCertificateFile.name
                  : "Not uploaded"}
              </Typography>
              <Typography>
                National ID:{" "}
                {formData.nationalIdFile
                  ? formData.nationalIdFile.name
                  : "Not uploaded"}
              </Typography>
              <Typography>
                Primary Certificate:{" "}
                {formData.primaryCertificateFile
                  ? formData.primaryCertificateFile.name
                  : "Not uploaded"}
              </Typography>
              <Typography>
                Official High School Transcript:{" "}
                {formData.transcriptFile
                  ? formData.transcriptFile.name
                  : "Not uploaded"}
              </Typography>
              <Typography>
                Recommendation Letters: {formData.recommendationLetters}
              </Typography>
              <Typography>
                Personal Statement:{" "}
                {formData.personalStatementFile
                  ? formData.personalStatementFile.name
                  : "Not uploaded"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    sx={{
                      color: "#f7ba34",
                      "&.Mui-checked": {
                        color: "#f7ba34",
                      },
                    }}
                    checked={formData.agreeTerms}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeTerms: !prev.agreeTerms,
                      }))
                    }
                  />
                }
                label="I certify that the information provided is accurate and complete to the best of my knowledge."
              />
              {errors.agreeTerms && (
                <Typography color="error" variant="caption" display="block">
                  You must agree to the terms to submit
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          JICOHSAT ONLINE FORM
        </Typography>

        <Stepper
          sx={{
            "& .MuiStepIcon-root.Mui-active": {
              color: "#f7ba34",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#f7ba34",
            },
          }}
          activeStep={activeStep}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {activeStep !== 0 && (
              <Button
                sx={{
                  mt: 3,
                  ml: 1,
                  backgroundColor: "#69a79c",
                  "&:hover": {
                    backgroundColor: "#f7ba34",
                  },
                  color: "#fff",
                }}
                onClick={handleBack}
              >
                Back
              </Button>
            )}

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  ml: 1,
                  backgroundColor: "#f7ba34",
                  "&:hover": {
                    backgroundColor: "#e0a82a",
                  },
                  color: "#fff",
                }}
                className={`${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={!formData.agreeTerms}
              >
                {loading ? "Submitting...." : "Submit Application"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  mt: 3,
                  ml: 1,
                  backgroundColor: "#f7ba34",
                  "&:hover": {
                    backgroundColor: "#e0a82a", // A slightly darker shade for hover
                  },
                  color: "#fff", // Black text
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplicationForm;
