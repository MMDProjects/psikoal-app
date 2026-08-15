import { InputField } from '@/core/components/molecules/InputField'

export type OnboardingStepTitleProps = {
  title: string
  onTitleChange: (value: string) => void
  errorMessage?: string
}

export function OnboardingStepTitle({
  title,
  onTitleChange,
  errorMessage,
}: OnboardingStepTitleProps) {
  return (
    <InputField
      tone="onBrand"
      label="Ünvan"
      placeholder="Örn: Klinik Psikolog, Psikoterapist"
      value={title}
      onChangeText={onTitleChange}
      errorMessage={errorMessage}
      isRequired
    />
  )
}
