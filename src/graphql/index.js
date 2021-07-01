// Domains
import * as common from '../domains/common'
import * as user from '../domains/user'
import * as restaurants from '../domains/restaurants'
// Helpers
import { generateExecutableSchema } from '../common/helpers/generate-executable-schema'

export const appSchema = generateExecutableSchema([common, user, restaurants])
