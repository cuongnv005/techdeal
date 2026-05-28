const EMAIL_PATTERN: RegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
const LINK_PATTERN: RegExp =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&=]*)/
const USERNAME_PATTERN: RegExp = /^[A-Za-z0-9_.]+$/

class ValidatorService {
  isEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value)
  }

  isLink(value: string): boolean {
    return LINK_PATTERN.test(value)
  }

  isUsername(value: string): boolean {
    return USERNAME_PATTERN.test(value)
  }
}

export const Validator = new ValidatorService()
