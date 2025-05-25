export interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  export interface Contact {
    name: string;
    phone: string;
  }
  
  export interface EpipenMarker {
    id: string;
    coordinate: Coordinate;
    description?: string;
    type: 'adult' | 'junior';
    expireDate: string;
    contact?: Contact;
    photo?: string | null;
    distance?: number;
    serialNumber?: string;
  }
  
  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
  
  export type Language = 'en' | 'he';
  
  export interface TranslationStrings {
    whereIsEpi: string;
    searchEpipen: string;
    allEpipens: string;
    nearbyEpipens: string;
    noEpipens: string;
    addEpipen: string;
    addNewEpipen: string;
    epipenName: string;
    epipenType: string;
    epipenNotes: string;
    locationDescription: string;
    phoneNumber: string;
    operatingHours: string;
    expireDate: string;
    addPhoto: string;
    useCurrentLocation: string;
    selectCustomLocation: string;
    tapToSelectLocation: string;
    cancel: string;
    save: string;
    adult: string;
    junior: string;
    awayText: string;
    changeLanguage: string;
    locationDenied: string;
    locationError: string;
    takePicture: string;
    chooseFromGallery: string;
    removePhoto: string;
    epipenDetails: string;
    backToList: string;
    expirationLabel: string;
    contactLabel: string;
    hoursLabel: string;
    notesLabel: string;
    directionsLabel: string;
  }
  
  export interface Translations {
    en: TranslationStrings;
    he: TranslationStrings;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }