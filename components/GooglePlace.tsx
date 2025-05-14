import React, { useState, useEffect } from 'react';
import { View, useColorScheme, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import usePosition from '@/hooks/usePosition';
import { reverseGeocodeAsync } from 'expo-location';
import Input from './Input';
import Constants from 'expo-constants';

interface Place {
  id: string;
  description: string;
  place_id: string;
}

// Define valid field names for type safety
type FormFieldNames = 'address' | 'latitude' | 'longitude';

interface GooglePlacesInputProps {
  setValue: (name: FormFieldNames, value: any) => void;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  value?: string;
  trigger?: (name: FormFieldNames) => void;
}

const CustomGooglePlacesInput = ({
  setValue,
  onChange,
  onBlur,
  value = '',
  trigger,
}: GooglePlacesInputProps) => {
  const [searchText, setSearchText] = useState(value);
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const colorScheme = useColorScheme();
  const pos = usePosition();

  // Function to get place predictions from Google Places API (using the latest version)
  const getPlacePredictions = async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Get API key from Constants to ensure it's properly loaded
      const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_MAPS_API || process.env.EXPO_PUBLIC_MAPS_API;
      
      if (!apiKey) {
        console.error('Google Maps API key is not configured');
        setIsLoading(false);
        return;
      }
      
      // Use the new Places API endpoint
      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.primaryType,places.location'
          },
          body: JSON.stringify({
            textQuery: input,
            languageCode: 'fr',
            regionCode: 'ci', // Côte d'Ivoire
            maxResultCount: 7
          })
        }
      );
      
      const data = await response.json();
      
      if (data.places && data.places.length > 0) {
        setPredictions(data.places.map((place: any) => ({
          id: place.id,
          description: place.formattedAddress || place.displayName?.text || '',
          place_id: place.id
        })));
      } else {
        setPredictions([]);
        console.log('No places found or error fetching predictions:', data.error?.message || 'No results');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get place details using the latest Places API
  const getPlaceDetails = async (placeId: string) => {
    try {
      // Get API key from Constants to ensure it's properly loaded
      const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_MAPS_API || process.env.EXPO_PUBLIC_MAPS_API;
      
      if (!apiKey) {
        console.error('Google Maps API key is not configured');
        return null;
      }
      
      // Use the new Places API endpoint for details
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`, {
          method: 'GET',
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'displayName,formattedAddress,location'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.location) {
        return {
          geometry: {
            location: {
              lat: data.location.latitude,
              lng: data.location.longitude
            }
          },
          name: data.displayName?.text || '',
          formatted_address: data.formattedAddress || ''
        };
      } else {
        console.log('Error fetching place details:', data.error?.message || 'No location data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  // Set current position
  const setCurrentPosition = async () => {
    if (!pos?.latitude || !pos?.longitude) {
      console.log('Position not available');
      return;
    }
    try {
      const position = await reverseGeocodeAsync({
        latitude: pos.latitude,
        longitude: pos.longitude,
      });
      
      if (position && position.length > 0) {
        const address = position[0].formattedAddress || '';
        setSearchText(address);
        setValue('address', address);
        setValue('latitude', pos.latitude);
        setValue('longitude', pos.longitude);
        if (trigger) trigger('address');
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  // Handle text input change
  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (onChange) onChange(text);
    setShowResults(true);
    getPlacePredictions(text);
  };

  // Handle selection of a place
  const handleSelectPlace = async (item: Place) => {
    setSearchText(item.description);
    if (onChange) onChange(item.description);
    setValue('address', item.description);
    
    const details = await getPlaceDetails(item.place_id);
    if (details && details.geometry && details.geometry.location) {
      setValue('latitude', details.geometry.location.lat);
      setValue('longitude', details.geometry.location.lng);
      console.log('Location updated:', details.geometry.location.lat, details.geometry.location.lng);
    } else {
      console.log('No location data found in place details');
    }
    
    if (trigger) trigger('address');
    setShowResults(false);
  };

  // Handle input blur
  const handleBlur = (e: any) => {
    if (onBlur) onBlur(e);
    // Delay hiding results to allow for touches
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchText) {
      setShowResults(true);
      getPlacePredictions(searchText);
    }
  };

  // Update searchText when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== searchText) {
      setSearchText(value);
    }
  }, [searchText, value]);

  return (
    <View style={styles.container}>
      <Input
        label="Choisissez la position*"
        value={searchText}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        right={<TextInput.Icon icon="google-maps" onPress={setCurrentPosition} />}
        style={{
          width: '100%',
        }}
        textColor={Colors[colorScheme ?? 'light']?.text}
      />
      
      {showResults && (
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" style={styles.loader} />
          ) : predictions.length > 0 ? (
            // Using direct mapping instead of FlatList to avoid nested VirtualizedList warning
            <ScrollView style={styles.list} keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
              {predictions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Text style={styles.resultText}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : searchText.length > 2 ? (
            <Text style={styles.emptyText}>
              Aucun lieu trouvé. Veuillez réessayer
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  resultsContainer: {
    position: 'absolute',
    top: 90, // Adjust based on your input height
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 2,
    height: "auto",
  },
  list: {
    height: "auto",
  },
  loader: {
    padding: 10,
    alignItems: 'center',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
  },
  emptyText: {
    padding: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default CustomGooglePlacesInput;