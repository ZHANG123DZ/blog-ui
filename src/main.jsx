import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes, ScrollToTop, ErrorBoundary } from "./components";
import "./styles/index.scss";
import { Provider } from "react-redux";
import store from "./stores/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <ScrollToTop>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </ScrollToTop>
    </BrowserRouter>
  </ErrorBoundary>
);
