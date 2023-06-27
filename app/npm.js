import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const npm = () => {
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
        `https://www.npmjs.com/search/suggestions?q=${searchTerm}`
      );
      setPackages(response.data);
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
        <Text style={styles.packageName}>{item.name}</Text>
        <Text style={styles.packageDescription}>{item.description}</Text>
        {/* <Text style={styles.packageVersion}>{item.version}</Text>
        <Text style={styles.packageAuthor}>{item.author ? item.author.name : ''}</Text>
        <Text style={styles.packageRepository} onPress={() => handleLinkPress(item.links.repository)}>
          {item.links.repository}
        </Text> */}
        <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(item.projectUrl)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="#231F20"  /> Visit</Text>
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
              <Text style={styles.packageDescription}>{selectedPackage.description}</Text>
              <Text style={styles.packageVersion}>{selectedPackage.version}</Text>
              <Text style={styles.packageAuthor}>{selectedPackage.author ? selectedPackage.author.name : ''}</Text>
              <Text style={styles.packageRepository} onPress={() => handleLinkPress(selectedPackage.links.repository)}>
                {selectedPackage.links.repository}
              </Text>
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.links.npm)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="#231F20"  /> NPM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.links.homepage)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="#231F20"  /> Homepage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.links.repository)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="#231F20"  /> Repository</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.links.bugs)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="#231F20"  /> Bugs</Text>
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

  const renderInfoModal = () => (
    <Modal visible={infoModalVisible} animationType="fade" transparent={true} onRequestClose={closeInfoModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Info</Text>
          <Text></Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen  options={{headerStyle :{backgroundColor : '#CB3837'}, backgroundColor : '#CB3837', headerTintColor:'white', title: '.NET', contentStyle: {backgroundColor: '#CB3837'},headerRight: () => (
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
        keyExtractor={(item) => item.name}
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
    backgroundColor: '#CB3837',
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
    borderColor: '#FFFFFF',
    padding: 10,
    backgroundColor: '#CB3837',
    borderRadius: 10,
    shadowColor: '#FFFFFF',
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
    color: '#231F20',
  },
  packageVersion: {
    fontSize: 12,
    color: '#231F20',
  },
  packageRepository: {
    fontSize: 12,
    color: '#231F20',
    textDecorationLine: 'underline',
  },
  packageAuthor: {
    fontSize: 12,
    marginBottom: 4,
    color: '#231F20'
  },
  packageLicense: {
    fontSize: 12,
    color: '#231F20',
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
    backgroundColor: '#CB3837',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#231F20',
    fontWeight: 'bold',
  },
  LicenceButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFCC00',
    borderRadius: 4,
    color: '#231F20',
    
  },
  LicenceButton2: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFCC00',
    borderRadius: 4,
  },
  LicenceButtonText: {
    color: '#231F20',
    fontWeight: 'bold',
  },
  infoText: {
    color:'#ccc',
    marginBottom: 8,
  },
});

export default npm;
