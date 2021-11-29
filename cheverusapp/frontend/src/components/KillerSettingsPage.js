import React, { useEffect } from 'react';
import {} from '@ant-design/icons';
import '../App.less';
import { Button, message, InputNumber } from 'antd';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { HeartIcon } from './icons/HeartIcon';
import { HashTagIcon } from './icons/HashTagIcon';

export const KillerSettingsPage = ({
  gameInfo,
  setGameInfo,
  pageContext,
  setPageContext,
}) => {
  const [token, setToken] = useCookies(['cheverus-token']);

  const initializeKillerPlayer = (appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .post('/api/dart/killer_players/create_players/', gameInfo, {
        headers: headers,
      })
      .then((resp) => {
        setPageContext({
          ...pageContext,
          currentPage: 'killerGame',
        });
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  const initializeKillerGame = (appToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .post('/api/dart/games/create_game/', gameInfo, { headers: headers })
      .then((resp) => {
        setGameInfo({ ...gameInfo, gameId: resp.data.killer_game_id });
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  useEffect(() => {
    if (
      gameInfo.gameId &&
      gameInfo.maxLifeNumber &&
      gameInfo.gameType &&
      gameInfo.players.length > 1
    ) {
      initializeKillerPlayer(token['cheverus-token']);
    }
  }, [gameInfo]);

  return (
    <>
      <div className="scroll-element dart-info-text-h1"> New killer game </div>

      <div
        className="scroll-element dart-info-text-h2"
        style={{ justifyContent: 'start', marginLeft: '30px' }}
      >
        <HeartIcon width={22} height={22} />
        <div style={{ marginLeft: '10px' }}> Number of lifes </div>
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          className="dart-rounded-div-base"
          style={
            gameInfo.maxLifeNumber === 3
              ? {
                  color: '#2c2727',
                  backgroundColor: '#efe3ce',
                }
              : {}
          }
          onClick={() => {
            gameInfo.maxLifeNumber === 3
              ? setGameInfo({ ...gameInfo, maxLifeNumber: null })
              : setGameInfo({ ...gameInfo, maxLifeNumber: 3 });
          }}
        >
          3
        </Button>
        <Button
          className="dart-rounded-div-base"
          style={
            gameInfo.maxLifeNumber === 5
              ? {
                  color: '#2c2727',
                  backgroundColor: '#efe3ce',
                }
              : {}
          }
          onClick={() => {
            gameInfo.maxLifeNumber === 5
              ? setGameInfo({ ...gameInfo, maxLifeNumber: null })
              : setGameInfo({ ...gameInfo, maxLifeNumber: 5 });
          }}
        >
          5
        </Button>
      </div>

      <div
        className="scroll-element dart-info-text-h2"
        style={{ justifyContent: 'start', marginLeft: '30px' }}
      >
        <HashTagIcon width={22} height={22} />
        <div style={{ marginLeft: '10px' }}> Player numbers </div>
      </div>

      {gameInfo.players.map((player) => {
        return (
          <div
            className="dart-rounded-div-base"
            style={{ justifyContent: 'space-between', border: 'solid 2px' }}
          >
            {player.name}
            <InputNumber
              min={1}
              max={20}
              onChange={(v) => {
                player.number = v;
              }}
            />
          </div>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          className="dart-rounded-div-base"
          style={{
            marginTop: '100px',
            width: '50%',
            fontSize: '18px',
            fontWeight: 'bold',
            justifyContent: 'space-around',
          }}
          onClick={() => {
            if (Number.isInteger(gameInfo.maxLifeNumber)) {
              const numbers = gameInfo.players.map((player) => {
                return player.number;
              });
              const numbersSet = new Set(numbers);
              if (numbers.every(Number.isInteger)) {
                if (numbersSet.size === numbers.length) {
                  initializeKillerGame(token['cheverus-token']);
                  // initializeKillerPlayer(token["cheverus-token"])
                } else {
                  message.error('Two players have the same number.');
                }
              } else {
                message.error('You have to set a number for each player.');
              }
            } else {
              message.error('You have to select a number of life.');
            }
          }}
        >
          {'Play'}
        </Button>
      </div>
    </>
  );
};
