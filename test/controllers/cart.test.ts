/* eslint-disable @typescript-eslint/member-delimiter-style */
import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

//lets create the types first

interface GarmetDocumentTest extends Document {
  title: string
  description: string
  category: string
  countInStock: number
  price: number
  color: string
  size: string
  generalRating: number
  qty: number
}

type InputData = {
  garmetId: string
  quantity: number
}

const createUser = async (inputData?: Partial<UserDocument>) => {
  let user: Partial<UserDocument> = {
    firstName: 'name',
    lastName: 'surname',
    email: 'helloworld@gmail.com',
    age: 22,
    password: 'hellohello',
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
    title: 'testingGarmet',
    description: 'this is a testin description',
    category: 'testing category',
    countInStock: 2,
    price: 222,
    color: 'red',
    size: 'XL',
    generalRating: 2,
    qty: 2,
  }
  if (inputData) {
    garmet = { ...inputData }
  }
  return request(app)
    .post('/api/v1/garmets')
    .set('Content-Type', 'multipart/form-data')
    .field('title', garmet.title as string)
    .field('description', garmet.description as string)
    .field('category', garmet.category as string)
    .field('countInStock', (garmet.countInStock as number).toString())
    .field('price', (garmet.price as number).toString())
    .field('color', garmet.color as string)
    .field('size', garmet.size as string)
    .field('generalRating', (garmet.generalRating as number).toString())
    .field('qty', (garmet.price as number).toString())
    .attach('image', '')
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

const createCart = async (
  uid: string,
  id: string,
  inputData?: Partial<InputData>
) => {
  let cart: Partial<InputData> = {
    garmetId: id,
    quantity: 2,
  }

  if (inputData) {
    cart = { ...inputData }
  }

  return await request(app).post(`/api/v1/cart/${uid}`).send(cart)
}

describe('cart controller', () => {
  let uid: string
  let id: string
  let token: string

  beforeEach(async () => {
    await dbHelper.connect()
    const user = await createUser()
    uid = user.id
    token = user.token
    const resProd = await createGarmet(token)
    id = resProd._id
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a new cart', async () => {
    const res = await createCart(uid, id)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.items.length).toEqual(1)
  })

  it('should not create a cart with the wrong data', async () => {
    const res = await createCart(uid, 'something')
    expect(res.status).toBe(400)
  })

  it('should get back the user cart', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).get(`/api/v1/cart/${uid}`)
    expect(res.status).toBe(200)
  })

  it('should remove a garmet inside the cart', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).put(`/api/v1/cart/${uid}/${id}`)
    expect(res.status).toEqual(200)
    expect(res.body.items.length).toEqual(0)
  })

  it('should delete the entire cart of the user', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).delete(`/api/v1/cart/${uid}`)
    expect(res.status).toEqual(204)
    const resGet = await request(app).get(`/api/v1/cart/${uid}`)
    expect(resGet.status).toEqual(404)
  })
})
