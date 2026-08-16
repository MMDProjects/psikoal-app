import React from 'react'

import { fireEvent, render } from '@testing-library/react-native'

import { RatingRow } from './RatingRow'

describe('RatingRow', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RatingRow rating={3} />)
    expect(toJSON()).toBeTruthy()
  })

  it('renders for every whole rating 0-5', () => {
    for (let r = 0; r <= 5; r++) {
      const { unmount } = render(<RatingRow rating={r} />)
      unmount()
    }
  })

  it('renders half-star ratings without crashing', () => {
    const { toJSON } = render(<RatingRow rating={3.5} />)
    expect(toJSON()).toBeTruthy()
  })

  it('shows review count when provided', () => {
    const { getByText } = render(<RatingRow rating={4} reviewCount={128} />)
    expect(getByText(/128/)).toBeTruthy()
  })

  it('does not render review count when not provided', () => {
    const { queryByText } = render(<RatingRow rating={4} />)
    expect(queryByText(/\(/)).toBeNull()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<RatingRow rating={4} size={size} />)
      unmount()
    })
  })

  it('renders interactive stars with accessibilityRole=button', () => {
    const { getAllByRole } = render(<RatingRow rating={3} interactive onRatingChange={jest.fn()} />)
    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('calls onRatingChange when star is pressed in interactive mode', () => {
    const onRatingChange = jest.fn()
    const { getAllByRole } = render(
      <RatingRow rating={3} interactive onRatingChange={onRatingChange} />
    )
    fireEvent.press(getAllByRole('button')[4]!) // 5th star
    expect(onRatingChange).toHaveBeenCalledWith(5)
  })

  it('calls onRatingChange with correct index for first star', () => {
    const onRatingChange = jest.fn()
    const { getAllByRole } = render(
      <RatingRow rating={3} interactive onRatingChange={onRatingChange} />
    )
    fireEvent.press(getAllByRole('button')[0]!)
    expect(onRatingChange).toHaveBeenCalledWith(1)
  })

  it('does not render empty stars when showEmpty is false', () => {
    const { getAllByRole } = render(
      <RatingRow rating={2} interactive showEmpty={false} onRatingChange={jest.fn()} />
    )
    expect(getAllByRole('button')).toHaveLength(2)
  })

  it('does not call onRatingChange when not interactive', () => {
    const onRatingChange = jest.fn()
    const { UNSAFE_queryAllByType } = render(
      <RatingRow rating={3} onRatingChange={onRatingChange} />
    )
    const { Pressable } = require('react-native')
    expect(UNSAFE_queryAllByType(Pressable)).toHaveLength(0)
  })
})
