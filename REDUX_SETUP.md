# Redux State Management Documentation

## Overview

CoverCraft now uses **Redux Toolkit** with **Redux Persist** for robust state management. User details are automatically saved and restored across sessions.

## Benefits

✅ **Automatic Persistence** - All user data saved to localStorage automatically  
✅ **Type Safety** - Full TypeScript support with typed hooks  
✅ **DevTools Integration** - Redux DevTools for debugging  
✅ **Centralized State** - Single source of truth for all app state  
✅ **Time-Travel Debugging** - Undo/redo capabilities in development  
✅ **Better Performance** - Optimized re-renders with Redux selectors  

## State Structure

The Redux store is divided into three slices:

### 1. User Profile Slice (`userProfile`)
Stores user's personal information that persists across sessions:
- `userName` - User's full name
- `email` - Email address
- `phone` - Phone number
- `professionalSummary` - Career summary
- `keySkills` - Comma-separated skills

### 2. Job Details Slice (`jobDetails`)
Stores current job application details:
- `jobTitle` - Position applying for
- `companyName` - Company name
- `jobDescription` - Full job description
- `extraNotes` - Additional notes
- `tone` - Writing tone preference

### 3. Cover Letter Slice (`coverLetter`)
Stores generated cover letter and metadata:
- `generatedLetter` - The generated text
- `currentLetterId` - ID for feedback system
- `isLoading` - Loading state
- `error` - Error messages
- `lastGenerated` - Timestamp

## File Structure

```
lib/store/
├── index.ts                      # Store configuration
├── hooks.ts                      # Typed Redux hooks
└── slices/
    ├── userProfileSlice.ts       # User profile state
    ├── jobDetailsSlice.ts        # Job details state
    └── coverLetterSlice.ts       # Cover letter state

components/providers/
└── ReduxProvider.tsx             # Redux + Persist wrapper
```

## Usage Examples

### Reading State

```typescript
import { useAppSelector } from '@/lib/store/hooks'

function MyComponent() {
  // Get user profile
  const userProfile = useAppSelector((state) => state.userProfile.profile)
  
  // Get specific field
  const userName = useAppSelector((state) => state.userProfile.profile.userName)
  
  // Get loading state
  const isLoading = useAppSelector((state) => state.coverLetter.isLoading)
}
```

### Updating State

```typescript
import { useAppDispatch } from '@/lib/store/hooks'
import { updateUserName, setUserProfile } from '@/lib/store/slices/userProfileSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  
  // Update single field
  const handleNameChange = (name: string) => {
    dispatch(updateUserName(name))
  }
  
  // Update multiple fields
  const handleProfileUpdate = () => {
    dispatch(setUserProfile({
      userName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }))
  }
}
```

### Available Actions

#### User Profile Actions
```typescript
import {
  setUserProfile,        // Set multiple fields at once
  updateUserName,        // Update name
  updateEmail,           // Update email
  updatePhone,           // Update phone
  updateProfessionalSummary,  // Update summary
  updateKeySkills,       // Update skills
  clearUserProfile,      // Clear all user data
} from '@/lib/store/slices/userProfileSlice'
```

#### Job Details Actions
```typescript
import {
  setJobDetails,         // Set multiple fields at once
  updateJobTitle,        // Update job title
  updateCompanyName,     // Update company
  updateJobDescription,  // Update description
  updateExtraNotes,      // Update notes
  updateTone,            // Update writing tone
  clearJobDetails,       // Clear all job data
} from '@/lib/store/slices/jobDetailsSlice'
```

#### Cover Letter Actions
```typescript
import {
  setGeneratedLetter,    // Set the generated letter
  setCurrentLetterId,    // Set letter ID for feedback
  setLoading,            // Set loading state
  setError,              // Set error message
  clearError,            // Clear error
  clearCoverLetter,      // Clear letter data
} from '@/lib/store/slices/coverLetterSlice'
```

## Persistence

Redux Persist automatically saves state to localStorage:

- **Storage Key**: `persist:covercraft-root`
- **Persisted Slices**: All three slices (userProfile, jobDetails, coverLetter)
- **Rehydration**: Automatic on app load
- **Serialization**: Handled automatically

### Clearing Persisted Data

To clear all persisted data:

```typescript
import { persistor } from '@/lib/store'

// Purge all persisted state
persistor.purge()

// Or clear localStorage manually
localStorage.removeItem('persist:covercraft-root')
```

## Redux DevTools

Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) for Chrome/Firefox to:

- Inspect state changes
- Time-travel debug
- Replay actions
- Export/import state

## Migration from localStorage

The old localStorage implementation has been replaced:

**Before:**
```typescript
const [formData, setFormData] = useState(initialFormData)

useEffect(() => {
  const saved = localStorage.getItem('coverLetterForm')
  if (saved) setFormData(JSON.parse(saved))
}, [])

useEffect(() => {
  localStorage.setItem('coverLetterForm', JSON.stringify(formData))
}, [formData])
```

**After:**
```typescript
const dispatch = useAppDispatch()
const userProfile = useAppSelector((state) => state.userProfile.profile)

// Updates automatically persist
dispatch(updateUserName('John Doe'))
```

## Best Practices

1. **Use Typed Hooks** - Always use `useAppDispatch` and `useAppSelector`
2. **Avoid Direct State Mutation** - Redux Toolkit uses Immer internally
3. **Keep Actions Simple** - One action per user interaction
4. **Selector Optimization** - Use specific selectors to prevent unnecessary re-renders
5. **Error Handling** - Always clear errors after handling them

## Testing

Test Redux components with:

```typescript
import { Provider } from 'react-redux'
import { store } from '@/lib/store'

function TestWrapper({ children }) {
  return <Provider store={store}>{children}</Provider>
}

// In tests
render(<MyComponent />, { wrapper: TestWrapper })
```

## Performance Optimization

Redux is already optimized, but you can further improve:

```typescript
// Use specific selectors instead of entire state
const userName = useAppSelector((state) => state.userProfile.profile.userName)

// Use memoized selectors for computed values
import { createSelector } from '@reduxjs/toolkit'

const selectFormData = createSelector(
  [(state) => state.userProfile.profile, (state) => state.jobDetails.currentJob],
  (profile, job) => ({ ...profile, ...job })
)
```

## Troubleshooting

### State Not Persisting
- Check browser localStorage is enabled
- Verify `PersistGate` is wrapping your app
- Check console for persistence errors

### State Not Updating
- Ensure you're dispatching actions, not mutating state directly
- Check Redux DevTools to see if actions are firing
- Verify selectors are correct

### TypeScript Errors
- Import from `@/lib/store/hooks` not `react-redux`
- Use `RootState` type for selectors
- Use `AppDispatch` type for dispatch

## Future Enhancements

- **Middleware** - Add logging or analytics middleware
- **RTK Query** - Replace fetch calls with RTK Query
- **Slice Splitting** - Split large slices into smaller ones
- **Normalized State** - Use normalization for complex data structures
- **Optimistic Updates** - Update UI before API response

---

**Note**: Redux Persist uses localStorage by default. For production with multiple users, consider using a database-backed session store.
