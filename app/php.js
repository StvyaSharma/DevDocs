import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const PHP = () => {
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
        `https://packagist.org/search.json?q=${searchTerm}`
      );
      setPackages(response.data.results);
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
        <Text style={styles.packageDescription} numberOfLines={2} >{item.description}</Text>
     
        
        {/* <Text style={styles.packageRepository} onPress={() => handleLinkPress(item.repository)}>
          {item.repository}
        </Text> */}
         <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(item.url)}>
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
              <Text style={styles.packageDescription}>{selectedPackage.description}</Text>
              {/* <Text style={styles.packageMaintainers}>{selectedPackage.maintainers}</Text>
              <Text style={styles.packageDownloads}>{selectedPackage.downloads.total} total downloads</Text>
              <Text style={styles.packageRepository} onPress={() => handleLinkPress(selectedPackage.repository)}>
                {selectedPackage.repository}
              </Text> */}
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.url)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> URL</Text>
          </TouchableOpacity>

              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.repository)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Repository</Text>
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Info</Text>
            <Text style={styles.infoText}>This app allows you to search for PHP packages using the Packagist API.</Text>
          <Text style={styles.infoText}>Enter a search term in the input field above to get started.</Text>
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
        <Stack.Screen  options={{headerStyle :{backgroundColor : '#4F5B93'}, backgroundColor : '#4F5B93', headerTintColor:'white', title: 'php', contentStyle: {backgroundColor: '#4F5B93'},headerRight: () => (
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
      backgroundColor: '#4F5B93',
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
      borderColor: '#4DB6AC',
      padding: 10,
      backgroundColor: '#4F5B93',
      borderRadius: 10,
      shadowColor: '#4DB6AC',
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
      color: '#FFCA28',
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
      backgroundColor: '#4F5B93',
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
      backgroundColor: '#4DB6AC',
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
      backgroundColor: '#8DA978',
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

export default PHP;
