import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Card,
  Paragraph,
  Provider as PaperProvider,
  Button as ButtonD,
  Chip,
  FAB,
  Dialog,
  Portal,
} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GetLocation from 'react-native-get-location';

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
  },
  container: {
    backgroundColor: '#F5FCFF',
    margin: 7.5,
    height: '100%',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  location: {
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    marginBottom: 8,
  },
  padding: {
    padding: 6,
  },
  chip: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  chipContent: {
    margin: 5,
    padding: 3,
    backgroundColor: '#bbdefb',
  },
  fixedView: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default class App extends Component {
  state = {
    location: null,
    weather: null,
    loadingWeather: false,
    loadingLoc: false,
    info: false,
  };

  _showInfoDialog = () => {
    this.setState({info: true});
    console.log(this.state);
  };

  _hideInfoDialog = () => {
    this.setState({info: false});
    console.log(this.state);
  };

  _getIcon = () => {
    var icon = this.state.weather.weather[0].icon;

    switch (icon) {
      case '01d':
        return <FontAwesome5 name={'sun'} size={30} />;
      case '01n':
        return <FontAwesome5 name={'moon'} size={30} />;
      case '02d':
        return <FontAwesome5 name={'cloud-sun'} size={30} />;
      case '02n':
        return <FontAwesome5 name={'cloud-moon'} size={30} />;
      case '03d':
        return <FontAwesome5 name={'cloud'} size={30} />;
      case '03n':
        return <FontAwesome5 name={'cloud'} size={30} />;
      case '04d':
        return <FontAwesome5 name={'cloud'} size={30} />;
      case '04n':
        return <FontAwesome5 name={'cloud'} size={30} />;
      case '09d':
        return <FontAwesome5 name={'cloud-sun-rain'} size={30} />;
      case '09n':
        return <FontAwesome5 name={'cloud-moon-rain'} size={30} />;
      case '10d':
        return <FontAwesome5 name={'cloud-showers-heavy'} size={30} />;
      case '10n':
        return <FontAwesome5 name={'cloud-showers-heavy'} size={30} />;
      case '11d':
        return <FontAwesome5 name={'bolt'} size={30} />;
      case '11n':
        return <FontAwesome5 name={'bolt'} size={30} />;
      case '13d':
        return <FontAwesome5 name={'snowflake'} size={30} />;
      case '13n':
        return <FontAwesome5 name={'snowflake'} size={30} />;
      case '50d':
        return <FontAwesome5 name={'smog'} size={32} />;
      case '50n':
        return <FontAwesome5 name={'smog'} size={32} />;

      default:
        return <FontAwesome5 name={'sun'} size={35} />;
    }
  };

  _getSunInfo = () => {
    const weather = this.state.weather;

    var sunsetTime = new Date(0);
    sunsetTime.setUTCSeconds(weather.sys.sunset);

    var sunriseTime = new Date(0);
    sunriseTime.setUTCSeconds(weather.sys.sunrise);

    var view = [];
    view.push(
      <Card>
        <Card.Title
          title="Sun Timings"
          subtitle="(When there is light and when it gets dark)"
          left={() => {
            return <FontAwesome5 name={'clock'} size={30} />;
          }}
        />
        <Card.Content>
          <View style={styles.chip}>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'long-arrow-alt-up'} />;
              }}
              style={styles.chipContent}>
              Sunrise :{' '}
              {sunriseTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'long-arrow-alt-down'} />;
              }}
              style={styles.chipContent}>
              Sunset :{' '}
              {sunsetTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Chip>
          </View>
        </Card.Content>
      </Card>,
    );

    return view;
  };
  _getOtherInfo = () => {
    const weather = this.state.weather;

    var view = [];
    view.push(
      <Card>
        <Card.Title
          title="Well you need more information?"
          subtitle="(Here you go! Now be happy.)"
          left={() => {
            return <FontAwesome5 name={'info-circle'} size={30} />;
          }}
        />
        <Card.Content>
          <View style={styles.chip}>
            <Chip icon="eye" style={styles.chipContent}>
              Visibility: {weather.visibility / 1000}km
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'wind'} />;
              }}
              style={styles.chipContent}>
              Wind Speed : {weather.wind.speed}m/s
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'tint'} />;
              }}
              style={styles.chipContent}>
              Humidity : {weather.main.humidity}m/s
            </Chip>
          </View>
        </Card.Content>
      </Card>,
    );

    return view;
  };

  _renderWeather = weather => {
    var temp = Math.round(weather.main.temp - 273.15);
    var feels = Math.round(weather.main.feels_like - 273.15);
    var max = Math.round(weather.main.temp_max - 273.5);
    var min = Math.round(weather.main.temp_min - 273.5);

    var weatherId = weather.weather[0].id;
    var mainWeather = weather.weather[0].main;
    var msg = this._getWeatherMessage(temp, weatherId);

    var view = [];
    view.push(
      <Card>
        <Card.Title
          title={
            <Text numberOfLines={1} adjustsFontSizeToFit>
              {msg}
            </Text>
          }
          subtitle="(Yes its the truth!)"
          left={this._getIcon}
        />
        <Card.Content>
          <View style={styles.chip}>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'info-circle'} />;
              }}
              style={styles.chipContent}>
              {mainWeather}
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'fire-alt'} />;
              }}
              style={styles.chipContent}>
              The machines measure {temp}&deg;C
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'fire-alt'} />;
              }}
              style={styles.chipContent}>
              It feels like {feels}&deg;C
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'temperature-high'} />;
              }}
              style={styles.chipContent}>
              Max : {max}&deg;C
            </Chip>
            <Chip
              icon={() => {
                return <FontAwesome5 name={'temperature-low'} />;
              }}
              style={styles.chipContent}>
              Min : {min}&deg;C
            </Chip>
          </View>
        </Card.Content>
      </Card>,
    );

    return view;
  };

  _getWeatherMessage = (temp, weatherId) => {
    var msg;

    if (weatherId >= 800) {
      if (temp > 35) msg = 'Get Ready to melt';
      else if (temp > 30) msg = 'Turn on the AC already';
      else if (temp > 25) msg = 'Its Freeking Hot man';
      else if (temp > 16) msg = 'It is as good as it gets';
      else if (temp > 10) msg = 'Okay, now it is getting cold';
      else if (temp > 0) msg = 'Why are not in a blanket already?';
      else if (temp < 0) msg = 'You not frozen yet?';
    } else if (weatherId >= 700) {
      msg = 'Looks like you lost your glasses!';
    } else if (weatherId >= 600) {
      msg = 'Get ready to make a snow man!';
    } else if (weatherId >= 500 && weatherId <= 501) {
      msg = 'It is gonna get wet!';
    } else if (weatherId > 501) {
      msg = 'Its pouring like crazy, stay inside!';
    } else if (weatherId > 300) {
      msg = 'It might drip, carry Umbrella';
    } else if (weatherId > 200) {
      msg = 'Outside is all sound and lights';
    }

    return msg;
  };

  _requestWeather = () => {
    this.setState({loadingWeather: true, weather: null});
    const {location} = this.state;
    if (location == null) {
      Alert.alert(
        'Weather cannot be fetched without location, please fetch location first',
      );
      this.setState({
        loadingWeather: false,
      });
      return;
    }

    var uri =
      'https://api.openweathermap.org/data/2.5/weather?lat=' +
      location.latitude +
      '&lon=' +
      location.longitude +
      '&appid=997007c64c170b4b45d5460c5b928e3c';
    console.log(uri);

    fetch(uri, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(response => response.json())
      .then(weather => {
        this.setState({
          weather: weather,
          loadingWeather: false,
        });
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Unable to query weather : Something went wrong');
      });
  };

  _renderLocation = location => {
    console.log(location);
    var view = [];
    view.push(
      <Card>
        <Card.Title
          title="You are currently on Earth"
          subtitle="(Where else can you even be?)"
          left={() => {
            return <FontAwesome5 name={'globe-asia'} size={30} />;
          }}
        />
        <Card.Content>
          <View style={styles.chip}>
            <Chip style={styles.chipContent}>
              Latitude : {location.latitude.toFixed(3)}
            </Chip>
            <Chip style={styles.chipContent}>
              Longitude : {location.longitude.toFixed(3)}
            </Chip>
            <Chip style={styles.chipContent}>
              You are at a height of {location.altitude.toFixed(3)}m
            </Chip>
          </View>
          <Paragraph style={{margin: 10}}>(That's way too high man)</Paragraph>
        </Card.Content>
      </Card>,
    );

    return view;
  };

  _requestLocation = () => {
    this.setState({loadingLoc: true, location: null});

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        this.setState({
          location: location,
          loadingLoc: false,
        });
      })
      .catch(ex => {
        const {code, message} = ex;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          Alert.alert('Location cancelled by user or by another request');
        }
        if (code === 'UNAVAILABLE') {
          Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          Alert.alert('Authorization denied');
        }
        this.setState({
          location: null,
          loadingLoc: false,
        });
      });
  };

  render() {
    const {location, weather, loadingWeather, loadingLoc} = this.state;
    return (
      <PaperProvider>
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.welcome}>
                I will tell you your Location And Weather!
              </Text>
              {location ? null : (
                <Text style={styles.welcome}>To get location, Click Below</Text>
              )}
              <View style={styles.button}>
                <Button
                  disabled={loadingLoc}
                  title={location ? 'Refresh Location' : 'Get Location'}
                  onPress={this._requestLocation}
                />
              </View>
              {loadingLoc ? <ActivityIndicator /> : null}
              {location ? (
                <View style={styles.location}>
                  {this._renderLocation(location)}
                </View>
              ) : null}
              {weather ? null : (
                <Text style={styles.welcome}>
                  Wanna know the weather?{'\n'}GO AND CHECK OUT{'\n'}Just
                  kidding, tap below
                </Text>
              )}
              <View style={styles.button}>
                <Button
                  disabled={loadingWeather}
                  title={weather ? 'Refresh Weather' : 'Get Weather'}
                  onPress={this._requestWeather}
                />
              </View>
              {loadingWeather ? <ActivityIndicator /> : null}
              {weather ? (
                <View style={styles.location}>
                  {this._renderWeather(weather)}
                </View>
              ) : null}
              {weather ? (
                <View style={styles.location}>{this._getSunInfo()}</View>
              ) : null}
              {weather ? (
                <View style={styles.location}>{this._getOtherInfo()}</View>
              ) : null}
            </View>
            <Portal>
              <Dialog visible={this.state.info} onDismiss={this._hideDialog}>
                <Dialog.Title>Info</Dialog.Title>
                <Dialog.Content>
                  <View>
                    <Text>
                      This is a simple react native app. It provides you with
                      weather and location of the user.{'\n'}
                      Icons by FontAwesome5{'\n'}
                      App Icon :
                      <Text
                        onPress={() =>
                          Linking.openURL(
                            'https://www.flaticon.com/authors/freepik',
                          )
                        }
                        style={{color: '#00F'}}>
                        Freepik
                      </Text>
                      {' '}by{' '}
                      <Text
                        onPress={() =>
                          Linking.openURL('https://www.flaticon.com/')
                        }
                        style={{color: '#00F'}}>
                        www.flaticon.com
                      </Text> 
                      {"\n"}
                      Developed by : <Text
                        onPress={() =>
                          Linking.openURL('https://pmanaktala.com/')
                        }
                        style={{color: '#00F'}}>
                        pmanaktala
                      </Text>
                    </Text>

                  </View>
                </Dialog.Content>
                <Dialog.Actions>
                  <ButtonD onPress={this._hideInfoDialog}>Done</ButtonD>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
          <FAB
            style={styles.fab}
            small
            icon="information-outline"
            onPress={this._showInfoDialog}
          />
        </View>
      </PaperProvider>
    );
  }
}
