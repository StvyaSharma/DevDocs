import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Dimensions, SafeAreaView , Image} from 'react-native';
import { Link, Stack } from "expo-router";
import Images from './assets/Images';

const Paige = () => {
  const [width, setWidth] = useState(600);

  const handleResize = () => {
    const maxWidth = Dimensions.get('window').width - 200;
    setWidth(Math.min(maxWidth, width));
  };

  const renderCell = (name, route, color1,color2,color3, image) => (
    <View style={styles.cellContainer} key={`cell_${name}`}>
      <TouchableOpacity
        style={[styles.cell, {borderColor: color1, backgroundColor: color2}]}
        onPress={() => handleCellPress(name)}
      >
        <Link href={route}>
          <Image source={image} resizeMode="contain" style={styles.image} />
          {/* <Text style={styles.cellText}>{`${name}`}</Text> */}
        </Link>
      </TouchableOpacity>
    </View>
  );

  const handleCellPress = (name) => {
    // Handle cell press here
    console.log(`Cell pressed: ${name}`);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} >
        <Stack.Screen options={{ title: 'Back', headerShown: false, headerStyle: { height: 10 }, backgroundColor : '#28282B', contentStyle: {backgroundColor: '#28282B'} }} />
        
        <View style={styles.container2}>
          <Text style={styles.emoji}>📄</Text>
          <Text style={styles.text}>DevDocs</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            vestibulum, ligula a tristique pretium, felis ante volutpat dolor, eget
            ultrices orci neque et eros.
          </Text>
        </View>
        <View style={styles.table}>
          {renderCell('Perl','/perl','#009688', '#673AB7','',Images.perl)}
          {renderCell('php','/php','black','#4F5B93','',Images.php)}
          {renderCell('.NET','/net','#007ACC','black','',Images.net)}
          {renderCell('NPM','/npm','white','#CB3837','',Images.npm)}
          {/* {renderCell('/Python')} */}
          {renderCell('Ruby','/ruby','white','#701516','',Images.ruby)}
          {renderCell('Rust','/rust','#5D1307','#DE3A19','',Images.rust)}
          {renderCell('java','/java','#FFA500','#000000','',Images.java)}
          {/* {renderCell('/JCenterApp')} */}
          {renderCell('Dart','/pub','#0175C2','#00A896','',Images.dart)}
          {/* Add more cells as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: '100%',
    marginVertical: 'auto',
    marginHorizontal: 'auto'
  },
  container2: {
    flex: 1,
    backgroundColor: '#28282B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,

  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'lightgray'
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:10,
    backgroundColor: '#28282B'
  },
  table: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellContainer: {
    width: '50%', // Two cells per row, adjust as needed
    aspectRatio: 1, // Makes each cell a square
    padding: 20, // Add border spacing
  },
  cell: {
    // backgroundColor: 'lightgray',
    borderRadius: 15,
    borderWidth:5,
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  },
  cellText:{
      position:'absolute'
   }
});

export default Paige;