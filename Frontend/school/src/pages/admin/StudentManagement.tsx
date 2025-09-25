import React, { useState } from "react";
import { CreateStudents, createParent, CreateClass, CreateAddress } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";

import { AxiosError } from "axios";
import { FormLayout } from "../../components/Form/FormLayout";

import { ParentInfo } from "../../components/Form/Parents/ParentInfoProps ";
import { AddressInfo } from "../../components/Form/Address/AddressInfoProps ";
import { ClassInfo } from "../../components/Form/ClassControll/Classcheck";
import { StudentInfo } from "../../components/Form/Student/StudentInfoProps";


interface AddStudentFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AddStudentForm({ onSuccess, onClose }: AddStudentFormProps) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [photos, setPhotos] = useState<File[]>([]);
  const [parentName, setParentName] = useState("");
  const [whatsappNumber, SetwhatsappNumber] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentRelationship, setParentRelationship] = useState<"Son" | "Daughter">("Son");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [className, setClassName] = useState<"1" | "2" | "3" | "4" |"5"|"6"|"7"|"8"|"9"|"10">("1");

const [division, setDivision] = useState<"A" | "B" | "C" | "D">("A");

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); 

  setLoading(true);

  try {
    
    const parentData = {
      name: parentName,
      contactNumber: whatsappNumber,
      whatsappNumber,
      email: parentEmail,
      relationship: parentRelationship,
    };
    const parentResponse = await createParent(parentData);
    if (!parentResponse?.parent?._id) throw new Error("Failed to create parent.");
    const parentId = parentResponse.parent._id;

    const addressData = { street, city, state, pincode };
    const addressResponse = await CreateAddress(addressData);
    if (!addressResponse?.address?._id) throw new Error("Failed to create address.");
    const addressId = addressResponse.address._id;


    const classData = { className, division };
    const classResponse = await CreateClass(classData);
    if (!classResponse?.class?._id) throw new Error("Failed to create class.");
    const classId = classResponse.class._id;


    const { student, tempPassword } = await CreateStudents(
      fullName,
      dateOfBirth,
      gender,
      parentId,
      addressId,
      classId,
      photos
    );

    showToast(
      `Student created successfully! Student ID: ${student.studentId} Temporary Password: ${tempPassword}`,
      "success"
    );

    setFullName("");
    setDateOfBirth("");
    setGender("Male");
    setParentName("");
    SetwhatsappNumber("");
    setParentEmail("");
    setParentRelationship("Son");
    setStreet("");
    setCity("");
    setState("");
    setPincode("");
    setClassName("1");
    setDivision("A");
    setPhotos([]);



  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || (error as Error).message || "Error Creating Student";
    showToast(message, "error");
  } finally {
    setLoading(false);
  }
};



  

  return (

    <FormLayout onSubmit={handleSubmit}>

    <StudentInfo
    fullName={fullName}
    setFullName={setFullName}
    dateOfBirth={dateOfBirth}
    setDateOfBirth={setDateOfBirth}
    gender={gender}
    setGender={setGender}
    photos={photos}
    setPhotos={setPhotos}
    isDark={isDark} 
    
    />

    <ParentInfo
    parentName={parentName}
    setParentName={setParentName}
    whatsappNumber={whatsappNumber}
    setWhatsappNumber={SetwhatsappNumber}
    parentEmail={parentEmail}
    setParentEmail={setParentEmail}
    parentRelationship={parentRelationship}
    setParentRelationship={setParentRelationship}
     isDark={isDark}
  /> 
    <AddressInfo
    street={street}
    setStreet={setStreet}
    state={state}
    setState={setState}
    city={city}
    setCity={setCity}
    pincode={pincode}
    setPincode={setPincode}
    isDark={isDark}
    
    
    />
    <ClassInfo
    
  className={className}
  setClassName={setClassName}
  division={division}
  setDivision={setDivision}
  isDark={isDark} 

 
 
    />

    </FormLayout>

  );
}