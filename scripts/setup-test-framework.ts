// `dotenv` is a devDependency
// tslint:disable-next-line no-implicit-dependencies no-var-requires
require('dotenv').config()

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  // tslint:disable-next-line no-console
  console.warn('Check your code for unhandled promises', error)
})
