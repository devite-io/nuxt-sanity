export interface LinkExternal {
  _type: 'linkExternal'
  url: string
  newWindow: boolean
  linkTitle?: string
  relationship?: string
}
