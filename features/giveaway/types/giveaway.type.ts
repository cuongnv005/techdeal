export interface Giveaway {
  id: string
  app_name: string
  key_quantity: number
  keys_claimed: number
  original_price: number
  expiry_date: string
  is_expired: boolean
  is_out_of_keys: boolean
  has_claimed: boolean
  activation_link?: string
  user?: {
    username: string
    role: string
  }
}

export interface ClaimUser {
  username: string
  email: string
  claimed_at: string
}

export interface GiveawayAdminDetail extends Giveaway {
  claims: ClaimUser[]
}

export interface CreateGiveawayInput {
  app_name: string
  activation_link: string
  key_quantity: number
  original_price: number
  expiry_date: string
}
