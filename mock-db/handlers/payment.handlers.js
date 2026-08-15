const db = require('../db')

function servePackage(pkg) {
  return { ...pkg, originalPrice: pkg.unitPrice * pkg.sessionCount }
}

function registerPaymentHandlers(mock) {
  mock.onGet('/payment/packages').reply(() => [200, db.packages.map(servePackage)])

  mock.onGet('/payment/wallet').reply(() => [200, db.wallet])

  mock.onPost('/payment/checkout/initiate').reply((config) => {
    const { packageId } = JSON.parse(config.data)
    return [200, {
      checkoutFormContent: '<div>Mock Iyzico Ödeme Formu</div>',
      token: `mock-checkout-token-${packageId}`,
      paymentPageUrl: 'https://sandbox-payment.iyzipay.com',
    }]
  })
}

module.exports = { registerPaymentHandlers }
