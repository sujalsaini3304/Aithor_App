import {
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useNetworkStatus } from '../helper/useNetworkStatus';
import useStore from '../store';
import Header from '../components/Header';
import usePingServer from '../helper/usePingServer';

const Index = ({ navigation }) => {
  const isConnected = useNetworkStatus();
  const [text, setText] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [timerId, setTimerId] = useState(null);
  const [inputHeight, setInputHeight] = useState(300);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const { hostname } = useStore();
  const countRef = useRef(0);
  const [
    isHandleSummaryGenerationButtonPressed,
    setIsHandleSummaryGenerationButtonPressed,
  ] = useState(false);

  usePingServer(isConnected);

  useEffect(() => {
    if (isConnected && countRef.current > 0) {
      setShowOnlineMessage(true);
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
    if (!isConnected) countRef.current += 1;
  }, [isConnected]);

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getString();
    setText(clipboardText);
  };

  const handleSummaryGeneration = async () => {
    Keyboard.dismiss();
    const data = text.replace(/\n/g, '').trim();
    setIsHandleSummaryGenerationButtonPressed(true);

    if (!(data === '')) {
      if (!(data.split(' ').length >= 30)) {
        Alert.alert('Error', 'Minimum 30 words required.');
        setIsHandleSummaryGenerationButtonPressed(false);
        return;
      }

      setCountdown(30);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(interval);

      axios
        .post(
          `${hostname}/api/summary`,
          {
            text: data,
          },
          { timeout: 30000 },
        )
        .then(response => {
          navigation.navigate('summary', {
            summary_details: response.data.data,
          });
          console.log(response);
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            Alert.alert('Error', 'Request timed out, please try again.');
          } else if (error.response) {
            if (error.response.status === 503) {
              Alert.alert('Error', 'Server did not respond, please try again.');
            } else {
              Alert.alert(
                'Error',
                `Error ${error.response.status}: ${
                  error.response.data?.message || 'Something went wrong.'
                }`,
              );
            }
          } else {
            // Handle completely unexpected errors
            Alert.alert('Error', 'Unexpected error occurred.');
          }

          console.log('Error details:', {
            code: error.code,
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        })
        .finally(() => {
          setIsHandleSummaryGenerationButtonPressed(false);
          clearInterval(timerId);
          setCountdown(30); // reset
        });
    } else {
      Alert.alert('Error', 'Please write something.');
      setIsHandleSummaryGenerationButtonPressed(false);
    }
  };

  const handleClear = () => {
    if (text == '') {
      return;
    }
    setText('');
    setInputHeight(300);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 10 }}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <Header mb={10} />
        {!isConnected && !showOnlineMessage && (
          <View
            style={{
              borderWidth: 2,
              justifyContent: 'center',
              backgroundColor: '#9ed5ffff',
              borderColor: '#5cb6fbff',
              height: 48,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 600,
                color: '#286da5ff',
              }}
            >
              You are not connected to internet !
            </Text>
          </View>
        )}
        {isConnected && showOnlineMessage && (
          <View
            style={{
              borderWidth: 2,
              justifyContent: 'center',
              backgroundColor: '#a0f6a4ff',
              borderColor: '#61c380ff',
              height: 48,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 600,
                color: '#34a357ff',
              }}
            >
              You are back again !
            </Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {
                <Pressable
                  onPress={handleClear}
                  style={{
                    alignSelf: 'flex-end',
                    borderWidth: 1,
                    width: 100,
                    padding: 8,
                    borderRadius: 6,
                    marginBottom: 6,
                    backgroundColor: '#fe6a6aff',
                    borderColor: '#fe6a6aff',
                  }}
                >
                  <Text style={{ textAlign: 'center', color: '#ffffff' }}>
                    Clear
                  </Text>
                </Pressable>
              }
              <View style={{ maxHeight: 300 }}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  multiline
                  placeholder="Write paragraph..."
                  placeholderTextColor="#808080"
                  scrollEnabled={true}
                  style={[
                    styles.textInput,
                    { height: Math.min(inputHeight, 300) },
                  ]}
                  // onContentSizeChange={event =>
                  //   setInputHeight(event.nativeEvent.contentSize.height)
                  // }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                {
                  <Pressable
                    onPress={handleSummaryGeneration}
                    disabled={
                      (isHandleSummaryGenerationButtonPressed && isConnected) ||
                      !isConnected
                    }
                    style={{
                      borderWidth: 1,
                      width: 220,
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor:
                        (isHandleSummaryGenerationButtonPressed &&
                          isConnected) ||
                        !isConnected
                          ? '#808080'
                          : '#2089dc',
                      borderColor:
                        (isHandleSummaryGenerationButtonPressed &&
                          isConnected) ||
                        !isConnected
                          ? '#808080'
                          : '#2089dc',
                    }}
                  >
                    <Text style={{ textAlign: 'center', color: '#ffffff' }}>
                      Generate Summary
                    </Text>
                  </Pressable>
                }

                <Pressable onPress={handlePaste}>
                  <Image
                    source={require('../public/paste.png')}
                    style={{ height: 40, width: 40 }}
                  />
                </Pressable>
              </View>

              {isHandleSummaryGenerationButtonPressed && (
                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      color: '#2089dc',
                    }}
                  >
                    {countdown} sec
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      color: '#2089dc',
                    }}
                  >
                    Please wait for a moment ...
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      color: '#2089dc',
                    }}
                  >
                    We are processing your request ...
                  </Text>
                </View>
              )}

              <Footer />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 6,
    padding: 10,
    minHeight: 300,
    textAlignVertical: 'top',
  },
});
