import React from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import SettingsPage from './components/SettingsPage';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <SettingsPage />
    </AppProvider>
  );
}

export default App;