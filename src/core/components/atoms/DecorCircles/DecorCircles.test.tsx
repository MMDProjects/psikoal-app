import React from 'react'

import { render } from '@testing-library/react-native'

import { DecorCircles } from './DecorCircles'

function getCircles(UNSAFE_getAllByProps: ReturnType<typeof render>['UNSAFE_getAllByProps']) {
  return UNSAFE_getAllByProps({ pointerEvents: 'none' }).filter(
    (el) => typeof el.props.className === 'string' && el.props.className.includes('rounded-full')
  )
}

describe('DecorCircles', () => {
  it('renders three circles', () => {
    const { UNSAFE_getAllByProps } = render(<DecorCircles />)
    expect(getCircles(UNSAFE_getAllByProps).length).toBeGreaterThanOrEqual(3)
  })

  it('uses white tints on brand background', () => {
    const { UNSAFE_getAllByProps } = render(<DecorCircles />)
    const classNames = getCircles(UNSAFE_getAllByProps).map((el) => el.props.className)
    expect(classNames.some((c) => c.includes('bg-white/10'))).toBe(true)
  })

  it('renders at various phase values without crashing', () => {
    const phases = [0, 1, 2, 3, 4, 7, -1]
    phases.forEach((phase) => {
      const { unmount } = render(<DecorCircles phase={phase} />)
      unmount()
    })
  })

  it('re-renders on phase change without crashing', () => {
    const { rerender, unmount } = render(<DecorCircles phase={0} />)
    rerender(<DecorCircles phase={1} />)
    rerender(<DecorCircles phase={2} />)
    unmount()
  })
})
