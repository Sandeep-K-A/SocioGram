import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./utils/store/store";
import "./App.css";
import { PersistGate } from "redux-persist/integration/react";
import { userRoutes } from "./user/userRoutes";
import { adminRoutes } from "./admin/adminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}>
          <Router>
            <Routes>
              {userRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Router>
          <Router>
            <Routes>
              {adminRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Router>
        </PersistGate>
        <ToastContainer />
      </Provider>
    </>
  );
}

export default App;
