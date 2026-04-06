import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Conversation from './pages/Conversation';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/conversation" element={<Conversation />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
