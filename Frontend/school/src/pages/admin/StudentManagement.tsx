// import React, { useState, useEffect } from "react";
// import {
//   CreateStudents,
//   createParent,
//   CreateClass,
//   CreateAddress,
//   UpdateStudent,
//   UpdateParents,
//   UpdateAddress,
//   UpdateClass
// } from "../../services/authapi";
// import { showToast } from "../../utils/toast";
// import { useTheme } from "../../components/layout/ThemeContext";
// import { AxiosError } from "axios";
// import { FormLayout } from "../../components/Form/FormLayout";
// import { ParentInfo } from "../../components/Form/Parents/ParentInfoProps ";
// import { AddressInfo } from "../../components/Form/Address/AddressInfoProps ";
// import { ClassInfo } from "../../components/Form/ClassControll/Classcheck";
// import { StudentInfo } from "../../components/Form/Student/StudentInfoProps";
// import type { Student } from "../admin/StudentList";

// interface AddStudentFormProps {
//   onSuccess?: () => void;
//   onClose?: () => void;
//   student?: Student;
// }

// export function AddStudentForm({ onSuccess, onClose, student }: AddStudentFormProps) {
//   const { isDark } = useTheme();
//   const [loading, setLoading] = useState(false);

//   const [fullName, setFullName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
//   const [photos, setPhotos] = useState<File[]>([]);
//   const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);


//   const [parentId, setParentId] = useState("");
//   const [parentName, setParentName] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [parentEmail, setParentEmail] = useState("");
//   const [parentRelationship, setParentRelationship] = useState<"Son" | "Daughter">("Son");

//   const [addressId, setAddressId] = useState("");
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [pincode, setPincode] = useState("");

//   const [classId, setClassId] = useState("");
//   const [className, setClassName] = useState<string>("1");
//   const [division, setDivision] = useState<"A" | "B" | "C" | "D">("A");


//   useEffect(() => {
//     if (!student) return;

//     setFullName(student.fullName || "");

//     if (student?.dateOfBirth) {
//       const dob = new Date(student.dateOfBirth);
//       const yyyy = dob.getFullYear();
//       const mm = String(dob.getMonth() + 1).padStart(2, "0");
//       const dd = String(dob.getDate()).padStart(2, "0");
//       setDateOfBirth(`${yyyy}-${mm}-${dd}`);
//     } else {
//       setDateOfBirth("");
//     }

//     setGender(student.gender || "Male");

//     // Parent
//     if (student.parent?._id) {
//       setParentId(student.parent._id);
//       setParentName(student.parent.name || "");
//       setWhatsappNumber(student.parent.whatsappNumber || "");
//       setParentEmail(student.parent.email || "");
//       setParentRelationship(student.parent.relationship || "Son");
//     } else if (student.guardian?.id) {
//       setParentId(student.guardian.id);
//       setParentName(student.guardian.name || "");
//       setWhatsappNumber(student.guardian.phone || "");
//       setParentEmail("");
//       setParentRelationship("Son");
//     } else {
//       setParentId("");
//       setParentName("");
//       setWhatsappNumber("");
//       setParentEmail("");
//       setParentRelationship("Son");
//     }

//     // Address
//     setAddressId(student.address?._id || "");
//     setStreet(student.address?.street || "");
//     setCity(student.address?.city || "");
//     setState(student.address?.state || "");
//     setPincode(student.address?.pincode || "");

//     // Class
//     setClassId(student.classDetails?._id || "");
//     setClassName(student.classDetails?.className || "1");

//     // Photos
//     setPhotoPreviews(student.photos?.map((p) => p.url) || []);
//     setPhotos([]);
//   }, [student]);

//   // Photo management
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setPhotos((prev) => [...prev, ...filesArray]);

//       const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
//       setPhotoPreviews((prev) => [...prev, ...previewUrls]);
//     }
//   };

//   const handleRemovePhoto = (index: number) => {
//     setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
//     setPhotos((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (student) {
//         // Update existing student
//         await UpdateParents(parentId, parentName, whatsappNumber, parentEmail, parentRelationship);
//         await UpdateAddress(addressId, street, city, state, pincode);
//         await UpdateClass(student?.classDetails?._id || classId, className);

//         await UpdateStudent(student._id, fullName, dateOfBirth, gender, parentId, addressId, classId, photos);
//         showToast("Student updated successfully", "success");
//       } else {
//         // Create new student

//         // Parent
//         const parentResponse = await createParent({
//           name: parentName,
//           contactNumber: whatsappNumber,
//           whatsappNumber,
//           email: parentEmail,
//           relationship: parentRelationship
//         });
//         if (!parentResponse?.parent?._id) throw new Error("Failed to create parent.");
//         const parentIdNew = parentResponse.parent._id;

//         // Address
//         const addressResponse = await CreateAddress({ street, city, state, pincode });
//         if (!addressResponse?.address?._id) throw new Error("Failed to create address.");
//         const addressIdNew = addressResponse.address._id;

//         // Class (division auto-assigned by backend)
//         const classResponse = await CreateClass({ className });
//         if (!classResponse?.class?._id) throw new Error("Failed to create class.");
//         const classIdNew = classResponse.class._id;

//         // Student
//         const { student: newStudent, tempPassword } = await CreateStudents(
//           fullName,
//           dateOfBirth,
//           gender,
//           parentIdNew,
//           addressIdNew,
//           classIdNew,
//           photos
//         );

//         showToast(
//           `Student created in ${classResponse.class.className}${classResponse.class.division}. Temp Password: ${tempPassword}`,
//           "success"
//         );
//       }

//       // Clear form
//       setFullName("");
//       setDateOfBirth("");
//       setGender("Male");
//       setParentName("");
//       setWhatsappNumber("");
//       setParentEmail("");
//       setParentRelationship("Son");
//       setStreet("");
//       setCity("");
//       setState("");
//       setPincode("");
//       setClassName("1");
//       setPhotos([]);
//       setPhotoPreviews([]);

//       onSuccess?.();
//       onClose?.();
//     } catch (error: unknown) {
//       const err = error as AxiosError<{ message: string }>;
//       const message =
//         err.response?.data?.message || (error as Error).message || "Error Creating/Updating Student";
//       showToast(message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormLayout onSubmit={handleSubmit}>
//       <StudentInfo
//         fullName={fullName}
//         setFullName={setFullName}
//         dateOfBirth={dateOfBirth}
//         setDateOfBirth={setDateOfBirth}
//         gender={gender}
//         setGender={setGender}
//         photos={photos}
//         setPhotos={setPhotos}
//         photoPreviews={photoPreviews}
//         setPhotoPreviews={setPhotoPreviews}
//         handleFileChange={handleFileChange}
//         handleRemovePhoto={handleRemovePhoto}
//         isDark={isDark}
//       />
//       <ParentInfo
//         parentName={parentName}
//         setParentName={setParentName}
//         whatsappNumber={whatsappNumber}
//         setWhatsappNumber={setWhatsappNumber}
//         parentEmail={parentEmail}
//         setParentEmail={setParentEmail}
//         parentRelationship={parentRelationship}
//         setParentRelationship={setParentRelationship}
//         isDark={isDark}
//       />
//       <AddressInfo
//         street={street}
//         setStreet={setStreet}
//         state={state}
//         setState={setState}
//         city={city}
//         setCity={setCity}
//         pincode={pincode}
//         setPincode={setPincode}
//         isDark={isDark}
//       />
//    <ClassInfo
//          className={className as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"}
//        setClassName={setClassName as React.Dispatch<React.SetStateAction<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10">>}
//          division={division}
//        setDivision={setDivision}
//      isDark={isDark}
//    />

 
//     </FormLayout>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  CreateStudents,
  createParent,
  CreateAddress,
  UpdateStudent,
  UpdateParents,
  UpdateAddress,
  GetAllClass
} from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { AxiosError } from "axios";
import { FormLayout } from "../../components/Form/FormLayout";
import { ParentInfo } from "../../components/Form/Parents/ParentInfoProps ";
import { AddressInfo } from "../../components/Form/Address/AddressInfoProps ";
import { StudentInfo } from "../../components/Form/Student/StudentInfoProps";
import { ClassInfo } from "../../components/Form/ClassControll/Classcheck"; 
import type { Student } from "../admin/StudentList";

interface AddStudentFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  student?: Student;
}

export function AddStudentForm({ onSuccess, onClose, student }: AddStudentFormProps) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);


  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male"|"Female"|"Other">("Male");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);


  const [parentId, setParentId] = useState("");
  const [parentName, setParentName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentRelationship, setParentRelationship] = useState<"Son"|"Daughter">("Son");


  const [addressId, setAddressId] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [classId, setClassId] = useState("");
  const [classOptions, setClassOptions] = useState<{ _id:string; className:string; division:string }[]>([]);

  
useEffect(() => {
  const fetchClasses = async () => {
    try {
      const classesFromAPI = await GetAllClass();
      console.log("classes",classesFromAPI)
      const mapped = classesFromAPI.data.map((cls:{_id:string,className:string,division:string}) => ({
        _id: cls._id,
        className: cls.className,
        division: cls.division
      }));
      setClassOptions(mapped);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };
  fetchClasses();
}, []);


  useEffect(() => {
    if (!student) return;

    setFullName(student.fullName || "");
    if (student.dateOfBirth) {
      const dob = new Date(student.dateOfBirth);
      setDateOfBirth(`${dob.getFullYear()}-${String(dob.getMonth()+1).padStart(2,'0')}-${String(dob.getDate()).padStart(2,'0')}`);
    }
    setGender(student.gender || "Male");

    if (student.parent?._id) {
      setParentId(student.parent._id);
      setParentName(student.parent.name || "");
      setWhatsappNumber(student.parent.whatsappNumber || "");
      setParentEmail(student.parent.email || "");
      setParentRelationship(student.parent.relationship || "Son");
    }

    setAddressId(student.address?._id || "");
    setStreet(student.address?.street || "");
    setCity(student.address?.city || "");
    setState(student.address?.state || "");
    setPincode(student.address?.pincode || "");

    if (student.classDetails?._id && classOptions.length > 0) {
      const cls = classOptions.find(c => c._id === student.classDetails._id);
      console.log(cls)
      if (cls) setClassId(cls._id);
    }

    setPhotoPreviews(student.photos?.map(p => p.url) || []);
    setPhotos([]);
  }, [student, classOptions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...filesArray]);
      setPhotoPreviews(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleRemovePhoto = (index:number) => {
    setPhotoPreviews(prev => prev.filter((_,i)=>i!==index));
    setPhotos(prev => prev.filter((_,i)=>i!==index));
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!classId) return showToast("Select a class", "info"); 

    setLoading(true);
    try {
      if (student) {
        await UpdateParents(parentId, parentName, whatsappNumber, parentEmail, parentRelationship);
        await UpdateAddress(addressId, street, city, state, pincode);
        await UpdateStudent(student._id, fullName, dateOfBirth, gender, parentId, addressId, classId, photos);
        showToast("Student updated successfully", "success");
      } else {
        const parentRes = await createParent({ name:parentName, contactNumber:whatsappNumber, whatsappNumber, email:parentEmail, relationship:parentRelationship });
        if (!parentRes?.parent?._id) throw new Error("Parent creation failed");
        const parentIdNew = parentRes.parent._id;

        const addressRes = await CreateAddress({ street, city, state, pincode });
        if (!addressRes?.address?._id) throw new Error("Address creation failed");
        const addressIdNew = addressRes.address._id;

        const { student:newStudent, tempPassword } = await CreateStudents(
          fullName, dateOfBirth, gender, parentIdNew, addressIdNew, classId, photos
        );
        showToast(`Student created successfully. Temp Password: ${tempPassword}`, "success");
      }

      // Reset form
      setFullName(""); setDateOfBirth(""); setGender("Male");
      setParentName(""); setWhatsappNumber(""); setParentEmail(""); setParentRelationship("Son");
      setStreet(""); setCity(""); setState(""); setPincode("");
      setClassId(""); setPhotos([]); setPhotoPreviews([]);

      onSuccess?.(); onClose?.();
    } catch (error) {
      const err = error as AxiosError<{ message:string }>;
      const message = err.response?.data?.message || (error as Error).message || "Error Creating/Updating Student";
      showToast(message,"error");
    } finally { setLoading(false); }
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      <StudentInfo
        fullName={fullName} setFullName={setFullName}
        dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth}
        gender={gender} setGender={setGender}
        photos={photos} setPhotos={setPhotos}
        photoPreviews={photoPreviews} setPhotoPreviews={setPhotoPreviews}
        handleFileChange={handleFileChange} handleRemovePhoto={handleRemovePhoto}
        isDark={isDark}
      />
      <ParentInfo
        parentName={parentName} setParentName={setParentName}
        whatsappNumber={whatsappNumber} setWhatsappNumber={setWhatsappNumber}
        parentEmail={parentEmail} setParentEmail={setParentEmail}
        parentRelationship={parentRelationship} setParentRelationship={setParentRelationship}
        isDark={isDark}
      />
      <AddressInfo
        street={street} setStreet={setStreet}
        state={state} setState={setState}
        city={city} setCity={setCity}
        pincode={pincode} setPincode={setPincode}
        isDark={isDark}
      />
      <ClassInfo
        mode="selectClassId"
        classOptions={classOptions}
        classId={classId}
        setClassId={setClassId}
        isDark={isDark}
      />
    </FormLayout>
  );
}
