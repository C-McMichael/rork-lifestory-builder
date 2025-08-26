import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { Image as ExpoImage } from 'expo-image';
import { Plus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ImagePickerProps {
  images: string[];
  onImagesSelected: (images: string[]) => void;
}

export default function ImagePickerComponent({ images, onImagesSelected }: ImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    try {
      const permissionResult = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("You need to allow access to your photos to use this feature");
        return;
      }
      
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = [...images, result.assets[0].uri];
        onImagesSelected(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesSelected(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imagesContainer}
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            {Platform.OS === 'web' ? (
              <Image source={{ uri }} style={styles.image} />
            ) : (
              <ExpoImage source={{ uri }} style={styles.image} contentFit="cover" />
            )}
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <X size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={pickImage}
          disabled={loading}
        >
          <Plus size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </ScrollView>
      
      <Text style={styles.helperText}>
        Add photos to accompany your journal entry
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  imagesContainer: {
    paddingVertical: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.lightGray,
  },
  helperText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginTop: 8,
  },
});