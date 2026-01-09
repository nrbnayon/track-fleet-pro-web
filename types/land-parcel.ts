export type ParcelStatus = "Leased" | "Owned";
export type ParcelType =
  | "Agricultural"
  | "Commercial"
  | "Residential"
  | "Industrial";

export interface LandParcel {
  id: string;
  parcelId: string;
  ownerName: string;
  area: number;
  zone: string;
  type: ParcelType;
  ownership: ParcelStatus;
  registrationDate: string;
}

export interface LandParcelFormData {
  parcelId: string;
  ownerName: string;
  area: number;
  zone: string;
  type: string;
  ownership: string;
  registrationDate: string;
}
