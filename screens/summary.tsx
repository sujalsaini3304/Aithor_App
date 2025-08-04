import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import usePingServer from '../helper/usePingServer';
import { useNetworkStatus } from '../helper/useNetworkStatus';

const Summary = ({ navigation, route }) => {
  const { summary_details } = route.params;
  const isConnected = useNetworkStatus();
  usePingServer(isConnected);
  const lines = summary_details.split('\n').filter(line => line.trim() !== '');

  const renderFormattedLine = (line, index) => {
    const isBullet = line.trim().startsWith('-');
    const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

    const parts = cleanLine.split(/(\*\*.*?\*\*)/g); // split by bold pattern

    return (
      <Text key={index} style={styles.paragraph}>
        {isBullet && <Text style={styles.bulletDot}>• </Text>}
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={i} style={styles.bold}>
                {part.replace(/\*\*/g, '')}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 10 }}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <Header mb={1} />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.heading}>Summary</Text>
            {lines.map(renderFormattedLine)}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Summary;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 24,
    color: '#2089dc',
    fontWeight: '600',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: '#222',
    lineHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bulletDot: {
    fontSize: 16,
    color: '#222',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
});
