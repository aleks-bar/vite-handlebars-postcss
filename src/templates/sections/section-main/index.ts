import './index.pcss'

export const clickButton = () => {
  const button = document.querySelector('.section-main button')

  if ( button ) {
    button.addEventListener('click', () => {
      console.log('main section button')
    })
  }
}