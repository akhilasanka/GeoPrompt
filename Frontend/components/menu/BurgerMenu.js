import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView, withNavigation} from 'react-navigation';
import {DrawerItems} from 'react-navigation-drawer';

class BurgerMenu extends PureComponent {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <ScrollView style={styles.container}>
          <DrawerItems {...this.props} />
        </ScrollView>
        <Button
          icon={{name: 'md-log-out', type: 'ionicon'}}
          title="Log Out"
          iconContainerStyle={styles.icon}
          buttonStyle={styles.button}
          titleStyle={styles.title}
          onPress={() => this.props.navigation.navigate('LoginScreen')}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 26,
    width: 24,
  },
  button: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    margin: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default withNavigation(BurgerMenu);
