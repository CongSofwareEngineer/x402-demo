export const lowerCase = (value: any) => {
  return value ? value.toLowerCase() : value
}

export const upperCase = (value: any) => {
  return value ? value.toUpperCase() : value
}

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const ellipsisAddress = (address: string | undefined, prefixLength = 13, suffixLength = 4) => {
  address = address || ''

  return `${address.substr(0, prefixLength)}...${address.substr(address.length - suffixLength, suffixLength)}`
}

export const isObject = (data: any, checkEmpty = false) => {
  const isObj = data && typeof data === 'object'

  return checkEmpty ? isObj && Object.keys(data).length > 0 : isObj
}

export const detectUrl = (url?: string, defaultUrl = '') => {
  try {
    if (url?.startsWith('https://')) {
      const imageUrl = new URL(url)
      const imgQuery = imageUrl.searchParams.get('image')

      if (imgQuery && imgQuery.startsWith('https://')) {
        url = imgQuery
      }
    }

    if (url?.startsWith('https://')) {
      return url
    }
    if (url?.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    return url || defaultUrl
  } catch (error) {
    return defaultUrl
  }
}

export const copyToClipboard = (text: any) => {
  const tmp = document.createElement('input')

  tmp.value = text
  document.body.appendChild(tmp)
  tmp.select()
  document.execCommand('copy')
  tmp.remove()
  alert('Copied to clipboard!')
}
