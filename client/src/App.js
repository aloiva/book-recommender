import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Link } from 'react-router-dom'
import SideNav from "./components/SideNav";
import SearchBar from "./components/SearchBar";
import Featured from "./components/Featured";
import Rows from "./components/Rows";
import ViewBook from "./components/ViewBook"
import AllBooks from './components/AllBooks'
import SearchPage from "./components/SearchPage"
import AllRatings from "./components/AllRatings"
import SwitchUser from "./components/SwitchUser"
import Recommender from "./components/Recommender"
import Footer from './components/Footer'
import "bootstrap/dist/css/bootstrap.min.css";
import { RiH1 } from "react-icons/ri";

function App() {
  return (
    <Router>

      <div className="container-fluid">
        <div className="main-page">
          <SideNav />
          <SearchBar />
          <Routes>
            <Route path="/" element={<Featured />} />
            <Route path="/browse_genres" element={<Rows />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/view/book" element={<ViewBook />} />
            <Route path="/books" element={<AllBooks />} />
            <Route path="/ratings" element={<AllRatings />} />
            <Route path="/switch_user" element={<SwitchUser />} />
            <Route path="/recommender" element={<Recommender />} />
          </Routes>
        </div>
      </div>
      
    </Router >
  );
}

export default App;
