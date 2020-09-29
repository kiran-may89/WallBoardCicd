import 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {reduxProvider} from './store';
import {Platform} from 'react-native';

import App from './src/components/machineList';
import Main from './src/components/mainMenu';
import Login from './src/components/login';
import ChangeTheme from './src/components/changeTheme';
import ChangeMachineSize from './src/components/changeMachineSize';
import ChangeLanguage from './src/components/changeLanguage';
import ConfirmCode from './src/components/confirmCode';
import EnterConfirmCode from './src/components/enterConfirmCode';
import NoMachines from './src/components/noMachines';

const Screens = new Map();

Screens.set('App', App);
Screens.set('Main', Main);
Screens.set('Login', Login);
Screens.set('ChangeTheme', ChangeTheme);
Screens.set('ChangeMachineSize', ChangeMachineSize);
Screens.set('ChangeLanguage', ChangeLanguage);
Screens.set('ConfirmCode', ConfirmCode);
Screens.set('EnterConfirmCode', EnterConfirmCode);
Screens.set('NoMachines', NoMachines);

// Register screens
Screens.forEach((C, key) => {
  Navigation.registerComponent(
    key,
    () => reduxProvider(C),
    () => C,
  );
});

const navBar =
  Platform.OS === 'ios'
    ? {}
    : {
        navigationBar: {
          visible: false,
        },
      };

export const startApp = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Main',
              options: {
                ...navBar,
                statusBar: {
                  visible: false,
                },
                topBar: {
                  visible: false,
                  height: 0,
                  _height: 0,
                  drawBehind: true,
                  animate: false,
                },
              },
            },
          },
        ],
      },
    },
  });
};
