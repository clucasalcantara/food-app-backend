/* eslint-disable camelcase */
export const normalizeZomatoResponse = ({
  id,
  name,
  location,
  cuisines,
  price_range,
  currency,
  average_cost_for_two,
  highlights,
  timings,
  thumb,
  user_rating,
  featured_image,
  phone_numbers,
  establishment,
}) => {
  return {
    id,
    name,
    location,
    cuisines,
    price_range,
    currency,
    average_cost: average_cost_for_two,
    highlights,
    timings,
    thumb,
    user_rating: user_rating.aggregate_rating.toString(),
    featured_image,
    phone: phone_numbers,
    category: establishment[0],
  }
}

export const normalizeGooglePlacesResponse = ({
  id,
  name,
  formatted_address,
  types,
  price_level,
  rating,
}) => {
  return {
    id,
    name,
    location: formatted_address,
    cuisines: types,
    price_range: price_level,
    currency: 'R$',
    average_cost: price_level,
    user_rating: rating.toString(),
  }
}
