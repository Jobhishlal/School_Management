import React, { useState } from "react";
import { CreateStudents, createParent, CreateClass, CreateAddress } from "../../services/authapi";
import { DefaultSubjects } from "../../constants/Defaultsubject"; 

export function StudentManagement() {

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [studentId, setStudentId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentRelationship, setParentRelationship] = useState<"Son" | "Daughter">("Son");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

 
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState<"LP" | "UP" | "HS">("LP");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value as "LP" | "UP" | "HS");
    setSelectedSubjects([]); 
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedSubjects(selectedOptions);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
  
    const parentData = {
      name: parentName,
      contactNumber: parentContact,
      whatsappNumber: parentContact,
      email: parentEmail,
      relationship: parentRelationship,
    };
    const parentResponse = await createParent(parentData);
    console.log("parent",parentResponse)

    if (!parentResponse || !parentResponse.parent?._id) {
      console.error("Parent creation failed", parentResponse);
      alert("Failed to create parent. Check logs.");
      return;
    }
  const parentId = parentResponse.parent._id;
  console.log("parentId",parentId)

    const addressData = { street, city, state, pincode };
    const addressResponse = await CreateAddress(addressData);
    console.log(addressResponse)

    if (!addressResponse || !addressResponse.address?._id) {
      console.error("Address creation failed", addressResponse);
      alert("Failed to create address. Check logs.");
      return;
    }
    const addressId = addressResponse.address._id;
    console.log("address",addressId)

    const classData = {
      className,
      division,
      department,
      rollNumber,
      subjects: selectedSubjects,
    };
    const classResponse = await CreateClass(classData);
    console.log("class",classResponse)

    if (!classResponse || !classResponse.class?._id) {
      console.error("Class creation failed", classResponse);
      alert("Failed to create class. Check logs.");
      return;
    }
    const classId = classResponse.class._id;

    
    const student = await CreateStudents(
      fullName,
      dateOfBirth,
      gender,
      studentId,
      parentId,
      addressId,
      classId,
      photos
    );

    console.log("Student created successfully", student);

    setFullName("");
    setDateOfBirth("");
    setGender("Male");
    setStudentId("");
    setParentName("");
    setParentContact("");
    setParentEmail("");
    setParentRelationship("Son");
    setStreet("");
    setCity("");
    setState("");
    setPincode("");
    setClassName("");
    setDivision("");
    setRollNumber("");
    setDepartment("LP");
    setSelectedSubjects([]);
    setPhotos([]);

  } catch (err: any) {
    console.error("Error creating student:", err);
    alert("Error creating student. Check console logs.");
  }
};

  const filteredSubjects = DefaultSubjects.filter(
    (subject) => subject.department === department
  );

  return (
    <div className="p-4">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Student Info */}
        <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
        <select value={gender} onChange={e => setGender(e.target.value as any)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" placeholder="Admission Number / Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
        <input type="file" multiple onChange={handleFileChange} />

        {/* Parent Info */}
        <h3>Parent Info</h3>
        <input type="text" placeholder="Parent Name" value={parentName} onChange={e => setParentName(e.target.value)} required />
        <input type="text" placeholder="Parent Contact" value={parentContact} onChange={e => setParentContact(e.target.value)} required />
        <input type="email" placeholder="Parent Email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
        <select value={parentRelationship} onChange={e => setParentRelationship(e.target.value as any)}>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
        </select>

        {/* Address Info */}
        <h3>Address Info</h3>
        <input type="text" placeholder="Street" value={street} onChange={e => setStreet(e.target.value)} required />
        <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
        <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} required />
        <input type="text" placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required />

        {/* Class Info */}
        <h3>Class Info</h3>
        <input type="text" placeholder="Class Name" value={className} onChange={e => setClassName(e.target.value)} required />
        <input type="text" placeholder="Division" value={division} onChange={e => setDivision(e.target.value)} required />
        <input type="text" placeholder="Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
        <select value={department} onChange={handleDepartmentChange}>
          <option value="LP">LP</option>
          <option value="UP">UP</option>
          <option value="HS">HS</option>
        </select>

        {/* Dynamic Subject Selection */}
        <h4>Select Subjects</h4>
        <select multiple value={selectedSubjects} onChange={handleSubjectChange}>
          {filteredSubjects.map((subject) => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Add Student</button>
      </form>
    </div>
  );
}

export default StudentManagement;