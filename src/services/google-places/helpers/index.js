import { v4 as uuidv4 } from 'uuid'
import logger from 'hoopa-logger'

import { GooglePlacesClient } from '../'

export const normalizeGooglePlacesResponse = async (
  { name, formatted_address, types, price_level, rating, photos },
  cuisine
) => {
  try {
    let featured_image = 'img_fallback'

    if (photos && photos.length && photos[0].photo_reference) {
      featured_image = photos[0].photo_reference
    }

    return {
      id: uuidv4(),
      name,
      location: formatted_address,
      cuisine,
      price_range: (price_level || '').toString(),
      currency: 'R$',
      average_cost: (price_level || '').toString(),
      user_rating: rating.toString(),
      featured_image
    }
  } catch (error) {
    logger.error(error)
  }
}
