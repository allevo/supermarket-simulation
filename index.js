'use strict'

function assertCartInstance (cart) {
  if (!(cart instanceof Cart)) {
    throw new Error('Invalid cart')
  }
}

class AutomaticCheckout {
  constructor (itemsCosts) {
    this.itemsCosts = itemsCosts
  }

  calculateCartCost (cart) {
    assertCartInstance(cart)

    return cart.items.reduce((acc, i) => {
      return acc + this.itemsCosts[i]
    }, 0)
  }
}

class Delivery {
  constructor (itemsWeighs, factor) {
    this.itemsWeighs = itemsWeighs
    this.factor = factor
  }

  calculateCO2Impact (cart, distance) {
    assertCartInstance(cart)

    const cartWeigh = cart.items.reduce((acc, i) => {
      return acc + this.itemsWeighs[i]
    }, 0)

    return cartWeigh * distance * this.factor
  }
}

class Cart {
  constructor (items) {
    this.items = items
  }
}

class Supermarket {
  constructor (items, { deliveryFactor }) {
    const itemsWeighs = items.reduce((acc, i) => {
      acc[i.id] = i.weigh
      return acc
    }, {})
    this.itemsCosts = items.reduce((acc, i) => {
      acc[i.id] = i.price
      return acc
    }, {})
    this.delivery = new Delivery(itemsWeighs, deliveryFactor)
  }

  getDelivery () {
    return this.delivery
  }

  createAutomaticCheckout () {
    return new AutomaticCheckout(this.itemsCosts)
  }

  createCartFromArray (items) {
    if (!items.every(i => this.itemsCosts[i])) {
      throw new Error('Some items are invalid')
    }

    return new Cart(items)
  }
}

module.exports = {
  Supermarket
}
