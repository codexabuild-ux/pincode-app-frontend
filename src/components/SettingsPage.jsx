import React, { useState, useCallback, useEffect } from 'react';
import { Page, Layout, Card, FormLayout, TextField, Button, Text, ChoiceList, Frame, Toast, Spinner } from '@shopify/polaris';
// ⚠️ IMPORTANT: Replace this with your backend's deployed URL
// This tells Vite to use the environment variable we set on Vercel
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dataSource, setDataSource] = useState(['csv']);
  const [shiprocketPassword, setShiprocketPassword] = useState('');
  const [startColor, setStartColor] = useState('#ff8a00');
  const [endColor, setEndColor] = useState('#e52e71');
  const [toastContent, setToastContent] = useState('');

  const handleDataSourceChange = useCallback((value) => setDataSource(value), []);
  const handlePasswordChange = useCallback((value) => setShiprocketPassword(value), []);
  const handleStartColorChange = useCallback((value) => setStartColor(value), []);
  const handleEndColorChange = useCallback((value) => setEndColor(value), []);
  const toggleToastActive = useCallback(() => setToastContent(''), []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/get-settings`)
      .then(response => response.json())
      .then(data => {
        setDataSource([data.dataSource]);
        setShiprocketPassword(data.shiprocketPassword || '');
        setStartColor(data.colors.start);
        setEndColor(data.colors.end);
        setIsLoading(false);
      })
      .catch(error => console.error("Failed to fetch settings:", error));
  }, []);

  const handleFormSubmit = useCallback(async () => {
    setIsSaving(true);
    const settings = {
      dataSource: dataSource[0],
      shiprocketPassword,
      colors: { start: startColor, end: endColor },
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/save-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Response not OK');
      setToastContent('Settings saved successfully!');
    } catch (error) {
      setToastContent('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  }, [dataSource, shiprocketPassword, startColor, endColor]);
  
  const toastMarkup = toastContent ? <Toast content={toastContent} onDismiss={toggleToastActive} /> : null;

  if (isLoading) {
    return <div style={{height: '100px'}}><Spinner accessibilityLabel="Loading settings" size="large" /></div>;
  }
  
  return (
    <Frame>
      <Page
        title="Estimated Delivery Time Settings"
        primaryAction={{
          content: 'Save',
          onAction: handleFormSubmit,
          loading: isSaving,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
               <Text variant="headingMd" as="h2">
                Data Source Configuration
                </Text>
                <ChoiceList
                  title="Select Data Source"
                  choices={[
                    { label: 'Manual CSV Upload', value: 'csv' },
                    { label: 'Shiprocket API', value: 'shiprocket' },
                  ]}
                  selected={dataSource}
                  onChange={handleDataSourceChange}
                />
                {dataSource[0] === 'shiprocket' && (
                  <TextField
                    label="Shiprocket API Password"
                    type="password"
                    value={shiprocketPassword}
                    onChange={handlePasswordChange}
                    helpText="Your credentials are encrypted and stored securely."
                  />
                )}
                {dataSource[0] === 'csv' && (
                  <p>Upload your `delivery_pincodes.csv` file to your app's backend directory.</p>
                )}
              </FormLayout>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <Heading>Storefront Widget Customization</Heading>
                <FormLayout.Group>
                  <TextField label="Gradient Start Color" type="color" value={startColor} onChange={handleStartColorChange} />
                  <TextField label="Gradient End Color" type="color" value={endColor} onChange={handleEndColorChange} />
                </FormLayout.Group>
                <div>
                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Button Preview:</p>
                  <button type="button" style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', background: `linear-gradient(to right, ${startColor}, ${endColor})` }}>
                    Check
                  </button>
                </div>
              </FormLayout>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      {toastMarkup}
    </Frame>
  );
}

export default SettingsPage;