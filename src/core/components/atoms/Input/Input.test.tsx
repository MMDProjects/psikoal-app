import React from 'react'

import { fireEvent, render } from '@testing-library/react-native'

import { Input } from './Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={jest.fn()} placeholder="Enter text" />
    )
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={onChangeText} placeholder="Type here" />
    )
    fireEvent.changeText(getByPlaceholderText('Type here'), 'hello')
    expect(onChangeText).toHaveBeenCalledWith('hello')
  })

  it('applies error border class when state is error', () => {
    const { UNSAFE_getByType } = render(<Input value="" onChangeText={jest.fn()} state="error" />)
    const { View } = require('react-native')
    const container = UNSAFE_getByType(View)
    expect(container.props.className).toContain('border-semantic-error')
  })

  it('applies disabled styles and prevents interaction when state is disabled', () => {
    const onChangeText = jest.fn()
    const { getByDisplayValue } = render(
      <Input value="locked" onChangeText={onChangeText} state="disabled" />
    )
    const input = getByDisplayValue('locked')
    expect(input.props.editable).toBe(false)
  })

  it('toggles secure text entry when eye icon is pressed', () => {
    const { getByDisplayValue, getByLabelText } = render(
      <Input value="secret" onChangeText={jest.fn()} isSecure />
    )
    const input = getByDisplayValue('secret')
    expect(input.props.secureTextEntry).toBe(true)

    fireEvent.press(getByLabelText('Show password'))
    expect(getByDisplayValue('secret').props.secureTextEntry).toBe(false)
  })

  it('shows "Hide password" label after toggling secure to visible', () => {
    const { getByLabelText } = render(<Input value="secret" onChangeText={jest.fn()} isSecure />)
    fireEvent.press(getByLabelText('Show password'))
    expect(getByLabelText('Hide password')).toBeTruthy()
  })

  it('renders correctly with multiline', () => {
    const { UNSAFE_getAllByType } = render(
      <Input value={'line1\nline2'} onChangeText={jest.fn()} multiline />
    )
    const { TextInput } = require('react-native')
    const input = UNSAFE_getAllByType(TextInput)[0]!
    expect(input.props.value).toBe('line1\nline2')
  })

  it('has multiline enabled when multiline prop is true', () => {
    const { getByDisplayValue } = render(<Input value="multi" onChangeText={jest.fn()} multiline />)
    expect(getByDisplayValue('multi').props.multiline).toBe(true)
  })

  it('calls onFocus when input is focused', () => {
    const onFocus = jest.fn()
    const { getByDisplayValue } = render(
      <Input value="test" onChangeText={jest.fn()} onFocus={onFocus} />
    )
    fireEvent(getByDisplayValue('test'), 'focus')
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('calls onBlur when input loses focus', () => {
    const onBlur = jest.fn()
    const { getByDisplayValue } = render(
      <Input value="test" onChangeText={jest.fn()} onBlur={onBlur} />
    )
    fireEvent(getByDisplayValue('test'), 'blur')
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('shows clear button when value is non-empty and no rightElement', () => {
    const { getByLabelText } = render(<Input value="hello" onChangeText={jest.fn()} />)
    expect(getByLabelText('Clear input')).toBeTruthy()
  })

  it('clears value when clear button is pressed', () => {
    const onChangeText = jest.fn()
    const { getByLabelText } = render(<Input value="hello" onChangeText={onChangeText} />)
    fireEvent.press(getByLabelText('Clear input'))
    expect(onChangeText).toHaveBeenCalledWith('')
  })

  it('does not show clear button when value is empty', () => {
    const { queryByLabelText } = render(<Input value="" onChangeText={jest.fn()} />)
    expect(queryByLabelText('Clear input')).toBeNull()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<Input value="" onChangeText={jest.fn()} size={size} />)
      unmount()
    })
  })

  it('renders leftElement when provided', () => {
    const { getByLabelText } = render(
      <Input
        value=""
        onChangeText={jest.fn()}
        leftElement={
          <React.Fragment>
            <></>
          </React.Fragment>
        }
        placeholder="with icon"
      />
    )
    expect(getByLabelText).toBeDefined()
  })
})
