const ACCESS_KEY = process.env.ACCESS_KEY
const API_URL = `https://api.unsplash.com/photos/random/?client_id=${ACCESS_KEY}`

// 🍑 & 🐈
const KEYWORDS = 'sexy+bikini+lingerie+cats+kitties'

const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

const createElementWithAttributes = (tag, attributes) => {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([attribute, value]) => {
    element.setAttribute(attribute, value)
  })
  return element
}

let ready = false
let imagesLoaded = 0
let totalImages = 0

const handleLoadedImages = () => {
  imagesLoaded++

  if (imagesLoaded === totalImages) {
    ready = true
    loader.hidden = true
  }
}
// Create elements for links & photos, add to DOM
const displayPhotos = photos => {
  // reset counter
  imagesLoaded = 0

  totalImages = photos.length

  photos.forEach(({ alt_description, links: { html }, urls: { regular } }) => {
    // create a tag as link to unsplash
    const link = createElementWithAttributes('a', {
      href: html,
      target: '_blank'
    })

    //  create img tag for photo
    const img = createElementWithAttributes('img', {
      src: regular,
      alt: alt_description,
      title: alt_description
    })

    // check when each image is finished loading
    img.addEventListener('load', handleLoadedImages)

    // put <img> inside <a> and append to container
    link.appendChild(img)
    imageContainer.appendChild(link)
  })
}

const getPhotos = async (numPhotosToLoad, query) => {
  const URL = `${API_URL}&count=${numPhotosToLoad}&query=${query}`
  try {
    const response = await fetch(URL)
    photos = await response.json()
    displayPhotos(photos)
  } catch (error) {}
}

//  if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false
    getPhotos(20, KEYWORDS)
  }
})

// on load
getPhotos(5, KEYWORDS)
