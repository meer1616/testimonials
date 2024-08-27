import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DynamicComponent from './components/DynamicComponent';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import DashboardPage from './Pages/DashboardPage';
import ConfirmEmail from './components/ConfirmEmail';
import CreateSpaceSuccess from './components/CreateSpaceSuccess';
import TestimonialOuter from './components/TestimonialOuter';
import IndividualTestimonial from './components/IndividualTestimonial';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes/>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/createspacesuccess" element={<CreateSpaceSuccess />} />
          <Route path="/testimonials/:spaceId" element={<TestimonialOuter />} />
          <Route path="/:spaceId" element={<DynamicComponent />} />
          </Route>
          <Route path="/individual/testimonials/:testimonialId/:spaceId" element={<IndividualTestimonial />} />
          <Route path="/confirmemail" element={<ConfirmEmail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
