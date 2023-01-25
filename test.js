'use strict'

const t = require('tap')

const { Supermarket } = require('./index')

t.test('supermarket', t => {
  const supermarket = new Supermarket([
    { id: 'A', price: 50, weigh: 20 },
    { id: 'B', price: 30, weigh: 10 },
    { id: 'C', price: 20, weigh: 2 },
    { id: 'D', price: 15, weigh: 50 }
  ], { deliveryFactor: 0.5 })

  t.test('createCartFromArray', t => {
    t.test('ok', t => {
      const cart = supermarket.createCartFromArray(['A', 'A', 'B'])
      t.strictSame(cart.items, ['A', 'A', 'B'])
      t.end()
    })
    t.test('error: unknown item', t => {
      t.throws(() => supermarket.createCartFromArray(['G']))
      t.end()
    })
    t.end()
  })

  t.test('AutomaticCheckout', t => {
    const checkout = supermarket.createAutomaticCheckout()
    const tests = [
      {
        items: ['A', 'B', 'C', 'A'],
        expectedCost: 150
      }
    ]
    for (const test of tests) {
      const { items, expectedCost } = test
      const title = `calculateCartCost(${items.join(',')}) == ${expectedCost}`
      t.test(title, t => {
        const cart = supermarket.createCartFromArray(items)
        const cost = checkout.calculateCartCost(cart)
        t.equal(cost, expectedCost)
        t.end()
      })
    }

    t.test('calculateCartCost accepts only Cart instance', t => {
      t.throws(() => checkout.calculateCartCost([]))
      t.end()
    })

    t.end()
  })

  t.test('Delivery', t => {
    const delivery = supermarket.getDelivery()

    t.test('calculateCO2Impact', t => {
      const cart = supermarket.createCartFromArray(['A', 'B', 'C', 'A'])
      const c02 = delivery.calculateCO2Impact(cart, 20.5)
      t.equal(c02, 533)

      t.end()
    })

    t.test('calculateCO2Impact accepts only Cart instance', t => {
      t.throws(() => delivery.calculateCO2Impact([], 0))
      t.end()
    })

    t.end()
  })

  t.end()
})
