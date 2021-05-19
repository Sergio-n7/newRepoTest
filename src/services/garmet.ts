import Garmet, { AllGarmets } from '../models/Garmets'

function create(garmet: AllGarmets): Promise<AllGarmets> {
  return garmet.save()
}

function findById(garmetId: string): Promise<AllGarmets> {
  return Garmet.findById(garmetId)
    .exec() // .exec() will return a true Promise
    .then((garmet) => {
      if (!garmet) {
        throw new Error(`Garmet ${garmetId} not found`)
      }
      return garmet
    })
}

function findAll(): Promise<AllGarmets[]> {
  return Garmet.find().sort({ ref: 1, category: 1 }).exec() // Return a Promise
}

function update(
  garmetId: string,
  update: Partial<AllGarmets>
): Promise<AllGarmets> {
  return Garmet.findById(garmetId)
    .exec()
    .then((garmet) => {
      if (!garmet) {
        throw new Error(`Movie ${garmetId} not found`)
      }

      if (update.name) {
        garmet.name = update.name
      }
      if (update.category) {
        garmet.category = update.category
      }
      if (update.size) {
        garmet.size = update.size
      }
      if (update.season) {
        garmet.season = update.season
      }
      if (update.garmetRef) {
        garmet.garmetRef = update.garmetRef
      }
      if (update.brand) {
        garmet.brand = update.brand
      }

      if (update.genres) {
        garmet.genres = update.genres
      }

      return garmet.save()
    })
}

function deleteGarmet(garmetId: string): Promise<AllGarmets | null> {
  return Garmet.findByIdAndDelete(garmetId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteGarmet,
}
