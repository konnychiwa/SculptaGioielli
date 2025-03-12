import { Route, Routes } from 'react-router-dom';
import Home from './assets/components/Home';
import Navbar from './assets/components/Navbar';
import Bracciali from './assets/pages/Bracciali';
import Anelli from './assets/pages/Anelli';
import Orecchini from './assets/pages/Orecchini';
import Collane from './assets/pages/Collane';
import Footer from './assets/components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bracciali" element={<Bracciali />} />
        <Route path="/anelli" element={<Anelli />} />
        <Route path="/orecchini" element={<Orecchini />} />
        <Route path="/collane" element={<Collane />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
