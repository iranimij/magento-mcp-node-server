import fetch from 'node-fetch';
import https from 'https';

const baseUrl = process.env.MAGENTO_API_URL;
const username = process.env.MAGENTO_ADMIN_USERNAME;
const password = process.env.MAGENTO_ADMIN_PASSWORD;

const agent = new https.Agent({ rejectUnauthorized: false });

let cachedToken: string | null = null;


export async function getMagentoToken(): Promise<string> {
  if (!baseUrl || !username || !password) {
    console.error('Missing environment variables:', { baseUrl, username, password });
    throw new Error('MAGENTO_API_URL, MAGENTO_ADMIN_USERNAME, or MAGENTO_ADMIN_PASSWORD is not set in environment variables.');
  }
  const url = `${baseUrl}/rest/V1/integration/admin/token`;
  console.log('Magento Auth Request:', { url, username });
  try {
    const response = await fetch(url, {
      method: 'POST',
      agent,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Magento Auth Error Response:', errorBody);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const token = await response.json();
    if (typeof token === 'string') {
      cachedToken = token;
      return token;
    } else {
      console.error('Unexpected token response:', token);
      throw new Error('Unexpected token response from Magento API');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Fetch error: ${error}`);
  }
} 