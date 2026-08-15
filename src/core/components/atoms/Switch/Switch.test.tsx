import { fireEvent, render } from '@testing-library/react-native'

import * as Haptics from 'expo-haptics'

import { Switch } from './Switch'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light' },
}))

describe('Switch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reflects the value prop', () => {
    const { getByRole } = render(<Switch value onValueChange={jest.fn()} />)
    expect(getByRole('switch').props.value).toBe(true)
  })

  it('calls onValueChange with the next value', () => {
    const onValueChange = jest.fn()
    const { getByRole } = render(<Switch value={false} onValueChange={onValueChange} />)
    fireEvent(getByRole('switch'), 'valueChange', true)
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it('fires light haptic feedback on change', () => {
    const { getByRole } = render(<Switch value={false} onValueChange={jest.fn()} />)
    fireEvent(getByRole('switch'), 'valueChange', true)
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light)
  })

  it('swallows a rejected haptics promise', async () => {
    ;(Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(new Error('no haptics'))
    const onValueChange = jest.fn()
    const { getByRole } = render(<Switch value={false} onValueChange={onValueChange} />)
    fireEvent(getByRole('switch'), 'valueChange', true)
    await Promise.resolve()
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it('is disabled when isDisabled is set', () => {
    const { getByRole } = render(<Switch value={false} onValueChange={jest.fn()} isDisabled />)
    expect(getByRole('switch').props.disabled).toBe(true)
  })

  it('passes className through', () => {
    const { getByRole } = render(
      <Switch value={false} onValueChange={jest.fn()} className="mt-2" />
    )
    expect(getByRole('switch')).toBeTruthy()
  })
})
