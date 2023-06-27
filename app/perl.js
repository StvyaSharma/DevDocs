import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const perl = () => {
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
        `https://fastapi.metacpan.org/v1/module/_search?q=${searchTerm}&size=25`
      );
      setPackages(response.data.hits.hits.map((hit) => hit._source));
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
        <Text style={styles.packageDescription}>{item.abstract}</Text>
        {/* <Text style={styles.packageAuthor}>Author: {item.author}</Text>
        <Text style={styles.packageVersion}>Version: {item.version}</Text>
        <Text style={styles.packageLicense} onPress={() => handleLinkPress(item.license)}>
          License: {item.license}
        </Text> */}
         <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(item.download_url)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Download URL</Text>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>{selectedPackage && selectedPackage.name}</Text>
          <Text style={styles.packageDescription}>{selectedPackage && selectedPackage.abstract}</Text>
          <Text style={styles.packageAuthor}>Author: {selectedPackage && selectedPackage.author}</Text>
          <Text style={styles.packageVersion}>Version: {selectedPackage && selectedPackage.version}</Text>
          <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(selectedPackage.download_url)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="white"  /> Download URL</Text>
          </TouchableOpacity>
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
            <Text style={styles.modalHeading}>info</Text>
          </View>
          <Text style={styles.infoText}></Text>
           <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
<Stack.Screen  options={{headerStyle :{backgroundColor : '#212121'}, backgroundColor : '#212121', headerTintColor:'#009688', title: 'Perl', contentStyle: {backgroundColor: '#212121'},headerRight: () => (
            <TouchableOpacity onPress={openInfoModal}>
                <Ionicons name="information-circle-outline" size={24} color="#009688" />
            </TouchableOpacity>

          )}} />
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={handleSearch}
        placeholder="Search packages..."
        placeholderTextColor="#009688"
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
      backgroundColor: '#212121',
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
      color: '#009688',
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
      borderColor: '#673AB7',
      padding: 10,
      backgroundColor: '#212121',
      borderRadius: 10,
      shadowColor: '#673AB7',
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
      color: '#009688'
      
    },
    packageDescription: {
      fontSize: 14,
      marginBottom: 4,
      color: '#FFFFFF'
    },
    packageTotalDownloads: {
      fontSize: 12,
      color: '#FF5722',
    },
    packageVersion: {
      fontSize: 12,
      color: '#FF5722',
    },
    packageRepository: {
      fontSize: 12,
      color: '#009688',
      textDecorationLine: 'underline',
    },
    packageAuthor: {
      fontSize: 12,
      marginBottom: 4,
      color: '#FF5722'
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
      backgroundColor: '#212121',
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
      color:'#009688'
    },
    closeButton: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#673AB7',
      borderRadius: 4,
    },
    closeButtonText: {
      color: '#009688',
      fontWeight: 'bold',
    },
    LicenceButton: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#FF5722',
      borderRadius: 4,
    },
    LicenceButton2: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#009688',
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

export default perl;
