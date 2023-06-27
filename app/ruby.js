import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

const RubyPackages = () => {
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
        `https://rubygems.org/api/v1/search.json?query=${searchTerm}&per_page=25`
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

  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  const renderPackage = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.packageItem}>
        <Text style={styles.packageName}>{item.name}</Text>
        {/* <Text style={styles.packageVersion}>Version: {item.version}</Text> */}
        <Text style={styles.packageDescription} numberOfLines={2} >{item.info}</Text>
        {/* <Text style={styles.packageHomepage} onPress={() => handleLinkPress(item.project_uri)}>
          Homepage: {item.homepage_uri}
        </Text> */}
        <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(item.project_uri)}>
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
              <Text style={styles.packageDescription}>{selectedPackage.info}</Text>
              <Text style={styles.packageVersion}>Version: {selectedPackage.version}</Text>
              <Text style={styles.packageVersion}>Downloads: {selectedPackage.downloads}</Text>
              
              {/* <Text style={styles.packageHomepage} onPress={() => handleLinkPress(selectedPackage.homepage_uri)}>
                Homepage: {selectedPackage.homepage_uri}
              </Text> */}
              <Text style={styles.packageAuthor}>Authors: {selectedPackage.authors}</Text>

              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.documentation_uri)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Documentation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.homepage_uri)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Repository</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(selectedPackage.project_uri)}>
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

  const renderInfoModal = () => (
    <Modal visible={infoModalVisible} animationType="fade" transparent={true} onRequestClose={toggleInfoModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Info</Text>

          </View>
          <Text style={styles.infoText}></Text>
          <TouchableOpacity style={styles.closeButton} onPress={toggleInfoModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
                <Stack.Screen  options={{headerStyle :{backgroundColor : '#701516'}, backgroundColor : '#701516', headerTintColor:'white', title: 'ruby', contentStyle: {backgroundColor: '#701516'},headerRight: () => (
            <TouchableOpacity onPress={toggleInfoModal}>
                <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>

          )}} />

      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={handleSearch}
        placeholder="Search packages..."
        placeholderTextColor="#CCCCCC"
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
      backgroundColor: '#701516',
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
      borderColor: '#CC342D',
      padding: 10,
      backgroundColor: '#701516',
      borderRadius: 10,
      shadowColor: '#CC342D',
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
      color: '#D33828',
    },
    packageVersion: {
      fontSize: 12,
      color: '#D33828',
    },
    packageRepository: {
      fontSize: 12,
      color: '#E74C3C',
      textDecorationLine: 'underline',
    },
    packageAuthor: {
      fontSize: 12,
      marginBottom: 4,
      color: '#D33828'
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
      backgroundColor: '#701516',
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
      backgroundColor: '#CC342D',
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
      backgroundColor: '#5C0002',
      borderRadius: 4,
    },
    LicenceButton2: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#E74C3C',
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
  

export default RubyPackages;
