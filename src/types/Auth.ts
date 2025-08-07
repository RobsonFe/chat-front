import { User } from "./User"

export type Auth = {
  user?: User
  access: string
  refresh: string
}
