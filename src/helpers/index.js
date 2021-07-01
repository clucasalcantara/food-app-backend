import { v4 as uuidv4 } from 'uuid'

export const normalizeGooglePlacesResponse = ({
  name,
  formatted_address,
  types,
  price_level,
  rating,
}) => {
  return {
    id: uuidv4(),
    name,
    location: formatted_address,
    cuisines: types.join(','),
    price_range: (price_level || '').toString(),
    currency: 'R$',
    average_cost: (price_level || '').toString(),
    user_rating: rating.toString(),
  }
}
