import { FacilitatorType } from '@/server/x402'

export interface FieldDef {
  type?: string
  required?: boolean | string[]
  description?: string
  enum?: string[]
  properties?: Record<string, FieldDef> // for nested objects
}

export interface ConfigCustom {
  description?: string
  input?: {
    queryParams?: Record<string, FieldDef>
    bodyFields?: Record<string, FieldDef>
    headerFields?: Record<string, FieldDef>
  }
  output?: {}
}

export interface BodyRequest {
  address: string
  chain?: string
  facilitator?: FacilitatorType
}
