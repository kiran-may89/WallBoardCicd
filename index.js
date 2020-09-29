import {StatusBar, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {reduxProvider} from './store';

import LookUp from './src/components/lookup';

const Screens = new Map();
window.isTV = false;
window.devID = Math.round(Math.random() * 100);

StatusBar.setHidden(true);
console.disableYellowBox = true;

Screens.set('LookUp', LookUp);

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

const startApp = () => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'LookUp',
        options: {
          statusBar: {
            visible: false,
          },
          ...navBar,
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
  });
};

Navigation.events().registerAppLaunchedListener(() => {
  startApp();
});
