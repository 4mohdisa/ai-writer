"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
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
} from "@/lib/store/slices/userProfileSlice"
import {
  setJobDetails,
  updateJobTitle,
  updateCompanyName,
  updateJobDescription,
  updateExtraNotes,
  updateTone,
  clearJobDetails,
} from "@/lib/store/slices/jobDetailsSlice"
import {
  setGeneratedLetter as setReduxGeneratedLetter,
  setCurrentLetterId as setReduxCurrentLetterId,
  setLoading,
  setError as setReduxError,
  clearError,
  clearCoverLetter,
} from "@/lib/store/slices/coverLetterSlice"
import { 
  Sparkles, 
  User, 
  Briefcase, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2,
  FileText,
  Upload,
  Wand2,
  ArrowRight,
  Zap
} from "lucide-react"
import { InputField } from "@/components/ui/input-field"
import { TextAreaField } from "@/components/ui/textarea-field"
import { SelectField } from "@/components/ui/select-field"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomCard } from "@/components/ui/custom-card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { Spinner } from "@/components/ui/spinner"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedbackDialog } from "@/components/ui/feedback-dialog"
import {
  CoverLetterFormData,
  FormErrors,
  ToneType,
  validateForm,
  buildPayload,
  callApi,
  handleCopy,
  persistState,
  hydrateState,
  persistLetter,
  hydrateLetter
} from "@/lib/utils"

const initialFormData: CoverLetterFormData = {
  userName: "",
  email: "",
  phone: "",
  professionalSummary: "",
  keySkills: "",
  jobTitle: "",
  companyName: "",
  jobDescription: "",
  extraNotes: "",
  tone: "conversational"
}

const toneOptions = [
  {
    value: 'conversational',
    label: 'Conversational',
    description: 'Casual, friendly, and authentic'
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Balanced and business-appropriate'
  },
  {
    value: 'enthusiastic',
    label: 'Enthusiastic',
    description: 'Energetic and passionate'
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Traditional and highly professional'
  }
]

// Helper functions to format data for display
function formatWorkExperienceForDisplay(workExp: any[]): string {
  if (!workExp || workExp.length === 0) return ''
  
  return workExp.map(exp => {
    let text = `${exp.position} at ${exp.company} (${exp.duration})`
    if (exp.responsibilities && exp.responsibilities.length > 0) {
      text += '\n' + exp.responsibilities.map((r: string) => `- ${r}`).join('\n')
    }
    if (exp.achievements && exp.achievements.length > 0) {
      text += '\n' + exp.achievements.map((a: string) => `- ${a}`).join('\n')
    }
    return text
  }).join('\n\n')
}

function formatEducationForDisplay(education: any[]): string {
  if (!education || education.length === 0) return ''
  
  return education.map(edu => 
    `${edu.degree} in ${edu.field}\n${edu.institution}, ${edu.graduationYear}`
  ).join('\n\n')
}

export default function CoverLetterGenerator() {
  const dispatch = useAppDispatch()
  
  // Redux state
  const userProfile = useAppSelector((state) => state.userProfile.profile)
  const jobDetails = useAppSelector((state) => state.jobDetails.currentJob)
  const { generatedLetter, currentLetterId, isLoading, error: apiError } = useAppSelector((state) => state.coverLetter)
  
  // Local UI state (not persisted)
  const [errors, setErrors] = useState<FormErrors>({})
  const [copySuccess, setCopySuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [resumeError, setResumeError] = useState("")
  const [activeTab, setActiveTab] = useState<string>("manual")
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false)
  
  // Combined form data for validation and API calls
  const formData: CoverLetterFormData = {
    ...userProfile,
    ...jobDetails,
  }

  // Redux persist handles state hydration automatically
  // No need for manual localStorage management

  const handleInputChange = (field: keyof CoverLetterFormData, value: string) => {
    // Dispatch to appropriate Redux action based on field
    switch (field) {
      case 'userName':
        dispatch(updateUserName(value))
        break
      case 'email':
        dispatch(updateEmail(value))
        break
      case 'phone':
        dispatch(updatePhone(value))
        break
      case 'professionalSummary':
        dispatch(updateProfessionalSummary(value))
        break
      case 'keySkills':
        dispatch(updateKeySkills(value))
        break
      case 'jobTitle':
        dispatch(updateJobTitle(value))
        break
      case 'companyName':
        dispatch(updateCompanyName(value))
        break
      case 'jobDescription':
        dispatch(updateJobDescription(value))
        break
      case 'extraNotes':
        dispatch(updateExtraNotes(value))
        break
      case 'tone':
        dispatch(updateTone(value as ToneType))
        break
    }
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    if (apiError) {
      dispatch(clearError())
    }
  }

  const handleGenerate = async () => {
    const formErrors = validateForm(formData)
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    dispatch(setLoading(true))
    dispatch(clearError())
    
    try {
      const payload = buildPayload(formData)
      const response = await callApi(payload)
      
      if (response.body) {
        dispatch(setReduxGeneratedLetter(response.body))
        
        // Save to learning system
        try {
          const saveResponse = await fetch('/api/save-letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobTitle: formData.jobTitle,
              companyName: formData.companyName,
              tone: formData.tone,
              generatedLetter: response.body,
              keySkills: formData.keySkills,
              professionalSummary: formData.professionalSummary,
            }),
          })
          
          if (saveResponse.ok) {
            const { letterId } = await saveResponse.json()
            dispatch(setReduxCurrentLetterId(letterId))
          }
        } catch (saveError) {
          console.warn('Failed to save letter for learning:', saveError)
        }
      } else {
        throw new Error("No cover letter generated")
      }
    } catch (error) {
      dispatch(setReduxError(error instanceof Error ? error.message : "Failed to generate cover letter"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleCopyToClipboard = async () => {
    const success = await handleCopy(generatedLetter)
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleClearForm = () => {
    dispatch(clearUserProfile())
    dispatch(clearJobDetails())
    dispatch(clearCoverLetter())
    setErrors({})
    setCopySuccess(false)
    setSelectedFile(null)
  }

  const handleRetry = () => {
    dispatch(clearError())
    handleGenerate()
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setResumeError("")
    setIsParsingResume(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse resume')
      }

      const parsedData = await response.json()

      dispatch(setUserProfile({
        userName: parsedData.userName || userProfile.userName,
        email: parsedData.email || userProfile.email,
        phone: parsedData.phone || userProfile.phone,
        professionalSummary: parsedData.professionalSummary || userProfile.professionalSummary,
        keySkills: parsedData.keySkills || userProfile.keySkills,
        workExperience: parsedData.workExperience || userProfile.workExperience,
        education: parsedData.education || userProfile.education,
        certifications: parsedData.certifications || userProfile.certifications,
        projects: parsedData.projects || userProfile.projects,
        totalYearsExperience: parsedData.totalYearsExperience || userProfile.totalYearsExperience,
      }))

      setErrors({})

    } catch (error) {
      setResumeError(error instanceof Error ? error.message : 'Failed to parse resume')
      setSelectedFile(null)
    } finally {
      setIsParsingResume(false)
    }
  }

  const handleFileClear = () => {
    setSelectedFile(null)
    setResumeError("")
  }

  const isFormValid = !Object.keys(validateForm(formData)).length
  const wordCount = generatedLetter.split(/\s+/).filter(word => word.length > 0).length
  const charCount = generatedLetter.length

  return (
    <div className="min-h-screen animated-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            AI-Powered Cover Letters
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight animate-slide-up">
            Craft Your Perfect
            <span className="text-gradient block mt-1">Cover Letter</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Stand out from the crowd with personalized, professional cover letters 
            tailored to your dream job in seconds.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6 stagger-children">
        {/* API Error Alert */}
        {apiError && (
          <AlertBanner
            variant="error"
            title="Generation Failed"
            onClose={() => dispatch(clearError())}
            action={
              <CustomButton 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </CustomButton>
            }
          >
            {apiError}
          </AlertBanner>
        )}

        {/* Copy Success Alert */}
        {copySuccess && (
          <AlertBanner
            variant="success"
            title="Copied to clipboard!"
            onClose={() => setCopySuccess(false)}
          >
            Your cover letter is ready to paste.
          </AlertBanner>
        )}

        {/* Feedback Success Alert */}
        {showFeedbackSuccess && (
          <AlertBanner
            variant="success"
            title="Thank you for your feedback!"
            onClose={() => setShowFeedbackSuccess(false)}
          >
            Your feedback helps improve the AI for everyone.
          </AlertBanner>
        )}

        {/* User Information Form */}
        <CustomCard
          title="Your Information"
          description="Tell us about yourself to personalize your cover letter"
          icon={<User className="w-5 h-5" />}
          variant="elevated"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted rounded-xl">
              <TabsTrigger 
                value="manual" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-soft flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger 
                value="upload"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-soft flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-5 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  required
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  error={errors.userName}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="john@example.com"
                />
              </div>

              <InputField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />

              <TextAreaField
                label="Professional Summary"
                value={formData.professionalSummary}
                onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
                placeholder="Brief summary of your experience and background..."
                hint="2-3 sentences about your career and key strengths"
                rows={3}
                showCounter
              />

              <TextAreaField
                label="Key Skills"
                value={formData.keySkills}
                onChange={(e) => handleInputChange('keySkills', e.target.value)}
                placeholder="JavaScript, React, Node.js, Python, AWS..."
                hint="Separate skills with commas"
                rows={2}
                showCounter
              />

              <TextAreaField
                label="Work Experience"
                value={formatWorkExperienceForDisplay(userProfile.workExperience)}
                onChange={(e) => {
                  dispatch(updateWorkExperienceText(e.target.value))
                }}
                placeholder="Senior Software Engineer at Tech Corp (2020-Present)&#10;- Led team of 5 developers&#10;- Reduced load time by 40%&#10;&#10;Software Engineer at StartupXYZ (2018-2020)&#10;- Built microservices architecture&#10;- Increased user engagement by 25%"
                hint="List your work history with achievements"
                rows={6}
                showCounter
              />

              <TextAreaField
                label="Education"
                value={formatEducationForDisplay(userProfile.education)}
                onChange={(e) => {
                  dispatch(updateEducationText(e.target.value))
                }}
                placeholder="Bachelor of Science in Computer Science&#10;University of Technology, 2018"
                hint="List your educational qualifications"
                rows={3}
                showCounter
              />

              <TextAreaField
                label="Certifications"
                value={userProfile.certifications.join(', ')}
                onChange={(e) => {
                  dispatch(updateCertificationsText(e.target.value))
                }}
                placeholder="AWS Certified Solutions Architect, Google Cloud Professional"
                hint="Separate certifications with commas"
                rows={2}
                showCounter
              />

              <TextAreaField
                label="Notable Projects"
                value={userProfile.projects.join('\n')}
                onChange={(e) => {
                  dispatch(updateProjectsText(e.target.value))
                }}
                placeholder="E-commerce platform with 100k+ users&#10;Real-time chat application with WebSocket"
                hint="One project per line"
                rows={3}
                showCounter
              />
            </TabsContent>

            <TabsContent value="upload" className="space-y-5 mt-0">
              <div className="p-4 rounded-xl bg-accent/50 border border-accent">
                <p className="text-sm text-accent-foreground">
                  <strong>Pro tip:</strong> Upload your resume and we&apos;ll automatically extract your information. You can edit the details after.
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                onClear={handleFileClear}
                accept=".pdf,.docx,.txt"
                maxSize={5}
                disabled={isParsingResume}
                error={resumeError}
                selectedFile={selectedFile}
              />

              {isParsingResume && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Spinner size="lg" variant="primary" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Analyzing your resume...
                  </p>
                </div>
              )}

              {selectedFile && !isParsingResume && (
                <div className="space-y-5 pt-4 border-t border-border animate-fade-in">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Information extracted — review and edit below:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Full Name"
                      required
                      value={formData.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      error={errors.userName}
                      placeholder="John Doe"
                    />
                    <InputField
                      label="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="john@example.com"
                    />
                  </div>

                  <InputField
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />

                  <TextAreaField
                    label="Professional Summary"
                    value={formData.professionalSummary}
                    onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
                    placeholder="Brief summary of your experience and background"
                    rows={3}
                    showCounter
                  />

                  <TextAreaField
                    label="Key Skills"
                    value={formData.keySkills}
                    onChange={(e) => handleInputChange('keySkills', e.target.value)}
                    placeholder="List your relevant skills separated by commas"
                    rows={2}
                    showCounter
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CustomCard>

        {/* Job Information Form */}
        <CustomCard
          title="Job Details"
          description="Provide information about the position you're applying for"
          icon={<Briefcase className="w-5 h-5" />}
          variant="elevated"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Job Title"
                required
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                error={errors.jobTitle}
                placeholder="Senior Software Engineer"
              />
              <InputField
                label="Company Name"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                error={errors.companyName}
                placeholder="Acme Inc."
              />
            </div>

            <TextAreaField
              label="Job Description"
              required
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              error={errors.jobDescription}
              placeholder="Paste the full job description here..."
              hint="Include requirements, responsibilities, and qualifications"
              rows={8}
              showCounter
            />

            <TextAreaField
              label="Additional Notes"
              value={formData.extraNotes}
              onChange={(e) => handleInputChange('extraNotes', e.target.value)}
              placeholder="Any specific points you'd like to highlight..."
              hint="Optional: mention specific achievements or connections"
              rows={3}
              showCounter
            />

            <SelectField
              label="Writing Tone"
              required
              value={formData.tone}
              onValueChange={(value) => handleInputChange('tone', value as ToneType)}
              options={toneOptions}
              placeholder="Select a writing tone..."
              hint="Choose the tone that best matches the company culture"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border mt-2">
              <CustomButton
                onClick={handleGenerate}
                disabled={!isFormValid || isLoading}
                loading={isLoading}
                fullWidth
                size="lg"
                icon={<Wand2 className="w-5 h-5" />}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                {isLoading ? "Crafting Your Letter..." : "Generate Cover Letter"}
              </CustomButton>
              <CustomButton
                variant="outline"
                onClick={handleClearForm}
                disabled={isLoading}
                size="lg"
                icon={<Trash2 className="w-4 h-4" />}
                className="sm:w-auto border-2"
              >
                Clear
              </CustomButton>
            </div>
          </div>
        </CustomCard>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">Creating your cover letter</p>
              <p className="text-sm text-muted-foreground mt-1">This usually takes 10-15 seconds...</p>
            </div>
          </div>
        )}

        {/* Output */}
        {generatedLetter && !isLoading && (
          <CustomCard
            title="Your Cover Letter"
            description="Review, edit, and copy your personalized cover letter"
            icon={<FileText className="w-5 h-5" />}
            variant="elevated"
          >
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={generatedLetter}
                  onChange={(e) => {
                    dispatch(setReduxGeneratedLetter(e.target.value))
                  }}
                  className="w-full min-h-[400px] p-5 font-mono text-sm bg-muted/30 border border-border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {wordCount.toLocaleString()} words
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                    {charCount.toLocaleString()} characters
                  </span>
                </div>
                <div className="flex gap-2">
                  {currentLetterId && (
                    <FeedbackDialog 
                      letterId={currentLetterId}
                      onSubmit={() => {
                        setShowFeedbackSuccess(true)
                        setTimeout(() => setShowFeedbackSuccess(false), 3000)
                      }}
                    />
                  )}
                  <CustomButton
                    variant={copySuccess ? "secondary" : "primary"}
                    onClick={handleCopyToClipboard}
                    icon={copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    {copySuccess ? "Copied!" : "Copy to Clipboard"}
                  </CustomButton>
                </div>
              </div>
            </div>
          </CustomCard>
        )}

        {/* Empty State / CTA */}
        {!generatedLetter && !isLoading && (
          <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-border bg-muted/20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready to create your cover letter?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill in your details and job information above, then click 
              <span className="text-primary font-medium"> Generate Cover Letter </span>
              to get started.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CoverCraft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by AI • Built with care
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
