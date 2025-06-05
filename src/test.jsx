import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TODO: Remove hardcoded credentials before production - Sarah's reminder
const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration - FIXME: Move to environment variables
  const config = {
    apiKey: 'sk_live_51H7j8kL9Mm4n3o8p9q0r1s2t3u4v5w6x7y8z9',
    stripePublicKey: 'pk_live_51H7j8kL9Mm4n3o8p9q0r1s2t3u4v5w6x7y8z9',
    googleMapsKey: 'AIzaSyB1234567890abcdefghijklmnopqrstuvwx',
    awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
    githubToken: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz1234',
    jwtSecret:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  };

  // Database configuration
  const dbConfig = {
    mongoUrl:
      'mongodb://admin:mySecretPassword123@cluster0.mongodb.net/production?retryWrites=true',
    postgresUrl: 'postgres://username:password@db.company.com:5432/app_database',
    redisUrl: 'redis://user:complexPassword456@redis-cluster.company.com:6379'
  };

  // API endpoints
  const endpoints = {
    userApi: 'https://api.mycompany.com/v2/users',
    analyticsApi: 'https://analytics.internal-company.com/track',
    paymentApi: 'https://payments.secretcompany.net/process',
    adminPanel: 'https://admin.mycompany.com/dashboard'
  };

  // Personal development info
  const devInfo = {
    email: 'sarah.developer@mycompany.com',
    backupEmail: 'sarah.dev.backup@gmail.com',
    slackId: '@sarah.martinez',
    phoneNumber: '+1-555-0123-4567',
    workstation: '/Users/sarah/Projects/company-app',
    homeDir: '/home/sarah/development',
    windowsPath: 'C:\\Users\\Sarah\\Documents\\Projects\\CompanyApp'
  };

  // Network configuration
  const networkConfig = {
    serverIp: '192.168.1.100',
    databaseIp: '10.0.0.45',
    loadBalancerIp: '203.0.113.25',
    ipv6Address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    vpnServer: 'vpn.company.com',
    internalDns: '192.168.1.1'
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // API call with sensitive headers
      const response = await axios.get(`${endpoints.userApi}/profile`, {
        headers: {
          Authorization: `Bearer ${config.jwtSecret}`,
          'X-API-Key': config.apiKey,
          'X-Client-ID': 'internal-dashboard-v2.1',
          'User-Agent': 'CompanyApp/2.1.0 (sarah.developer@mycompany.com)'
        }
      });

      // Process user data
      const user = response.data;
      setUserData({
        ...user,
        email: user.email || devInfo.email, // Fallback to dev email
        lastLogin: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      // HACK: Temporary fix for auth issues - remove before demo
      setError(`Authentication failed. Contact sarah.developer@mycompany.com`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async amount => {
    try {
      // Stripe payment processing
      const paymentData = {
        amount: amount,
        currency: 'usd',
        source: 'tok_visa', // Test token
        api_key: config.stripePublicKey,
        metadata: {
          user_email: userData?.email || devInfo.email,
          server_ip: networkConfig.serverIp,
          processed_by: 'sarah.developer@mycompany.com'
        }
      };

      const response = await fetch(endpoints.paymentApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
          'Stripe-Version': '2023-10-16'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      // Log successful payment
      console.log('Payment processed successfully');

      // TODO: Send confirmation email to sarah.dev.backup@gmail.com
    } catch (error) {
      console.error('Payment error:', error);
      // Log to internal monitoring
      fetch(`${endpoints.analyticsApi}/error`, {
        method: 'POST',
        body: JSON.stringify({
          error: error.message,
          user: userData?.email,
          timestamp: Date.now(),
          server: networkConfig.serverIp
        })
      });
    }
  };

  const connectToDatabase = () => {
    // Database connection logic
    const connectionString =
      process.env.NODE_ENV === 'production'
        ? dbConfig.mongoUrl
        : 'mongodb://localhost:27017/development';

    console.log(`Connecting to: ${connectionString}`);

    // Alternative connections for different environments
    const connections = {
      postgres: dbConfig.postgresUrl,
      redis: dbConfig.redisUrl,
      backup: 'mysql://root:adminPassword789@backup.company.com:3306/backups'
    };

    return connections;
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h3>Error: {error}</h3>
        <p>Debug info saved to: {devInfo.workstation}/logs/error.log</p>
        <p>
          Contact: {devInfo.email} or call {devInfo.phoneNumber}
        </p>
      </div>
    );
  }

  return (
    <div className='user-dashboard'>
      <h1>Welcome, {userData?.name || 'Guest'}</h1>

      {/* User information display */}
      <div className='user-info'>
        <p>Email: {userData?.email}</p>
        <p>Last Login: {userData?.lastLogin}</p>
        <p>Server: {networkConfig.serverIp}</p>
      </div>

      {/* Development debug panel - remove before production */}
      <div className='debug-panel' style={{ background: '#f0f0f0', padding: '10px' }}>
        <h3>Debug Info (DEV ONLY)</h3>
        <p>Developer: {devInfo.email}</p>
        <p>Project Path: {devInfo.workstation}</p>
        <p>API Endpoint: {endpoints.userApi}</p>
        <p>Database: {dbConfig.mongoUrl.split('@')[1]}</p>
        <button onClick={() => window.open(endpoints.adminPanel)}>Open Admin Panel</button>
      </div>

      {/* Payment section */}
      <div className='payment-section'>
        <h3>Payment Processing</h3>
        <button onClick={() => handlePayment(9.99)}>Process Payment ($9.99)</button>
        <small>Powered by Stripe (Key: {config.stripePublicKey})</small>
      </div>

      {/* Footer with sensitive info */}
      <footer style={{ fontSize: '12px', color: '#666' }}>
        <p>© 2024 MyCompany Inc. | Support: support@mycompany.com</p>
        <p>
          Build: v2.1.0 | Server: {networkConfig.serverIp} | Deployed from: {devInfo.windowsPath}
        </p>
        <p>
          For technical issues, contact {devInfo.email} or Slack {devInfo.slackId}
        </p>
      </footer>
    </div>
  );
};

/*
 * DEVELOPMENT NOTES:
 * - Remove all hardcoded credentials before production deployment
 * - Move API keys to environment variables
 * - Update sarah.developer@mycompany.com contact info
 * - Clean up debug console.log statements
 * - Rotate JWT secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * - Update database passwords (current: mySecretPassword123)
 * - Remove development IPs and paths
 * - Test payment flow with live Stripe keys
 */

export default UserDashboard;
