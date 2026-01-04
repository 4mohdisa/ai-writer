import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CoverLetterState {
  generatedLetter: string
  currentLetterId: string | null
  isLoading: boolean
  error: string | null
  lastGenerated: string | null
}

const initialState: CoverLetterState = {
  generatedLetter: '',
  currentLetterId: null,
  isLoading: false,
  error: null,
  lastGenerated: null,
}

const coverLetterSlice = createSlice({
  name: 'coverLetter',
  initialState,
  reducers: {
    setGeneratedLetter: (state, action: PayloadAction<string>) => {
      state.generatedLetter = action.payload
      state.lastGenerated = new Date().toISOString()
      state.error = null
    },
    setCurrentLetterId: (state, action: PayloadAction<string>) => {
      state.currentLetterId = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    clearCoverLetter: (state) => {
      state.generatedLetter = ''
      state.currentLetterId = null
      state.error = null
      state.lastGenerated = null
    },
  },
})

export const {
  setGeneratedLetter,
  setCurrentLetterId,
  setLoading,
  setError,
  clearError,
  clearCoverLetter,
} = coverLetterSlice.actions

export default coverLetterSlice.reducer
