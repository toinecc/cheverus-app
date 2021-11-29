import React from 'react';
import { DartBoard } from './DartBoard';
import { DeleteArrow } from './icons/DeleteArrow';

export const KillerRegisterTurn = ({ gameInfo, turnInfo, setTurnInfo }) => {
  const TurnSummaryArray = ({ turnInfo }) => {
    return (
      <table class="turn-summary-table">
        <thead>
          <tr>
            <th>Dart</th>
            <th>Number touched</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(turnInfo.shots).map(function (key, index) {
            let textDisplay = '';
            const touchedZone = turnInfo.shots[index].touchedZone;
            if (touchedZone) {
              if (['25', '50'].includes(touchedZone)) {
                textDisplay = touchedZone;
              } else if (touchedZone === 'out') {
                textDisplay = 'Out';
              } else {
                textDisplay =
                  turnInfo.shots[index].touchedNumber +
                  '  (x' +
                  touchedZone +
                  ')';
              }
            }
            return (
              <tr>
                <td> {index + 1} </td>
                <td> {textDisplay} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const removeLastClick = (e, turnInfo, setTurnInfo) => {
    // Get last recorded dart number
    let dartNumber = 0;
    let i;
    for (i = 1; i <= 3; i++) {
      if (turnInfo.shots[i - 1].touchedZone) {
        dartNumber = i;
      }
    }
    // Remove last recorded dart
    if (dartNumber > 0) {
      // Log shot
      let newShots = turnInfo.shots;
      let newShotInfo = turnInfo.shots[dartNumber - 1];
      newShotInfo['touchedZone'] = null;
      newShotInfo['touchedNumber'] = null;
      newShots[dartNumber - 1] = newShotInfo;
      setTurnInfo({
        ...turnInfo,
        shots: newShots,
      });
    }
  };

  return (
    <>
      {/* Who's shooting*/}
      <div
        className="scroll-element dart-info-text-h1"
        style={{ color: '#efe3ce' }}
      >
        {turnInfo.player.name +
          ' (#' +
          turnInfo.player.number +
          ') is shooting !'}
      </div>

      {/* Dart interactive board */}
      <DartBoard turnInfo={turnInfo} setTurnInfo={setTurnInfo} />

      {/* Click resume */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div></div>
        <div style={{ width: '25px' }}></div>
        <TurnSummaryArray turnInfo={turnInfo} />
        <div
          style={{ marginTop: 'calc( 132px - 25px )' }}
          onClick={(e) => removeLastClick(e, turnInfo, setTurnInfo)}
        >
          <DeleteArrow width={25} height={25} />
        </div>
        <div></div>
      </div>
    </>
  );
};
