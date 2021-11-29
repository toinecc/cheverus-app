import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { DartIcon } from './icons/DartIcon';
import './../App.less';
import { BackArrow } from './icons/BackArrow';
import { isMobile } from 'react-device-detect';

const { Header, Footer } = Layout;
const { Title } = Typography;

const pathLinkManager = (locationPath) => {
  let pathArray = locationPath.split('/');
  const lastPathElement = pathArray.pop();
  let newPath = pathArray.join('/');
  if (lastPathElement === 'settings') {
    newPath = '/app/dartdevil/home';
  } else if (lastPathElement === 'play') {
    newPath = '/app/dartdevil/home';
  }
  return newPath;
};

export const CustomHeader = () => {
  const location = useLocation();
  const newPath = pathLinkManager(location.pathname);
  const DartPageHeaderContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        padding: '0px 10px',
      }}
    >
      {location.pathname !== '/app/dartdevil/home' ? (
        <Link
          to={newPath}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <BackArrow width={40} height={40} />
        </Link>
      ) : (
        <div />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <DartIcon width={40} height={40} />
      </div>
    </div>
  );

  let headerStyle = {
    position: 'fixed',
    zIndex: 10,
    width: '100%',
  };

  if (isMobile) {
    headerStyle = {
      ...headerStyle,
      backgroundColor: '#1f1e1e',
    };
  }

  return (
    <Header className={'app-header dart-background'} style={headerStyle}>
      {DartPageHeaderContent}
    </Header>
  );
};

export const CustomFooter = () => {
  return (
    <Footer
      className={'app-footer dart-background'}
      style={isMobile ? { backgroundColor: '#1f1e1e' } : {}}
    >
      <div style={{ marginRight: '10px' }}> Made with </div>
      <HeartTwoTone twoToneColor="#ff0000" />
      <div style={{ marginLeft: '10px' }}> at cheverus flat, Bordeaux. </div>
    </Footer>
  );
};

export const DartMenuTitle = () => {
  return (
    <div className="scroll-element">
      <Title>
        {' '}
        <DartIcon width={30} height={30} /> DartDevil{' '}
      </Title>
    </div>
  );
};
