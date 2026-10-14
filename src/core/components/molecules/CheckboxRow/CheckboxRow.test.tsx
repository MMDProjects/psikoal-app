import React from 'react'

import { fireEvent, render } from '@testing-library/react-native'

import { CheckboxRow } from './CheckboxRow'

describe('CheckboxRow', () => {
  it('renders the label and exposes the checked state', () => {
    const { getByText, getByRole } = render(
      <CheckboxRow checked={false} onToggle={jest.fn()} accessibilityLabel="Onay">
        Kabul ediyorum
      </CheckboxRow>
    )
    expect(getByText('Kabul ediyorum')).toBeTruthy()
    expect(getByRole('checkbox').props.accessibilityState).toEqual({ checked: false })
  })

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn()
    const { getByRole } = render(
      <CheckboxRow checked onToggle={onToggle} accessibilityLabel="Onay" tone="onBrand">
        Kabul ediyorum
      </CheckboxRow>
    )
    fireEvent.press(getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
