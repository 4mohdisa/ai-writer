import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ToneType } from '@/lib/utils'

interface JobDetails {
  jobTitle: string
  companyName: string
  jobDescription: string
  extraNotes: string
  tone: ToneType
}

interface JobDetailsState {
  currentJob: JobDetails
  lastUpdated: string | null
}

const initialState: JobDetailsState = {
  currentJob: {
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    extraNotes: '',
    tone: 'conversational',
  },
  lastUpdated: null,
}

const jobDetailsSlice = createSlice({
  name: 'jobDetails',
  initialState,
  reducers: {
    setJobDetails: (state, action: PayloadAction<Partial<JobDetails>>) => {
      state.currentJob = { ...state.currentJob, ...action.payload }
      state.lastUpdated = new Date().toISOString()
    },
    updateJobTitle: (state, action: PayloadAction<string>) => {
      state.currentJob.jobTitle = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateCompanyName: (state, action: PayloadAction<string>) => {
      state.currentJob.companyName = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateJobDescription: (state, action: PayloadAction<string>) => {
      state.currentJob.jobDescription = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateExtraNotes: (state, action: PayloadAction<string>) => {
      state.currentJob.extraNotes = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    updateTone: (state, action: PayloadAction<ToneType>) => {
      state.currentJob.tone = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    clearJobDetails: (state) => {
      state.currentJob = initialState.currentJob
      state.lastUpdated = null
    },
  },
})

export const {
  setJobDetails,
  updateJobTitle,
  updateCompanyName,
  updateJobDescription,
  updateExtraNotes,
  updateTone,
  clearJobDetails,
} = jobDetailsSlice.actions

export default jobDetailsSlice.reducer
