import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ROUTES } from './constants/routes';
import { App } from './components/routes/app/app';
import { Login } from './components/routes/login/login';
import { DragProvider } from './libs/dragging/drag-context';

const root = createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path={ROUTES.index}
        element={
          <DragProvider>
            <App />
          </DragProvider>
        }
      />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path="*" element="Not found" />
    </Routes>
  </BrowserRouter>,
);
