process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  // tslint:disable-next-line no-console
  console.warn('Check your code for unhandled promises', error)
})
