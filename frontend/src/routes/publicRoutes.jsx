import About from '../pages/About'
import AllBooks from '../pages/AllBooks'
import BookDetails from '../pages/BookDetails'
import Home from '../pages/Home'

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/books', element: <AllBooks /> },
  { path: '/books/:bookId', element: <BookDetails /> },
  { path: '/about', element: <About /> },
]

export default publicRoutes
