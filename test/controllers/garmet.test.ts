/* eslint-disable @typescript-eslint/member-delimiter-style */
import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import { ReviewDocument } from '../../src/models/Garmets'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

export interface GarmetDocumentTest extends Document {
  name: string
  description: string
  category: string
  stock: number
  price: number
  color: string
  size: string
  image?: string
  totalRating: number
  reviews: ReviewDocument[]
}

const nonExistingGarmetId = '5e57b77b5744fa0b461c7906'

const createUser = async (inputData?: Partial<UserDocument>) => {
  let user: Partial<UserDocument> = {
    firstName: 'name',
    lastName: 'surname',
    email: 'helloworld@gmail.com',
    age: 22,
    password: 'hello',
    isAdmin: true,
  }
  if (inputData) {
    user = { ...user, ...inputData }
  }
  return request(app)
    .post('/api/v1/users')
    .send(user)
    .then((res) => res.body)
}

const createGarmet = async (
  token: string,
  inputData?: Partial<GarmetDocumentTest>
) => {
  let garmet: Partial<GarmetDocumentTest> = {
    name: 'testingGarmet',
    description: 'this is a testin description',
    category: 'testing category',
    stock: 2,
    price: 222,
    color: 'red',
    size: 'XL',
    totalRating: 2,
    reviews: [],
  }

  if (inputData) {
    garmet = { ...inputData }
  }

  return request(app)
    .post('/api/v1/garmets')
    .set('Content-Type', 'multipart/form-data')
    .field('title', garmet.name as string)
    .field('description', garmet.description as string)
    .field('category', garmet.category as string)
    .field('countInStock', (garmet.stock as number).toString())
    .field('price', (garmet.price as number).toString())
    .field('color', garmet.color as string)
    .field('size', garmet.size as string)
    .field('totalRating', (garmet.totalRating as number).toString())
    .field('reviews', (garmet.reviews as ReviewDocument[]).toString())
    .attach(
      'image',
      '/Users/sergiosalguero/Desktop/Integrify/GitHub-repositores/ft7-fullstack-assignment/src/images/Sergi-image-noBG.png'
    )
    .set('Authorization', `Bearer ${token}`)
}
describe('garmet controller', () => {
  let token: string

  beforeEach(async () => {
    await dbHelper.connect()

    const user = await createUser()
    token = user.token
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  test('should create a new garmet', async () => {
    const res = await createGarmet(token)
    expect(res.status).toBe(200)

    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('testingGarmet')
  })

  test('should create a review and add it to a garmet', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)
    const garmetId = res1.body._id

    const review = {
      name: 'user 1',
      comment: 'review user',
      rating: 5,
    }

    const res = await request(app)
      .put(`/api/v1/garmets/review/${garmetId}`)
      .send(review)
    expect(res.status).toBe(200)
    expect(res.body.totalRating).toBeGreaterThan(0)
    expect(res.body.reviews.length).toEqual(1)
  })

  test('should not create a review with the wrong data', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)

    const garmetId = res1.body._id

    const review = {
      //name: 'user 1',
      //comment: 'review user',
      rating: 10,
    }

    const res = await request(app)
      .put(`/api/v1/garmets/review/${garmetId}`)
      .send(review)
    expect(res.status).toBe(400)
  })

  test('should get back all garmets', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)

    const res2 = await createGarmet(token, {
      name: 'testinGarmet 2',
      description: 'description of garmet 2',
      category: 'category 2',
      stock: 2,
      price: 2,
      color: 'white',
      size: 'M',
      totalRating: 0,
    })

    expect(res2.status).toBe(200)

    const res = await request(app).get('/api/v1/garmets/')

    expect(res.body.length).toEqual(2)
    expect(res.body[0]._id).toEqual(res1.body._id)
    expect(res.body[1]._id).toEqual(res2.body._id)
  })

  test('should get back one garmet', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)

    const garmetId = res1.body._id
    const res = await request(app).get(`/api/v1/garmets/${garmetId}`)
    expect(res.body._id).toBe(garmetId)
  })

  test('should not get back garmet with wrong id', async () => {
    const res = await request(app).get(`/api/v1/garmets/${nonExistingGarmetId}`)
    expect(res.status).toBe(404)
  })

  test('should update an existing garmet', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)

    const garmetId = res1.body._id

    const update = {
      name: 'Garmet update',
      description: 'description of garmet 2',
      category: 'category 2',
      stock: 2,
      variant: {
        price: 2,
      },
      totalRating: 0,
    }

    const res = await request(app)
      .put(`/api/v1/garmets/${garmetId}`)
      .send(update)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.name).toEqual('Garmet update')
    expect(res.body.stock).toEqual(2)
  })

  test('should delete an existing garmet', async () => {
    const res1 = await createGarmet(token)
    expect(res1.status).toBe(200)

    const garmetId = res1.body._id

    const res = await request(app)
      .delete(`/api/v1/garmets/${garmetId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const resGet = await request(app).get(`/api/v1/garmet/${garmetId}`)
    expect(resGet.status).toBe(404)
  })
})
