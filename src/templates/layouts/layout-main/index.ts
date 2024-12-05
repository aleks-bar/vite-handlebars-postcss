import '@layouts/base/header'
import '@layouts/base/footer'
import '@shared'

// @ts-ignore
import { app } from '@js-core';

document.addEventListener('DOMContentLoaded', () => {
  app.initDependencies()
})