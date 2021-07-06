import { cacheAllRestaurants } from './restaurants'

const runJobs = async () => {
  await cacheAllRestaurants()
}

runJobs()
