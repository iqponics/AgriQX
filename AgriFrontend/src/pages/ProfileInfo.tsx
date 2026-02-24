import React, { useState, useEffect } from 'react';
import { Pencil, User, X } from 'lucide-react';
import EducationModal from '../components/EducationModal';
import IntroductionModal from '../components/IntroductionModal';
import ProfessionalModal from '../components/ProfessionalModal';
import ExperienceModal from '../components/ExperienceModal';
import { jwtDecode } from 'jwt-decode';
import { useApi } from '../hooks/useApi';

// Types for profile data
interface Education {
  institute: string;
  degreeName?: string;
  startDate?: string;
  endDate?: string;
  course?: string;
  present?: boolean;
}

interface Professional {
  barCouncilNumber?: string;
  practiceArea?: string;
  extraCertificates?: string;
  languages?: string;
}

interface Experience {
  companyName: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  present?: boolean;
}

interface ProfileData {
  firstname: string;
  lastname: string;
  summary: string;
  birthDate?: string;
  profilePic?: string;
  education: Education[];
  professional: Professional[];
  experience: Experience[];
}

const ProfileInfo: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const authToken = localStorage.getItem('authToken');
  const { fetchData } = useApi();

  // Decode the token to get user ID
  useEffect(() => {
    if (authToken) {
      if (authToken.split('.').length !== 3) {
        console.error('Stored auth token is invalid or malformed');
        return;
      }
      try {
        const decodedToken: any = jwtDecode(authToken);
        console.log('Decoded Token:', decodedToken);
        setUserId(decodedToken.id);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    } else {
      console.error('Auth token is not present in localStorage');
    }
  }, [authToken]);

  // Profile state now holds first and last name separately
  const [profileData, setProfileData] = useState<ProfileData>({
    firstname: '',
    lastname: '',
    summary: '',
    profilePic: '',
    education: [],
    professional: [],
    experience: [],
  });

  // Modal states
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [showSidebar]);

  // Form state for Introduction
  const [introForm, setIntroForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    summary: '',
    profilePic: '',
  });

  const [educationForm, setEducationForm] = useState<Education>({
    institute: '',
    degreeName: '',
    startDate: '',
    endDate: '',
    course: '',
    present: false,
  });

  const [professionalForm, setProfessionalForm] = useState<Professional>({
    barCouncilNumber: '',
    practiceArea: '',
    extraCertificates: '',
    languages: '',
  });

  const [experienceForm, setExperienceForm] = useState<Experience>({
    companyName: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    present: false,
  });

  // Fetch profile data when userId is set
  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) {
        console.error('User ID is missing');
        return;
      }
      try {
        const data = await fetchData<unknown, ProfileData>(`/users/${userId}`, 'GET');
        console.log('Profile data fetched:', data);
        setProfileData(data);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    };

    if (userId) {
      loadProfileData();
    }
  }, [userId, authToken]);

  // Handle intro form submission using fetch
  const handleIntroSubmit = async () => {
    try {
      // Map form keys to schema keys
      const payload = {
        firstname: introForm.firstName,
        lastname: introForm.lastName,
        birthDate: introForm.birthDate,
        summary: introForm.summary,
        profilePic: introForm.profilePic,
      };

      const result = await fetchData<typeof payload, any>(`/users/${userId}`, 'PUT', {
        body: payload,
      });

      console.log('Intro update response:', result);


      // Update local state to reflect the changes
      setProfileData((prev) => ({
        ...prev,
        firstname: introForm.firstName,
        lastname: introForm.lastName,
        birthDate: introForm.birthDate,
        summary: introForm.summary,
        profilePic: introForm.profilePic,
      }));

      setShowIntroModal(false);
    } catch (err) {
      console.error('Failed to save intro:', err);
    }
  };


  const handleEducationSubmit = async () => {
    const newEducation = { ...educationForm };
    try {
      const result = await fetchData<{ education: Education[] }, any>(`/users/${userId}`, 'PUT', {
        body: {
          education: [...(profileData.education || []), newEducation],
        },
      });
      console.log('Education update response:', result);

      setProfileData((prev) => ({
        ...prev,
        education: [...(prev.education || []), newEducation],
      }));
      setShowEducationModal(false);
    } catch (err) {
      console.error('Failed to save education:', err);
    }
  };

  const handleProfessionalSubmit = async () => {
    const newProfessional = { ...professionalForm };
    try {
      const result = await fetchData<{ professional: Professional[] }, any>(`/users/${userId}`, 'PUT', {
        body: { professional: [newProfessional] },
      });
      console.log('Professional update response:', result);

      setProfileData((prev) => ({
        ...prev,
        professional: [newProfessional],
      }));
      setShowProfessionalModal(false);
    } catch (err) {
      console.error('Failed to save professional info:', err);
    }
  };


  const handleExperienceSubmit = async () => {
    const newExperience = { ...experienceForm };
    try {
      const result = await fetchData<{ experience: Experience[] }, any>(`/users/${userId}`, 'PUT', {
        body: {
          experience: [...(profileData.experience || []), newExperience],
        },
      });
      console.log('Experience update response:', result);

      setProfileData((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), newExperience],
      }));
      setShowExperienceModal(false);
    } catch (err) {
      console.error('Failed to save experience:', err);
    }
  };

  // Handle image upload using fetch with FormData
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await fetchData<FormData, any>(`/upload/${userId}`, 'POST', {
        body: formData,
      });

      if (!result.url) {
        throw new Error('Image upload failed');
      }
      // Update UI optimistically
      setProfileData((prev) => ({ ...prev, profilePic: result.url }));
      await fetchData<{ profilePic: string }, any>(`/users/${userId}`, 'PUT', {
        body: { profilePic: result.url },
      });
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 via-purple-950 to-black p-4 pt-24 md:px-24 relative">
      {/* Mobile Sidebar Toggle Button */}
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-leaf-600 text-white p-4 rounded-full shadow-2xl hover:bg-leaf-700 transition-all active:scale-95"
      >
        <Pencil size={24} />
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Backdrop for mobile */}
        {showSidebar && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-[70] w-[280px] bg-midnight-900 border-r border-purple-500/20 p-8 transform transition-transform duration-300 ease-in-out md:relative md:inset-0 md:transform-none md:z-10 md:w-1/4 md:bg-transparent md:border-none md:p-0
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="card h-full md:h-auto overflow-y-auto">
            <div className="flex items-center justify-between mb-8 md:mb-4">
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-2 border-2 border-purple-500/30 shadow-lg">
                  <User className="text-white" size={32} />
                </div>
                <h3 className="text-gray-100 font-bold md:hidden">My Profile</h3>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-leaf-600 py-3 border-b border-leaf-500/20 hover:bg-leaf-50 px-2 rounded-lg transition-colors cursor-pointer group" onClick={() => { setShowIntroModal(true); setShowSidebar(false); }}>
                <span className="font-bold">Introduction</span>
                <Pencil size={16} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex justify-between items-center text-leaf-600 py-3 border-b border-leaf-500/20 hover:bg-leaf-50 px-2 rounded-lg transition-colors cursor-pointer group" onClick={() => { setShowEducationModal(true); setShowSidebar(false); }}>
                <span className="font-bold">Education</span>
                <Pencil size={16} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex justify-between items-center text-leaf-600 py-3 border-b border-leaf-500/20 hover:bg-leaf-50 px-2 rounded-lg transition-colors cursor-pointer group" onClick={() => { setShowProfessionalModal(true); setShowSidebar(false); }}>
                <span className="font-bold">Professional</span>
                <Pencil size={16} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex justify-between items-center text-leaf-600 py-3 border-b border-leaf-500/20 hover:bg-leaf-50 px-2 rounded-lg transition-colors cursor-pointer group" onClick={() => { setShowExperienceModal(true); setShowSidebar(false); }}>
                <span className="font-bold">Experience</span>
                <Pencil size={16} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* Profile section */}
          <div className="card relative">
            <button
              onClick={() => setShowIntroModal(true)}
              className="absolute top-4 right-4 text-green-500"
            >
              <Pencil size={18} />
            </button>
            <div className="flex flex-col items-center">
              {profileData.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt={`${profileData.firstname} ${profileData.lastname}`}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border-2 border-purple-500/30">
                  <User className="text-white" size={40} />
                </div>
              )}
              <h2 className="text-xl font-semibold text-leaf-600 mb-2">
                {profileData.firstname || 'First Name'} {profileData.lastname || 'Last Name'}
              </h2>
              <p className="text-center text-gray-300 max-w-2xl">
                {profileData.summary || 'About'}
              </p>
            </div>
          </div>

          {/* Education section */}
          <div className="card relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-leaf-600">Education</h3>
              <button onClick={() => setShowEducationModal(true)} className="text-leaf-600 hover:text-leaf-700">
                <Pencil size={18} />
              </button>
            </div>
            {profileData.education.length > 0 ? (
              <div className="space-y-4 text-lg">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-leaf-500 pl-4">
                    <h4 className="font-medium text-leaf-600">Institute Name : {edu.institute}</h4>
                    <p className="text-sm text-gray-300">Degree Name : {edu.degreeName}</p>
                    <p className="text-xs text-gray-400">
                      Duration : {edu.startDate} - {edu.present ? 'Present' : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No education information added yet
              </div>
            )}
          </div>

          {/* Professional section */}
          <div className="card relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-leaf-600">Professional</h3>
              <button onClick={() => setShowProfessionalModal(true)} className="text-leaf-600 hover:text-leaf-700">
                <Pencil size={18} />
              </button>
            </div>
            {profileData.professional.length > 0 ? (
              <div className="space-y-4 text-lg">
                {profileData.professional.map((prof, index) => (
                  <div key={index} className="border-l-4 border-leaf-500 pl-4">
                    {prof.barCouncilNumber && (
                      <p className="text-sm text-gray-600">
                        Bar Council Number : {prof.barCouncilNumber}
                      </p>
                    )}
                    {prof.practiceArea && (
                      <p className="text-sm text-gray-600">
                        Practice Area : {prof.practiceArea}
                      </p>
                    )}
                    {prof.extraCertificates && (
                      <p className="text-sm text-gray-600">
                        Extra Certificates : {prof.extraCertificates}
                      </p>
                    )}
                    {prof.languages && (
                      <p className="text-sm text-gray-600">
                        Languages Known : {prof.languages}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No professional information added yet
              </div>
            )}
          </div>

          {/* Experience section */}
          <div className="card relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-leaf-600">Experience</h3>
              <button onClick={() => setShowExperienceModal(true)} className="text-leaf-600 hover:text-leaf-700">
                <Pencil size={18} />
              </button>
            </div>
            {profileData.experience.length > 0 ? (
              <div className="space-y-4 text-lg">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-leaf-500 pl-4">
                    <h4 className="font-medium text-leaf-600">Company Name: {exp.companyName}</h4>
                    <p className="text-sm text-gray-300">Role : {exp.role}</p>
                    <p className="text-xs text-gray-400">
                      Duration : {exp.startDate} - {exp.present ? 'Present' : exp.endDate}
                    </p>
                    <p className="text-sm text-gray-600">Description : {exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No experience information added yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <IntroductionModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        formData={introForm}
        onChange={setIntroForm}
        onSubmit={handleIntroSubmit}
        onImageUpload={handleImageUpload}
      />
      <EducationModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        formData={educationForm}
        onChange={setEducationForm}
        onSubmit={handleEducationSubmit}
      />
      <ProfessionalModal
        isOpen={showProfessionalModal}
        onClose={() => setShowProfessionalModal(false)}
        formData={professionalForm}
        onChange={setProfessionalForm}
        onSubmit={handleProfessionalSubmit}
      />
      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        formData={experienceForm}
        onChange={setExperienceForm}
        onSubmit={handleExperienceSubmit}
      />
    </div>
  );
};

export default ProfileInfo;