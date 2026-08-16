import React from 'react'

import { render } from '@testing-library/react-native'

import { Skeleton, SkeletonGroup } from './Skeleton'

describe('Skeleton', () => {
  it('renders without crashing', () => {
    const { UNSAFE_getByProps } = render(<Skeleton />)
    expect(UNSAFE_getByProps({ accessibilityLabel: 'Loading' })).toBeTruthy()
  })

  it('has accessible label', () => {
    const { getByLabelText } = render(<Skeleton />)
    expect(getByLabelText('Loading')).toBeTruthy()
  })

  it('applies given dimensions via style', () => {
    const { UNSAFE_getByProps } = render(<Skeleton width={200} height={40} />)
    const el = UNSAFE_getByProps({ accessibilityLabel: 'Loading' })
    const dimStyle = (el.props.style as [unknown, { width: unknown; height: unknown }])[1]
    expect(dimStyle.width).toBe(200)
    expect(dimStyle.height).toBe(40)
  })

  it('applies circle variant dimensions (width = height)', () => {
    const { UNSAFE_getByProps } = render(<Skeleton variant="circle" height={64} />)
    const el = UNSAFE_getByProps({ accessibilityLabel: 'Loading' })
    const dimStyle = (el.props.style as [unknown, { width: unknown; height: unknown }])[1]
    expect(dimStyle.width).toBe(64)
    expect(dimStyle.height).toBe(64)
  })

  it('applies custom borderRadius class', () => {
    const { UNSAFE_getByProps } = render(<Skeleton borderRadius="full" />)
    const el = UNSAFE_getByProps({ accessibilityLabel: 'Loading' })
    expect(el.props.className).toContain('rounded-full')
  })

  it('renders all variants without crashing', () => {
    const variants = ['line', 'circle', 'rect'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Skeleton variant={variant} />)
      unmount()
    })
  })

  it('merges custom className', () => {
    const { UNSAFE_getByProps } = render(<Skeleton className="opacity-50" />)
    const el = UNSAFE_getByProps({ accessibilityLabel: 'Loading' })
    expect(el.props.className).toContain('opacity-50')
  })
})

describe('SkeletonGroup', () => {
  it('renders children', () => {
    const { getAllByLabelText } = render(
      <SkeletonGroup>
        <Skeleton variant="line" />
        <Skeleton variant="line" />
      </SkeletonGroup>
    )
    expect(getAllByLabelText('Loading')).toHaveLength(2)
  })

  it('applies gap class', () => {
    const { UNSAFE_getAllByType } = render(
      <SkeletonGroup gap="lg">
        <Skeleton />
      </SkeletonGroup>
    )
    const { View } = require('react-native')
    const groupView = UNSAFE_getAllByType(View)[0]!
    expect(groupView.props.className).toContain('gap-4')
  })

  it('merges custom className', () => {
    const { UNSAFE_getAllByType } = render(
      <SkeletonGroup className="p-4">
        <Skeleton />
      </SkeletonGroup>
    )
    const { View } = require('react-native')
    const groupView = UNSAFE_getAllByType(View)[0]!
    expect(groupView.props.className).toContain('p-4')
  })
})
