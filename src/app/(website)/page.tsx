import React from 'react'
import Home from './home/home'
import AboutSection from './home/AboutSection'
import ServicesSection from './home/ServicesSection'
import EventsSection from './home/EventsSection'
import GallerySection from './home/GallerySection'
const page = () => {
  return (
    <>
      <Home/>
      <AboutSection/>
      <ServicesSection />
      <EventsSection/>
      <GallerySection/>
    </>
  )
}

export default page