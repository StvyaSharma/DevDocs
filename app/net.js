import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity,Button } from 'react-native';
import axios from 'axios';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const net = () => {
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
        `https://api-v2v3search-0.nuget.org/query?q=${searchTerm}`
      );
      setPackages(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchPackages();
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const openModal = (item) => {
    setSelectedPackage(item);
    setModalVisible(true);
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

  const renderPackage = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.packageItem}>
        <Text style={styles.packageName}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.packageDescription}>{item.description}</Text>
        {/* <Text style={styles.packageTotalDownloads}>{item.totalDownloads} total downloads</Text>
        <Text style={styles.packageVersion}>{item.version}</Text>
        <Text style={styles.packageRepository} onPress={() => handleLinkPress(item.projectUrl)}>
          {item.projectUrl}
        </Text> */}
        <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(item.projectUrl)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Visit</Text>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <Text style={styles.modalHeading}>Package Details</Text> */}
          {selectedPackage && (
            <View>
              <Text style={styles.modalHeading}>{selectedPackage.title}</Text>
              <Text style={styles.packageDescription}>{selectedPackage.description}</Text>
              <Text style={styles.packageTotalDownloads}>Downloads: {selectedPackage.totalDownloads}</Text>
              <Text style={styles.packageVersion}>Version: {selectedPackage.version}</Text>
              {/* <Text style={styles.packageRepository} onPress={() => handleLinkPress(selectedPackage.projectUrl)}>
                {selectedPackage.projectUrl}
              </Text> */}
              <Text style={styles.packageAuthor}>Author: {selectedPackage.authors}</Text>
              
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.projectUrl)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> URL</Text>
          </TouchableOpacity>

              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.licenseUrl)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Lience</Text>
          </TouchableOpacity>
          
              {/* <Text style={styles.packageLicense}>{selectedPackage.licenseUrl}</Text> */}
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderInfoModal = () => (
    <Modal visible={infoModalVisible} animationType="fade" transparent={true} onRequestClose={closeInfoModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Info</Text>
            <Text style={styles.infoText}></Text>
         
            <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen  options={{headerStyle :{backgroundColor : '#333333'}, backgroundColor : '#333333', headerTintColor:'white', title: '.net', contentStyle: {backgroundColor: '#333333'},headerRight: () => (
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
      showsVerticalScrollIndicator={false}
        data={packages}
        renderItem={renderPackage}
        keyExtractor={(item) => item.packageId}
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
    backgroundColor: '#333333',
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
    borderColor: '#007ACC',
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 10,
    shadowColor: '#007ACC',
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
    color: 'white'
    
  },
  packageDescription: {
    fontSize: 14,
    marginBottom: 4,
    color: '#CCCCCC'
  },
  packageTotalDownloads: {
    fontSize: 12,
    color: '#00B7FF',
  },
  packageVersion: {
    fontSize: 12,
    color: '#00B7FF',
  },
  packageRepository: {
    fontSize: 12,
    color: '#005299',
    textDecorationLine: 'underline',
  },
  packageAuthor: {
    fontSize: 12,
    marginBottom: 4,
    color: '#00B7FF'
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
    backgroundColor: '#333333',
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
    backgroundColor: '#007ACC',
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
    backgroundColor: '#00B7FF',
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
});

export default net;
