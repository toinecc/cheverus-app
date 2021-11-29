import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import { DartMenuTitle } from './PageElements';
import { TargetIcon } from './icons/TargetIcon';
import { StatisticsIcon } from './icons/StatisticsIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import './../App.less';
const { Title } = Typography;

export const DartHome = () => {
  return (
    <div className="scroll-content-container">
      <div className="scroll-content dart-background">
        <DartMenuTitle />

        <div className="scroll-element">
          <div className="column-oriented">
            <Link to={'/app/dartdevil/play'}>
              <TargetIcon width={100} height={100} />
            </Link>
            <Title level={4} style={{ textAlign: 'center' }}>
              {' '}
              New game{' '}
            </Title>
          </div>
        </div>

        <div className="scroll-element">
          <div className="column-oriented">
            {/* <Link to={'/app/dartdevil/stats'}> */}
            <StatisticsIcon width={100} height={100} />
            {/* </Link> */}
            <Title level={4} style={{ textAlign: 'center' }}>
              {' '}
              Statistics{' '}
            </Title>
          </div>
        </div>

        <div className="scroll-element">
          <div className="column-oriented">
            <Link to={'/app/dartdevil/settings'}>
              <SettingsIcon width={100} height={100} />
            </Link>
            <Title level={4} style={{ textAlign: 'center' }}>
              {' '}
              Settings{' '}
            </Title>
          </div>
        </div>
      </div>
    </div>
  );
};
