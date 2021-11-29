import React, { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { DartMenuTitle } from './PageElements';
import { Form, Input, Button, message } from 'antd';

const Auth = () => {
  const [token, setToken] = useCookies(['cheverus-token']);

  useEffect(() => {
    if (token['cheverus-token']) {
      window.location.href = '/app/dartdevil/home';
    }
  }, [token]);

  const onFinish = (data) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .post('/api/auth/', data, { headers: headers })
      .then((resp) => {
        console.log(resp);
        setToken('cheverus-token', resp.data.token);
      })
      .catch((err) => {
        console.log('Error while fetching usertoken ...', err);
        message.error('Failed to login');
      });
  };

  return (
    <div className="scroll-content-container">
      <div className="scroll-content dart-background">
        <DartMenuTitle />

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
