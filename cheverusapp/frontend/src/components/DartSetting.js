import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Modal, Input, Form, message } from 'antd';
import {} from '@ant-design/icons';
import '../App.less';
import { PenIcon } from './icons/PenIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusRoundedIcon } from './icons/PlusRoundedIcon';
import axios from 'axios';
import { useCookies } from 'react-cookie';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

export const DartSetting = () => {
  const [token, setToken] = useCookies(['cheverus-token']);

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [settingModalProps, setSettingModalProps] = useState({
    visible: false,
    title: '',
  });
  const [playerToEditName, setPlayerToEditName] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getavailablePlayers(token['cheverus-token']);
  }, []);

  const getavailablePlayers = (appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .get('/api/dart/players/list_players/', { headers: headers })
      .then((resp) => {
        const data = resp.data;
        const players = data.map((e) => {
          return {
            name: e.name,
            id: e.id,
          };
        });
        setAvailablePlayers(players);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  const addPlayer = (playerName, appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    const data = {
      name: playerName,
    };
    axios
      .post('/api/dart/players/create_player/', data, { headers: headers })
      .then(function (resp) {
        getavailablePlayers(appToken);
      })
      .catch((err) => {
        console.log('Error', err);
        message.error('You can not create more than 15 players');
      });
  };

  const editPlayer = (playerName, newPlayerName, appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    const data = {
      name: playerName,
      new_name: newPlayerName,
    };
    axios
      .put('/api/dart/players/update_player/', data, { headers: headers })
      .then(function (resp) {
        getavailablePlayers(appToken);
      })
      .catch((err) => {
        console.log('Error', err);
        message.error('Something went wront during edition');
      });
  };

  const deletePlayer = (playerName, appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token 07361c0901d796ec9700bf8b527400d6990a66af',
      'Access-Control-Allow-Origin': '*',
    };
    const params = {
      name: playerName,
    };
    axios
      .delete('/api/dart/players/delete_player/', {
        headers: headers,
        params: params,
      })
      .then(function (resp) {
        getavailablePlayers(appToken);
      })
      .catch((err) => {
        console.log('Error', err);
        message.error('Something went wront during deletion');
      });
  };

  const SettingModal = () => {
    const layout = {};

    return (
      <Modal
        title={settingModalProps.title}
        visible={settingModalProps.visible}
        footer={null}
        onCancel={() => {
          setSettingModalProps({ ...settingModalProps, visible: false });
        }}
      >
        <Form
          {...layout}
          form={form}
          name="createPlayerForm"
          onFinish={() => {
            if (settingModalProps.title === 'Create player') {
              addPlayer(form.getFieldValue().name, token['cheverus-token']);
            } else if (settingModalProps.title === 'Edit player') {
              editPlayer(
                playerToEditName,
                form.getFieldValue().name,
                token['cheverus-token']
              );
            }
            setSettingModalProps({ ...settingModalProps, visible: false });
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {settingModalProps.title === 'Create player' ? 'Create' : 'Edit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="scroll-content-container">
      <div className="scroll-content dart-background">
        <div className="scroll-element dart-info-text-h1">Existing players</div>

        {availablePlayers.map((player) => {
          return (
            <div
              className="dart-rounded-div-base"
              style={{ justifyContent: 'space-between', border: 'solid 2px' }}
            >
              {player.name}
              <div>
                <Button
                  icon={<PenIcon width={21} height={21} />}
                  ghost={true}
                  style={{ border: 'none' }}
                  onClick={() => {
                    setPlayerToEditName(player.name);
                    setSettingModalProps({
                      ...settingModalProps,
                      visible: true,
                      title: 'Edit player',
                    });
                    form.setFieldsValue({
                      name: player.name,
                    });
                  }}
                />

                <Popconfirm
                  title="Sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => {
                    deletePlayer(player.name, token['cheverus-token']);
                  }}
                >
                  <Button
                    icon={<TrashIcon width={21} height={21} />}
                    ghost={true}
                    style={{ border: 'none' }}
                  />
                </Popconfirm>
              </div>
            </div>
          );
        })}

        <div
          className="dart-rounded-div-base"
          style={{ justifyContent: 'center' }}
        >
          <Button
            icon={<PlusRoundedIcon width={22} height={22} />}
            ghost={true}
            style={{ border: 'none', color: '#efe3ce', fontSize: '16px' }}
            onClick={() => {
              setSettingModalProps({
                ...settingModalProps,
                visible: true,
                title: 'Create player',
              });
              form.setFieldsValue({
                name: '',
              });
            }}
          />
          Create a new player
        </div>

        <SettingModal />
      </div>
    </div>
  );
};
