import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthPages from './components/AuthPage';
import StudioList from './components/StudioList';
import AddStudio from './components/AddStudio';
import ProtectedRoute from './components/ProtectedRoute';
import StudioDetail from './components/StudioDetail';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPages />} />
          <Route path="/studios"
            element={
              <ProtectedRoute>
                <StudioList />
              </ProtectedRoute>
            }
          />
          <Route path="/add-studio"
            element={
              <ProtectedRoute>
                <AddStudio />
              </ProtectedRoute>
            }
          />
          <Route path="/studios/:id" element={<StudioDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;