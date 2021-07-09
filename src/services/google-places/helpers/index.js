import { v4 as uuidv4 } from 'uuid'
import logger from 'hoopa-logger'

import { GooglePlacesClient } from '..'

export const normalizeGooglePlacesResponse = async (
  { name, formatted_address, price_level, rating, photos, geometry, place_id },
  cuisine
) => {
  try {
    let featured_image = 'img_fallback'

    // Get Place Photo
    if (photos && photos.length > 0 && photos[0].photo_reference) {
      const { request } = await GooglePlacesClient.getRestaurantPhoto(
        photos[0].photo_reference
      )

      featured_image =
        request._redirectable._options.href || photos[0].photo_reference
    }

    // Get Place Details
    const {
      formatted_phone_number = '',
      opening_hours: { weekday_text } = {},
      website = '',
    } = await GooglePlacesClient.getRestaurantDetails(place_id)

    return {
      id: uuidv4(),
      name,
      location: formatted_address,
      cuisine,
      price_range: (price_level || '').toString(),
      currency: 'R$',
      formatted_phone_number,
      website,
      user_rating: rating.toString(),
      featured_image,
      geometry: geometry || '',
      opening_hours: weekday_text || '',
      place_id,
    }
  } catch (error) {
    logger.error(error)
  }
}
