import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import Buy from './pages/Buy'
import Rent from './pages/Rent'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
export default function App() {
  return <BrowserRouter><Routes><Route element={<MainLayout />}>
    <Route index element={<Home />} /><Route path="properties" element={<Properties />} />
    <Route path="properties/:propertyId" element={<PropertyDetails />} />
    <Route path="buy" element={<Buy />} /><Route path="rent" element={<Rent />} />
    <Route path="about" element={<About />} /><Route path="contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes></BrowserRouter>
}
