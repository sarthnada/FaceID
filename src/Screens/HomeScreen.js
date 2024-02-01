// HomeScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INPUT_OFFSET = 110;

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    checkFaceIDAvailability();
  }, []);

  const checkFaceIDAvailability = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (available && biometryType === BiometryTypes.FaceID) {
      // Face ID is available, you can enable Face ID authentication
    } else {
      Alert.alert('Oops!', 'Face ID is not available on this device.');
    }
  };

  const handleSignInPress = async () => {
    // Your sign-in logic here
  };

  const handleFaceIDPress = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (available && biometryType === BiometryTypes.FaceID) {
      Alert.alert(
        'Face ID',
        'Would you like to enable Face ID authentication for the next time?',
        [
          {
            text: 'Yes please',
            onPress: async () => {
              try {
                const { userId } = await verifyUserCredentials();

                const { publicKey } = await rnBiometrics.createKeys();

                await sendPublicKeyToServer({ userId, publicKey });

                await AsyncStorage.setItem('userId', userId);
                
                // Navigate to the success screen
                navigation.navigate('Success');
              } catch (error) {
                console.error('Error during Face ID setup:', error);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      Alert.alert('Oops!', 'Face ID is not available on this device.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <FeatherIcon color="#075eec" name="lock" size={44} />
          </View>

          <Text style={styles.title}>
            Welcome to <Text style={{ color: '#0742fc' }}>FaceID</Text>
          </Text>

          <Text style={styles.subtitle}>Collaborate with your friends</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignInPress}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.formActionSpacer} />

            <TouchableOpacity onPress={handleFaceIDPress}>
              <View style={styles.btnSecondary}>
                <MaterialCommunityIcons
                  color="#000"
                  name="face-recognition"
                  size={22}
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.btnSecondaryText}>Face ID</Text>
                <View style={{ width: 34 }} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.formFooter}>
            By clicking "Sign in" above, you agree to RealApps's
            <Text style={{ fontWeight: '600' }}> Terms & Conditions </Text>
            and
            <Text style={{ fontWeight: '600' }}> Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    title: {
      fontSize: 27,
      fontWeight: '700',
      color: '#1d1d1d',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: '#929292',
      textAlign: 'center',
    },
    /** Header */
    header: {
      marginVertical: 36,
    },
    headerIcon: {
      alignSelf: 'center',
      width: 80,
      height: 80,
      marginBottom: 36,
      backgroundColor: '#fff',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Form */
    form: {
      marginBottom: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    formAction: {
      marginVertical: 24,
    },
    formActionSpacer: {
      marginVertical: 8,
    },
    formFooter: {
      marginTop: 'auto',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      color: '#929292',
      textAlign: 'center',
    },
    /** Input */
    input: {
      marginBottom: 16,
    },
    inputLabel: {
      position: 'absolute',
      width: INPUT_OFFSET,
      lineHeight: 44,
      top: 0,
      left: 0,
      bottom: 0,
      marginHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: '500',
      color: '#c0c0c0',
      zIndex: 9,
    },
    inputControl: {
      height: 44,
      backgroundColor: '#fff',
      paddingLeft: INPUT_OFFSET,
      paddingRight: 24,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: '500',
      color: '#222',
    },
    /** Button */
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: '#000',
      borderColor: '#000',
    },
    btnText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#fff',
    },
    btnSecondary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: 'transparent',
      borderColor: '#000',
    },
    btnSecondaryText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#000',
    },
  });

export default HomeScreen;
