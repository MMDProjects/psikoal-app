import { parseRecoveryLink } from './parseRecoveryLink'

describe('parseRecoveryLink', () => {
  it('reads the access token from the URL fragment', () => {
    expect(
      parseRecoveryLink(
        'psikoal://reset-password#access_token=abc.def%2Bg&expires_in=3600&refresh_token=r1&token_type=bearer&type=recovery'
      )
    ).toEqual({ status: 'valid', accessToken: 'abc.def+g' })
  })

  it('reports an expired / invalid link', () => {
    expect(
      parseRecoveryLink(
        'psikoal://reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid'
      )
    ).toEqual({ status: 'invalid' })
  })

  it('rejects tokens that are not for recovery', () => {
    expect(parseRecoveryLink('psikoal://reset-password#access_token=x&type=signup')).toEqual({
      status: 'invalid',
    })
  })

  it('reports a missing token when the screen is opened without a link', () => {
    expect(parseRecoveryLink(null)).toEqual({ status: 'missing' })
    expect(parseRecoveryLink('psikoal://reset-password')).toEqual({ status: 'missing' })
  })

  it('also accepts query-string tokens', () => {
    expect(parseRecoveryLink('psikoal://reset-password?access_token=q&type=recovery')).toEqual({
      status: 'valid',
      accessToken: 'q',
    })
  })
})
