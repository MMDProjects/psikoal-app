import { getFullName, getInitials } from './personName'

describe('getFullName', () => {
  it('joins first and last name', () => {
    expect(getFullName({ firstName: 'Zeynep', lastName: 'Yılmaz' })).toBe('Zeynep Yılmaz')
  })

  it('trims when one part is missing', () => {
    expect(getFullName({ firstName: 'Zeynep' })).toBe('Zeynep')
    expect(getFullName({ lastName: 'Yılmaz' })).toBe('Yılmaz')
  })

  it('handles null fields and a null person', () => {
    expect(getFullName({ firstName: null, lastName: null })).toBe('')
    expect(getFullName(null)).toBe('')
    expect(getFullName(undefined)).toBe('')
  })
})

describe('getInitials', () => {
  it('uppercases the first letter of each part', () => {
    expect(getInitials({ firstName: 'zeynep', lastName: 'yılmaz' })).toBe('ZY')
  })

  it('falls back to the available part', () => {
    expect(getInitials({ firstName: 'Zeynep' })).toBe('Z')
    expect(getInitials({ lastName: 'Yılmaz' })).toBe('Y')
  })

  it('handles empty strings, null fields and a null person', () => {
    expect(getInitials({ firstName: '', lastName: '' })).toBe('')
    expect(getInitials({ firstName: null, lastName: null })).toBe('')
    expect(getInitials(null)).toBe('')
  })
})
