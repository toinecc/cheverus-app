import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { DartGame } from './components/DartGame';
import './App.less';
import { DartSetting } from './components/DartSetting';
import { DartHome } from './components/DartHome';

const App = () => {
  return (
    <Switch>
      <Route path={'/app/dartdevil/home'}>
        <DartHome />
      </Route>
      <Route path={'/app/dartdevil/play'}>
        <DartGame />
      </Route>
      <Route path={'/app/dartdevil/stats'}>
        <div> </div>
      </Route>
      <Route path={'/app/dartdevil/settings'}>
        <DartSetting />
      </Route>
    </Switch>
  );
};

export default App;
