import { User } from "./User"

export type Auth = {
  user?: User
  access_token: string
  refresh_token: string
}
