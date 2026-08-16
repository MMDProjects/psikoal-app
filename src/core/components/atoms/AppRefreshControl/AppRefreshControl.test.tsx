import { RefreshControl } from 'react-native'

import { render } from '@testing-library/react-native'

import { AppRefreshControl } from './AppRefreshControl'

describe('AppRefreshControl', () => {
  it('renders a RefreshControl with the given state', () => {
    const onRefresh = jest.fn()
    const { UNSAFE_getByType } = render(
      <AppRefreshControl refreshing={false} onRefresh={onRefresh} />
    )
    const control = UNSAFE_getByType(RefreshControl)
    expect(control.props.refreshing).toBe(false)
    expect(control.props.onRefresh).toBe(onRefresh)
  })

  it('reflects refreshing=true', () => {
    const { UNSAFE_getByType } = render(<AppRefreshControl refreshing onRefresh={jest.fn()} />)
    expect(UNSAFE_getByType(RefreshControl).props.refreshing).toBe(true)
  })
})
