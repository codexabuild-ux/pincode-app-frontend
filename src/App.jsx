import React, { useState, useCallback } from 'react';
import { AppProvider, Page, Layout, Card, FormLayout, TextField, Button, Text } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css'; // Corrected Path

function App() {
  const [startColor, setStartColor] = useState('#ff8a00');
  const [endColor, setEndColor] = useState('#e52e71');

  const handleStartColorChange = useCallback((value) => setStartColor(value), []);
  const handleEndColorChange = useCallback((value) => setEndColor(value), []);

  const handleFormSubmit = useCallback(() => {
    const settings = {
      colors: {
        start: startColor,
        end: endColor,
      },
    };
    console.log('Saving settings:', settings);
    // In a real app, you would send this to your backend.
  }, [startColor, endColor]);

  return (
    <AppProvider i18n={{Polaris: {}}}>
      <Page
        title="Widget Customization"
        primaryAction={{
          content: 'Save',
          onAction: handleFormSubmit,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <Text variant="headingMd" as="h2">Storefront Widget Customization</Text>
                <FormLayout.Group>
                  <TextField
                    label="Gradient Start Color"
                    type="color"
                    value={startColor}
                    onChange={handleStartColorChange}
                  />
                  <TextField
                    label="Gradient End Color"
                    type="color"
                    value={endColor}
                    onChange={handleEndColorChange}
                  />
                </FormLayout.Group>
                <div>
                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Button Preview:</p>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      fontWeight: 'bold',
                      background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                    }}
                  >
                    Check
                  </button>
                </div>
              </FormLayout>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

export default App;