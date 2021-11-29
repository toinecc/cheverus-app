import React, { useState, useEffect } from 'react';
import {} from '@ant-design/icons';
import '../App.less';
import { Button, message } from 'antd';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { DartBottomLeft } from './icons/DartBottomLeft';
import { PeopleIcon } from './icons/PeopleIcon';
import { KillerGamePage } from './KillerGamePage';
import { KillerSettingsPage } from './KillerSettingsPage';

export const DartGame = () => {
  const [token, setToken] = useCookies(['cheverus-token']);
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const [pageContext, setPageContext] = useState({
    currentPage: 'gameParams',
  });

  const [gameInfo, setGameInfo] = useState({
    gameId: null,
    gameType: null,
    maxLifeNumber: null,
    players: [],
  });

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

  const GameParamsPage = () => {
    return (
      <>
        <div className="scroll-element dart-info-text-h1"> New game </div>

        <div
          className="scroll-element dart-info-text-h2"
          style={{ justifyContent: 'start', marginLeft: '30px' }}
        >
          <DartBottomLeft width={25} height={25} />
          <div style={{ marginLeft: '10px' }}> Game type </div>
        </div>

        <Button
          className="dart-rounded-div-base"
          style={
            gameInfo.gameType === 'Killer'
              ? {
                  color: '#2c2727',
                  backgroundColor: '#efe3ce',
                }
              : {}
          }
          onClick={() => {
            gameInfo.gameType === 'Killer'
              ? setGameInfo({ ...gameInfo, gameType: null })
              : setGameInfo({ ...gameInfo, gameType: 'Killer' });
          }}
        >
          Killer
        </Button>

        <div
          className="scroll-element dart-info-text-h2"
          style={{ justifyContent: 'start', marginLeft: '30px' }}
        >
          <PeopleIcon width={25} height={25} />
          <div style={{ marginLeft: '10px' }}> Players </div>
        </div>

        {availablePlayers.map((player) => {
          return (
            <Button
              className="dart-rounded-div-base"
              style={
                gameInfo.players.includes(player)
                  ? {
                      color: '#2c2727',
                      backgroundColor: '#efe3ce',
                    }
                  : {}
              }
              onClick={() => {
                gameInfo.players.includes(player)
                  ? setGameInfo({
                      ...gameInfo,
                      players: gameInfo.players.filter(function (v, i, arr) {
                        return v.name !== player.name;
                      }),
                    })
                  : setGameInfo({
                      ...gameInfo,
                      players: gameInfo.players.concat([player]),
                    });
              }}
            >
              {player.name}
            </Button>
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
              if (gameInfo.players.length > 1) {
                if (gameInfo.gameType === 'Killer') {
                  setPageContext({
                    ...pageContext,
                    currentPage: 'killerGameSettings',
                  });
                } else {
                  message.error('You have to select a game mode.');
                }
              } else {
                message.error('You have to select at least two players.');
              }
            }}
          >
            {'Next'}
          </Button>
        </div>
      </>
    );
  };

  let currentPage = null;
  if (pageContext.currentPage === 'gameParams') {
    currentPage = <GameParamsPage />;
  } else if (pageContext.currentPage === 'killerGameSettings') {
    currentPage = (
      <KillerSettingsPage
        gameInfo={gameInfo}
        setGameInfo={setGameInfo}
        pageContext={pageContext}
        setPageContext={setPageContext}
      />
    );
  } else if (pageContext.currentPage === 'killerGame') {
    currentPage = (
      <KillerGamePage gameInfo={gameInfo} setGameInfo={setGameInfo} />
    );
  }

  return (
    <div className="scroll-content-container">
      <div className="scroll-content dart-background">{currentPage}</div>
    </div>
  );
};
