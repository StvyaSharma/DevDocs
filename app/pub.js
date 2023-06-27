import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

const pub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        `https://pub.dev/api/search?q=${searchTerm}`
      );
      setPackages(response.data.packages ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPackageDetails = async (packageName) => {
    try {
      const response = await axios.get(
        `https://pub.dev/api/packages/${packageName}`
      );
      setSelectedPackage(response.data ?? null);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchPackages();
  };

  const handleLinkPress = (url) => {
    console.log(1);
    console.log(url);
    console.log(1);
    Linking.openURL(url);
  };

  const openModal = (packageName) => {
    fetchPackageDetails(packageName);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setModalVisible(false);
  };
  const openInfoModal = () => {
    setInfoModalVisible(true);
  };

  const closeInfoModal = () => {
    setInfoModalVisible(false);
  };
  const renderInfoModal = () => (
    <Modal visible={infoModalVisible} animationType="fade" transparent={true} onRequestClose={closeInfoModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}> Info</Text>
          <Text></Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPackage = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item.package)}>
      <View style={styles.packageItem}>
        <Text style={styles.packageName}>{item.package}</Text>
        <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(`https://pub.dev/packages/${selectedPackage.name}`)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Visit</Text>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedPackage && (
            <View>
              <Text style={styles.modalHeading}>{selectedPackage.name}</Text>
              <Text style={styles.packageDescription}>{selectedPackage.latest?.pubspec?.description}</Text>
              {/* <Text style={styles.packageAuthor}>Author: {selectedPackage.latest?.pubspec?.author}</Text> */}
              <Text style={styles.packageVersion}>Version: {selectedPackage.latest?.version}</Text>
              {/* <Text style={styles.packageHomepage} onPress={() => handleLinkPress(selectedPackage.latest?.pubspec?.repository)}>
                Homepage: {selectedPackage.latest?.pubspec?.homepage}
              </Text> */}
              {/* https://pub.dev/packages/ */}
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.latest?.pubspec?.repository)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Repository</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(`https://pub.dev/packages/${selectedPackage.name}`)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> URL</Text>
          </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen  options={{headerStyle :{backgroundColor : '#00A896'}, backgroundColor : '#00A896', headerTintColor:'white', title: 'pub', contentStyle: {backgroundColor: '#00A896'},headerRight: () => (
            <TouchableOpacity onPress={openInfoModal}>
                <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>

          )}} />
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={handleSearch}
        placeholder="Search packages..."
      />
      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={(item) => item.package}
        contentContainerStyle={styles.packageList}
      />
      {renderModal()}
      {renderInfoModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: 20,
        marginVertical: 10,
        padding: 16,
        backgroundColor: '#00A896',
        maxWidth: 700,
        margin: 'auto'
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 20,
        marginTop: 10,
        color: 'white',
        padding: 8,
        marginBottom: 16,
        borderRadius: 10,
      },
      packageList: {
        flexGrow: 1,
      },
      packageItem: {
        marginBottom: 16,
        borderWidth: 4,
        marginHorizontal: 20,
        borderColor: '#0175C2',
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        shadowColor: '#0175C2',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      packageName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#0175C2'
        
      },
      packageDescription: {
        fontSize: 14,
        marginBottom: 4,
        color: '#CCCCCC'
      },
      packageTotalDownloads: {
        fontSize: 12,
        color: '#2196F3',
      },
      packageVersion: {
        fontSize: 12,
        color: '#000000',
      },
      packageRepository: {
        fontSize: 12,
        color: '#005299',
        textDecorationLine: 'underline',
      },
      packageAuthor: {
        fontSize: 12,
        marginBottom: 4,
        color: '#2196F3'
      },
      packageLicense: {
        fontSize: 12,
        color: 'blue',
        textDecorationLine: 'underline',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 'auto',
        
      },
      modalContent: {
        backgroundColor: '#00A896',
        padding: 16,
        borderRadius: 8,
        width: '80%',
        maxWidth: 600,
        margin: 'auto'
      },
      modalHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color:'white'
      },
      closeButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#0175C2',
        borderRadius: 4,
      },
      closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      LicenceButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#2196F3',
        borderRadius: 4,
      },
      LicenceButton2: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#005299',
        borderRadius: 4,
      },
      LicenceButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      infoText: {
        color:'#ccc',
        marginBottom: 8,
      },
  packageHomepage: {
    fontSize: 12,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default pub;
