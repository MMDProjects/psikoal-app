import { act, renderHook } from '@testing-library/react-native'

import { useRefresh } from './useRefresh'

describe('useRefresh', () => {
  it('starts with isRefreshing false', () => {
    const { result } = renderHook(() =>
      useRefresh({ refetch: jest.fn().mockResolvedValue(undefined) })
    )
    expect(result.current.isRefreshing).toBe(false)
  })

  it('refetches all queries and resets isRefreshing', async () => {
    const refetchA = jest.fn().mockResolvedValue(undefined)
    const refetchB = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useRefresh({ refetch: refetchA }, { refetch: refetchB }))

    await act(async () => {
      result.current.onRefresh()
    })

    expect(refetchA).toHaveBeenCalledTimes(1)
    expect(refetchB).toHaveBeenCalledTimes(1)
    expect(result.current.isRefreshing).toBe(false)
  })

  it('resets isRefreshing even when a refetch rejects', async () => {
    const failing = jest.fn().mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useRefresh({ refetch: failing }))

    await act(async () => {
      result.current.onRefresh()
    })

    expect(result.current.isRefreshing).toBe(false)
  })
})
