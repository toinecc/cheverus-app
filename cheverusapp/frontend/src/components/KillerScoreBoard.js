import React from 'react';
import { HashTagIcon } from './icons/HashTagIcon';
import { HeartIcon } from './icons/HeartIcon';
import { PeopleIcon } from './icons/PeopleIcon';
import { GunIcon } from './icons/GunIcon';

export const KillerScoreBoard = ({ gameInfo, turnInfo }) => {
  return (
    <>
      <div className="scroll-element dart-info-text-h1"> Score board </div>

      <div
        className="dart-rounded-div-base"
        style={{
          justifyContent: 'space-between',
          margin: '0px 30px',
          heigh: 'none',
          border: 'none',
        }}
      >
        <div
          style={{
            width: '40%',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <PeopleIcon width={25} height={25} />
        </div>
        <div
          style={{
            width: '8%',
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '2px',
          }}
        >
          {' '}
          <HashTagIcon width={22} height={22} />{' '}
        </div>
        <div
          style={{
            width: '8%',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {' '}
          <GunIcon width={28} height={28} />{' '}
        </div>
        <div
          style={{
            width: '8%',
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '2px',
          }}
        >
          {' '}
          <HeartIcon width={22} height={22} />{' '}
        </div>
      </div>

      {gameInfo.players.map((player) => {
        return (
          <div
            className="dart-rounded-div-base"
            style={{
              justifyContent: 'space-between',
              border: 'solid 2px',
              color: player.isDead ? '#000000' : '#efe3ce',
            }}
          >
            <div style={{ width: '40%', textAlign: 'center' }}>
              {player.name}
            </div>
            <div style={{ width: '8%', textAlign: 'center' }}>
              {' '}
              {player.number}{' '}
            </div>
            <div style={{ width: '8%', textAlign: 'center' }}>
              {' '}
              {player.canKill ? 'X' : ''}{' '}
            </div>
            <div style={{ width: '8%', textAlign: 'center' }}>
              {' '}
              {player.lifes}{' '}
            </div>
          </div>
        );
      })}

      <div className="scroll-element dart-info-text-h2">
        {'Round n° ' + turnInfo.number}
      </div>
      <div className="scroll-element dart-info-text-h2">
        {turnInfo.player.name + ", it's your turn to shoot !"}
      </div>
    </>
  );
};
