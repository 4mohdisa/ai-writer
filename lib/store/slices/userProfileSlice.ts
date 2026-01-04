import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WorkExperience {
  company: string
  position: string
  duration: string
  responsibilities: string[]
  achievements: string[]
}

interface Education {
  institution: string
  degree: string
  field: string
  graduationYear: string
}

interface UserProfile {
  userName: string
  email: string
  phone: string
  professionalSummary: string
  keySkills: string
  workExperience: WorkExperience[]
  education: Education[]
  certifications: string[]
  projects: string[]
  totalYearsExperience: string
}

interface UserProfileState {
  profile: UserProfile
  lastUpdated: string | null
}

const initialState: UserProfileState = {
  profile: {
    userName: '',
    email: '',
    phone: '',
    professionalSummary: '',
    keySkills: '',
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    totalYearsExperience: '',
  },
  lastUpdated: null,
}

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload }
      state.lastUpdated = new Date().toISOString()
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.profile.userName = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.profile.email = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updatePhone: (state, action: PayloadAction<string>) => {
      state.profile.phone = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateProfessionalSummary: (state, action: PayloadAction<string>) => {
      state.profile.professionalSummary = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateKeySkills: (state, action: PayloadAction<string>) => {
      state.profile.keySkills = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateWorkExperienceText: (state, action: PayloadAction<string>) => {
      // Store as text in a temporary field or parse it
      // For now, we'll keep the structured data but allow text editing
      state.lastUpdated = new Date().toISOString()
    },
    updateEducationText: (state, action: PayloadAction<string>) => {
      state.lastUpdated = new Date().toISOString()
    },
    updateCertificationsText: (state, action: PayloadAction<string>) => {
      // Parse comma-separated string to array
      state.profile.certifications = action.payload.split(',').map(c => c.trim()).filter(c => c)
      state.lastUpdated = new Date().toISOString()
    },
    updateProjectsText: (state, action: PayloadAction<string>) => {
      // Parse newline-separated string to array
      state.profile.projects = action.payload.split('\n').map(p => p.trim()).filter(p => p)
      state.lastUpdated = new Date().toISOString()
    },
    clearUserProfile: (state) => {
      state.profile = initialState.profile
      state.lastUpdated = null
    },
  },
})

export const {
  setUserProfile,
  updateUserName,
  updateEmail,
  updatePhone,
  updateProfessionalSummary,
  updateKeySkills,
  updateWorkExperienceText,
  updateEducationText,
  updateCertificationsText,
  updateProjectsText,
  clearUserProfile,
} = userProfileSlice.actions

export default userProfileSlice.reducer
