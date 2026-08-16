import { useEffect } from 'react'

import { Platform } from 'react-native'

import { NativeTabs, Label, Icon as NativeIcon } from 'expo-router/unstable-native-tabs'
import { useColorScheme } from 'nativewind'

import { Tabs, useRouter } from 'expo-router'

import { Icon } from '@/core/components/atoms/Icon'
import { useAuthStore } from '@/domains/auth'

export default function TabsLayout() {
  const router = useRouter()
  const role = useAuthStore((s) => s.role)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isExpert = role === 'expert'
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login')
    }
  }, [isAuthenticated, router])

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeIcon sf={isExpert ? 'doc.text.fill' : 'safari.fill'} />
          <Label>{isExpert ? 'Fırsatlar' : 'Keşfet'}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="offers">
          <NativeIcon sf={isExpert ? 'paperplane.fill' : 'list.bullet'} />
          <Label>{isExpert ? 'Tekliflerim' : 'İlanlarım'}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="matches">
          <NativeIcon sf="person.2.fill" />
          <Label>Eşleşmelerim</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <NativeIcon sf="gearshape.fill" />
          <Label>Ayarlar</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    )
  }

  const tabBg = isDark ? '#1C1C1E' : '#FFFFFF'
  const tabBorder = isDark ? '#38383A' : '#F0F0F0'
  const tabActive = isDark ? '#38BDF8' : '#0EA5E9' // sky-400 dark / sky-500 light
  const tabInactive = isDark ? '#525252' : '#A3A3A3' // neutral-600 dark / neutral-400 light

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabActive,
        tabBarInactiveTintColor: tabInactive,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopWidth: 1,
          borderTopColor: tabBorder,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isExpert ? 'Fırsatlar' : 'Keşfet',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={isExpert ? 'Briefcase' : 'Compass'}
              size={22}
              color={color}
              strokeWidth={focused ? 2.25 : 1.75}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: isExpert ? 'Tekliflerim' : 'İlanlarım',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={isExpert ? 'Send' : 'ClipboardList'}
              size={22}
              color={color}
              strokeWidth={focused ? 2.25 : 1.75}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Eşleşmelerim',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="Users" size={22} color={color} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="Settings" size={22} color={color} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
    </Tabs>
  )
}
