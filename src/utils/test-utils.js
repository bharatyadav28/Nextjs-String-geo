import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { setupStore } from '../store'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { setupListeners } from '@reduxjs/toolkit/query';
// import { createMemoryHistory } from 'history';

export async function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  // const history = createMemoryHistory();

  // setupListeners(store.dispatch);
  
  function Wrapper({ children }) {
    return (
      <GoogleOAuthProvider clientId="6324397489-81envusj0p5170flss2evhqec45o4kfo.apps.googleusercontent.com">
        <Provider store={store}>
          {/* <BrowserRouter history={history}> */}
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  // return { store, history, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}