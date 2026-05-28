export class Rules {
  isRequired(message: string) {
    return {
      validator: (rule: any, value: any, cb: (error?: Error) => void) => {
        if (String(value).trim() === '' || value === null) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }
  isRegexJp(message: string) {
    return {
      validator: (rule: any, value: any, cb: (error?: Error) => void) => {
        const jpRegex = new RegExp('^[A-Za-z0-9]+$')
        if (value && jpRegex.test(value)) {
          cb()
        } else {
          cb(new Error(rule.message))
        }
      },
      message,
      trigger: 'blur'
    }
  }
  isEmail(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        if (value) {
          if (value && pattern.test(value)) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isPathLink(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/
        if (value) {
          if ((value && pattern.test(value)) || value === '/') {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isLink(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = new RegExp(
          '^https?:\\/\\/(www\\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.[a-z]{2,6}(\\/[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?$'
        )
        if (value) {
          if (value && pattern.test(value)) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isLinkYoutube(message: string) {
    return {
      validator: (rule: any, value: string, cb: (error?: Error) => void) => {
        const pattern = new RegExp(
          '^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$'
        )

        if (value && !pattern.test(value)) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isNumber(message: string) {
    return {
      validator: (rule: any, value: number, cb: (error?: Error) => void) => {
        if (value && isNaN(value)) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isLinkVimeo(message: string) {
    return {
      validator: (rule: any, value: string, cb: (error?: Error) => void) => {
        const pattern = new RegExp(
          '(http|https)?:\\/\\/(www\\.)?vimeo.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|)(\\d+)(?:|\\/\\?)'
        )

        if (value && !pattern.test(value)) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isLinkGoogleDrive(message: string) {
    return {
      validator: (rule: any, value: string, cb: (error?: Error) => void) => {
        const pattern = new RegExp(
          '^https?://(?:drive\\.google\\.com/(?:file/d/|drive/folders/|open\\?id=|uc\\?id=|drive/u/0/folders/|drive/u/0/file/d/)|docs\\.google\\.com/(?:document/d/|spreadsheets/d/|presentation/d/|forms/d/)|www\\.google\\.com/url\\?q=https?://drive\\.google\\.com/)([a-zA-Z0-9_-]+)(?:/view)?(?:\\?[a-zA-Z0-9_\\-&=%]*)?$'
        )
        if (value && !pattern.test(value)) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  rulePassword(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          if (value && value.length >= 6 && value.length <= 20) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  rulePhone(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = /^(0{1}\d{1,4}-{0,1}\d{1,4}-{0,1}\d{4})$/
        if (value) {
          if (value && !pattern.test(value)) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  rulePostCode(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          callback()
        } else if (value && !isNaN(Number(value.replaceAll('-', '')))) {
          callback()
        } else {
          callback(new Error(rule.message))
        }
      },
      message,
      trigger: 'blur'
    }
  }

  colorHex(message: string) {
    return {
      validator: (rule: any, value: any, cb: (error?: Error) => void) => {
        const regExpColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if (value && !regExpColor.test(value)) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }

  isRequiredArray(message: string) {
    return {
      validator: (rule: any, value: string[], cb: (error?: Error) => void) => {
        if (!value || !value.length) {
          cb(new Error(rule.message))
        } else {
          cb()
        }
      },
      message,
      trigger: 'blur'
    }
  }
}

export const RuleService = new Rules()
