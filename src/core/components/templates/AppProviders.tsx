import type { ReactNode } from 'react'

import { View } from 'react-native'
import type { ViewStyle } from 'react-native'

import { QueryClientProvider } from '@tanstack/react-query'
import { useColorScheme } from 'nativewind'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { queryClient } from '@/lib/queryClient'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const { colorScheme } = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* REASON: color-scheme, css-interop'un desteklediği ama RN tiplerinin tanımadığı bir stil özelliğidir */}
          <View className="flex-1" style={{ colorScheme } as unknown as ViewStyle}>
            {children}
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
