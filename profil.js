import React from 'react';
import { AsyncStorage, StyleSheet, Text,  View, Button, ActivityIndicator, TouchableOpacity, Image, YellowBox } from 'react-native';
import { Actions } from 'react-native-router-flux';

class ProfileScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {user: props, isLoaded: false};
    }

  async logout() {
    try {
        await AsyncStorage.multiRemove(['login', 'password']);
        Actions.LoginScreen();
    } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
    }
  }

  async saveFalseInfos() {
      try {
          await AsyncStorage.multiSet([['login', 'popo'], ['password', 'toto']]);
      } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
      }
    }

  componentDidMount() {
    AsyncStorage.multiGet(['login', 'password']).then((token) => {
        if (token[0][1] !== null) {
            const url = 'http://172.16.24.30:8080/' + token[0][1] + '/' + token[1][1] + '/';
                fetch(url)
                   .then((response) => response.json())
                   .then((responseJson) => {
                      if (responseJson.status) {
                         console.log('wrong password! Retour à l\'écran de login');
                         Actions.LoginScreen();
                      } else {
                         this.setState({ user: responseJson, isLoaded: true });
                      }
                   })
                   .catch((error) => {
                       console.error(error);
                   });
        }
     });

  }

  render() {
    YellowBox.ignoreWarnings([
                  'Warning: componentWillMount is deprecated',
                  'Warning: componentWillReceiveProps is deprecated',
                ]);

    if (!this.state.isLoaded) {
       return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff"
                       animating={true} />
            </View>
       )
    } else {
        const solde = this.state.user ? this.state.user.solde : null;
        const prenom = this.state.user ? this.state.user.prenom : null;
        const soldeDescription = this.state.user ? this.state.user.soldeDescription : null;

        const regExp = /[\D]*[0-9]*[\D]*([0-9]*)/;
        const soldeFrancs = soldeDescription ? regExp.exec(soldeDescription)[1] : 0;

        return (
          <View style={styles.container}>
              <View style={styles.container}>
                    <Text>Bienvenue {prenom}</Text>
                    <Text>Votre solde: {soldeFrancs} XPF</Text>
                    <Text>Vos points: {solde}</Text>
              </View>
              <View style={[styles.container, styles.menuButton]} >
                <View style={{padding:10}}>
                    <Button title="False" color="red" onPress={ this.saveFalseInfos } />
                </View>
                <View style={{padding:10}}>
                    <TouchableOpacity style={styles.button} onPress={ this.logout }>
                        <Image source={require("./engrenage.png")} style={{ alignSelf: 'stretch', resizeMode: 'contain', width: 60,
                                                                                                                              height: 60 }} />
                    </TouchableOpacity>
                </View>
              </View>
          </View>
        );
     }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    },
    menuButton: {
        flexDirection: 'row',
        backgroundColor: '#ccc',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 0,
        width: '100%'
    },
  button: {
    backgroundColor: '#859a9b',
        borderRadius: 10,
        padding: 5,
        marginBottom: 0,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        shadowOpacity: 0.35,
  }
});


module.exports = ProfileScreen;