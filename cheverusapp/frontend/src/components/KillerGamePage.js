import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { KillerScoreBoard } from './KillerScoreBoard';
import { KillerRegisterTurn } from './KillerRegisterTurn';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export const KillerGamePage = ({ gameInfo, setGameInfo }) => {
  // Initializationss
  const initialShotsState = {
    0: {
      aimedNumber: null,
      touchedZone: null,
      touchedNumber: null,
    },
    1: {
      aimedNumber: null,
      touchedZone: null,
      touchedNumber: null,
    },
    2: {
      aimedNumber: null,
      touchedZone: null,
      touchedNumber: null,
    },
  };

  const [killerGamePageContext, setKillerGamePageContext] = useState({
    page: 'scoreboard',
  });

  const [turnInfo, setTurnInfo] = useState({
    number: null,
    player: gameInfo.players[0],
    shots: initialShotsState,
  });

  const [justRefresh, setJustRefresh] = useState(true);

  const [token, setToken] = useCookies(['cheverus-token']);

  // Initialize game context on first loading
  if (!turnInfo.number) {
    setTurnInfo({
      ...turnInfo,
      number: 1,
    });
    gameInfo.lifeRequired = false;
    gameInfo.players.map((player) => {
      player.lifes = 0;
      player.canKill = false;
      player.isDead = false;
    });
  }

  //
  const registerTurn = (turnInfo, gameInfo, appToken, setTurnInfo) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    let data = {
      turnInfo: turnInfo,
      gameId: gameInfo.gameId,
    };
    axios
      .post('/api/dart/shots/register_shots/', data, { headers: headers })
      .then(function (resp) {
        // Increase turn number => this trigger game info reloading
        const newTurnNumber = turnInfo.number + 1;
        const currentPlayerName = turnInfo.player.name;
        let isNext = false;
        for (var i = 0; i < gameInfo.players.length + 1; i++) {
          const tmpPlayer = gameInfo.players[i % gameInfo.players.length];
          if (currentPlayerName === tmpPlayer.name) {
            isNext = true;
          }
          if (!tmpPlayer.isDead) {
            if ((currentPlayerName !== tmpPlayer.name) & isNext) {
              setTurnInfo({
                ...turnInfo,
                number: newTurnNumber,
                shots: initialShotsState,
                player: tmpPlayer,
              });
              break;
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  //
  const loadGameState = (
    gameInfo,
    setGameInfo,
    turnInfo,
    setTurnInfo,
    appToken
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + appToken,
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .get('/api/dart/games/' + gameInfo.gameId + '/get_killer_status/', {
        headers: headers,
      })
      .then(function (resp) {
        const lifeRequired = resp.data.lifeRequired;
        const playersInfo = resp.data.playersInfo;
        setGameInfo({
          ...gameInfo,
          lifeRequired: lifeRequired,
        });
        gameInfo.players.map((player) => {
          const playerId = player.id;
          player.lifes = playersInfo[playerId].lifes;
          player.canKill = playersInfo[playerId].canKill;
          player.isDead = playersInfo[playerId].isDead;
        });
        setJustRefresh(!justRefresh);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  //
  const checkRegisteredValues = (turnInfo) => {
    let isOk = true;
    for (const [key, shot] of Object.entries(turnInfo.shots)) {
      if (!shot.touchedZone) {
        isOk = false;
      }
    }
    return isOk;
  };

  //
  useEffect(() => {
    loadGameState(
      gameInfo,
      setGameInfo,
      turnInfo,
      setTurnInfo,
      token['cheverus-token']
    );
  }, [turnInfo.number]);

  //
  useEffect(() => {}, [justRefresh]);

  return (
    <>
      {killerGamePageContext.page === 'scoreboard' ? (
        <KillerScoreBoard gameInfo={gameInfo} turnInfo={turnInfo} />
      ) : (
        <KillerRegisterTurn
          gameInfo={gameInfo}
          setGameInfo={setGameInfo}
          turnInfo={turnInfo}
          setTurnInfo={setTurnInfo}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          className="dart-rounded-div-base"
          style={{
            marginTop: '30px',
            width: '50%',
            fontSize: '18px',
            fontWeight: 'bold',
            justifyContent: 'space-around',
          }}
          onClick={() => {
            if (killerGamePageContext.page === 'scoreboard') {
              setKillerGamePageContext({ page: 'registerturn' });
            } else {
              const canRegisterTurn = checkRegisteredValues(turnInfo);
              if (canRegisterTurn) {
                // Log in db
                registerTurn(
                  turnInfo,
                  gameInfo,
                  token['cheverus-token'],
                  setTurnInfo
                );
                // then show scoreboard again
                setKillerGamePageContext({ page: 'scoreboard' });
              } else {
                message.error('You forget to filled some info !');
              }
            }
          }}
        >
          {killerGamePageContext.page === 'scoreboard'
            ? 'Register turn'
            : 'Validate turn'}
        </Button>
      </div>
    </>
  );
};
