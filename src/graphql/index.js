// Domains
import * as common from '../domains/common'
import * as user from '../domains/user'
// Helpers
import { generateExecutableSchema } from '../common/helpers/generate-executable-schema'

export const appSchema = generateExecutableSchema([common, user])
