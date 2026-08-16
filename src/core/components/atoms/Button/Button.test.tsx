import React from 'react'

import { fireEvent, render } from '@testing-library/react-native'

import { Button } from './Button'

// expo-haptics is mocked by jest-expo; no manual mock needed

describe('Button', () => {
  it('renders label', () => {
    const { getByText } = render(<Button label="Press me" onPress={jest.fn()} />)
    expect(getByText('Press me')).toBeTruthy()
  })

  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger', 'accent', 'link'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Button label={variant} onPress={jest.fn()} variant={variant} />)
      unmount()
    })
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<Button label={size} onPress={jest.fn()} size={size} />)
      unmount()
    })
  })

  it('calls onPress once when tapped', () => {
    const onPress = jest.fn()
    const { getByRole } = render(<Button label="Tap" onPress={onPress} />)
    fireEvent.press(getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onPress when disabled', () => {
    const onPress = jest.fn()
    const { getByRole } = render(<Button label="Disabled" onPress={onPress} isDisabled />)
    fireEvent.press(getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('does NOT call onPress when loading', () => {
    const onPress = jest.fn()
    const { getByRole } = render(<Button label="Loading" onPress={onPress} isLoading />)
    fireEvent.press(getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('shows ActivityIndicator when loading', () => {
    const { getByLabelText, queryByText } = render(
      <Button label="Save" onPress={jest.fn()} isLoading />
    )
    expect(getByLabelText('Loading')).toBeTruthy()
    expect(queryByText('Save')).toBeNull()
  })

  it('is accessible as a button role', () => {
    const { getByRole } = render(<Button label="OK" onPress={jest.fn()} />)
    expect(getByRole('button')).toBeTruthy()
  })

  it('has accessibilityLabel equal to label', () => {
    const { getByLabelText } = render(<Button label="Submit" onPress={jest.fn()} />)
    expect(getByLabelText('Submit')).toBeTruthy()
  })

  it('renders leftIcon and rightIcon alongside label', () => {
    const Left = () => <React.Fragment />
    const Right = () => <React.Fragment />
    const { getByText } = render(
      <Button label="Centered" onPress={jest.fn()} leftIcon={<Left />} rightIcon={<Right />} />
    )
    expect(getByText('Centered')).toBeTruthy()
  })

  it('applies w-full class when fullWidth is true', () => {
    const { getByRole } = render(<Button label="Full" onPress={jest.fn()} fullWidth />)
    const btn = getByRole('button')
    expect(btn.props.className).toContain('w-full')
  })

  it('does not apply w-full class when fullWidth is false', () => {
    const { getByRole } = render(<Button label="Auto" onPress={jest.fn()} fullWidth={false} />)
    const btn = getByRole('button')
    expect(btn.props.className ?? '').not.toContain('w-full')
  })

  it('applies opacity-40 when disabled', () => {
    const { getByRole } = render(<Button label="Off" onPress={jest.fn()} isDisabled />)
    const btn = getByRole('button')
    expect(btn.props.className).toContain('opacity-40')
  })

  it('applies opacity-40 when loading', () => {
    const { getByRole } = render(<Button label="Busy" onPress={jest.fn()} isLoading />)
    const btn = getByRole('button')
    expect(btn.props.className).toContain('opacity-40')
  })

  it('fires pressIn and pressOut without error (scale animation)', () => {
    const { getByRole } = render(<Button label="Anim" onPress={jest.fn()} />)
    const btn = getByRole('button')
    fireEvent(btn, 'pressIn')
    fireEvent(btn, 'pressOut')
  })
})
