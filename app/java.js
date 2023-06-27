import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, Linking, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const Java = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await axios.get(
        `https://search.maven.org/solrsearch/select?q=${searchTerm}&wt=json`
      );
      setLibraries(response.data.response.docs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchLibraries();
  };

  const handleLinkPress = (url) => {
    console.log(url)
    Linking.openURL(url);
  };

  const openModal = (library) => {
    setSelectedLibrary(library);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedLibrary(null);
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
        <Text style={styles.packageName}>{item.g}</Text>
        <Text style={styles.packageAuthor}>{item.a}</Text>
        {/* <Text style={styles.packageVersion}>{item.latestVersion}</Text> */}
        <TouchableOpacity style={styles.LicenceButton2} onPress={() => handleLinkPress(`https://central.sonatype.com/artifact/${item.g}/${item.a}/${item.latestVersion}`)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="black"  /> Visit</Text>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedLibrary && (
            <View>
              <Text style={styles.modalHeading}>{selectedLibrary.g}</Text>
              <Text style={styles.libraryArtifactId}>{selectedLibrary.a}</Text>
              <Text style={styles.libraryVersion}>{selectedLibrary.latestVersion}</Text>
              <Text style={styles.libraryDescription}>{selectedLibrary.p}</Text>
              <Text style={styles.libraryRepository} onPress={() => handleLinkPress(selectedLibrary.id)}>
                {selectedLibrary.id}
              </Text>
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(`https://central.sonatype.com/artifact/${selectedLibrary.g}/${selectedLibrary.a}/${selectedLibrary.latestVersion}`)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="black"  /> URL</Text>
          </TouchableOpacity>
              <TouchableOpacity style={styles.LicenceButton} onPress={() => handleLinkPress(`https://repo1.maven.org/maven2/${selectedLibrary.g.replace(/\./g, "/")}/${selectedLibrary.a}/${selectedLibrary.latestVersion}/`)}>
            <Text style={styles.LicenceButtonText}><Feather name="arrow-up-right" size={16} color="black"  /> Repository</Text>
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
    <SafeAreaView style={styles.container} >
      <Stack.Screen  options={{headerStyle :{backgroundColor : '#007396'}, backgroundColor : '#007396', headerTintColor:'black', title: 'Java', contentStyle: {backgroundColor: '#007396'},headerRight: () => (
            <TouchableOpacity onPress={openInfoModal}>
                <Ionicons name="information-circle-outline" size={24} color="black" />
            </TouchableOpacity>

          )}} />
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={handleSearch}
        placeholder="Search libraries..."
      />
      <FlatList
        data={libraries}
        renderItem={renderPackage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.libraryList}
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
      backgroundColor: '#007396',
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
      color: 'black',
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
      borderColor: '#FF4500',
      padding: 10,
      backgroundColor: '#007396',
      borderRadius: 10,
      shadowColor: '#FF4500',
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
      color: '#FFA500',
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
      backgroundColor: '#007396',
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
      backgroundColor: '#FF4500',
      borderRadius: 4,
    },
    closeButtonText: {
      color: 'black',
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
      backgroundColor: '#FFA500',
      borderRadius: 4,
    },
    LicenceButtonText: {
      color: 'black',
      fontWeight: 'bold',
    },
    infoText: {
      color:'#ccc',
      marginBottom: 8,
    },
  });

export default Java;
