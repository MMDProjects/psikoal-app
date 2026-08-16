import { cn } from './cn'

describe('cn', () => {
  it('joins plain class strings', () => {
    expect(cn('rounded-xl', 'p-4')).toBe('rounded-xl p-4')
  })

  it('drops falsy conditional branches', () => {
    const isActive = false
    expect(cn('rounded-xl', isActive && 'bg-sky-50')).toBe('rounded-xl')
  })

  it('keeps truthy conditional branches', () => {
    const isActive = true
    expect(cn('rounded-xl', isActive && 'bg-sky-50')).toBe('rounded-xl bg-sky-50')
  })

  it('lets the later tailwind class win on conflict', () => {
    expect(cn('bg-sky-500', 'bg-sky-600')).toBe('bg-sky-600')
    expect(cn('p-4', 'p-6')).toBe('p-6')
  })

  it('accepts arrays and objects', () => {
    expect(cn(['flex', 'flex-row'], { 'items-center': true, hidden: false })).toBe(
      'flex flex-row items-center'
    )
  })

  it('returns an empty string when nothing is passed', () => {
    expect(cn()).toBe('')
    expect(cn(undefined, null, false)).toBe('')
  })
})
