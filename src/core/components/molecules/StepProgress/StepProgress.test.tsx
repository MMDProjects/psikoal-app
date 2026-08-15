import React from 'react'

import { render } from '@testing-library/react-native'

import { StepProgress } from './StepProgress'

describe('StepProgress', () => {
  it('renders step counter', () => {
    const { getByText } = render(<StepProgress current={2} total={3} />)
    expect(getByText('2/3')).toBeTruthy()
  })

  it('renders label when provided', () => {
    const { getByText } = render(<StepProgress current={1} total={3} label="Konu & Açıklama" />)
    expect(getByText('Konu & Açıklama')).toBeTruthy()
  })

  it('exposes progressbar accessibility value', () => {
    const { UNSAFE_getByProps } = render(<StepProgress current={2} total={5} />)
    const bar = UNSAFE_getByProps({ accessibilityRole: 'progressbar' })
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 5, now: 2 })
  })

  it('renders at boundary values without crashing', () => {
    const cases = [
      { current: 0, total: 3 },
      { current: 3, total: 3 },
      { current: 5, total: 3 },
      { current: 1, total: 0 },
    ]
    cases.forEach(({ current, total }) => {
      const { unmount } = render(<StepProgress current={current} total={total} />)
      unmount()
    })
  })
})
