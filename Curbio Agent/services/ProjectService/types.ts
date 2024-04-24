export interface IProjectByIdData {
  address: string;
  files: {extension: string; url: string; fullName: string}[];
  id: number;
  name: string;
  scheduleVersion: number;
  lat: number;
  lng: number;
  totalContractAmount: number;
  profit: number;
  roi: number;
}

export interface IProjectData {
  address: string;
  profit: number;
  roi: number;
  totalContractAmount: number;
  streetViewUrl: string;
  lat: number;
  lng: number;
  files: IFiles[];
  stageName: string;
  scheduleVersion: number;
}

interface IFiles {
  projectId: number;
  isPublic: boolean;
  daysToExtendProject: null;
  contractAmount: null;
  fileTypeId: number;
  notes: null;
  isActive: boolean;
  fileTypeName: string;
  fileType: number;
  blobContainer: number;
  isChangeOrder: boolean;
  id: number;
  isNew: false;
  name: string;
  extension: string;
  blobName: string;
  size: number;
  createdDate: string;
  creatorId: number;
  creatorName: string;
  fullName: string;
  thumbnailBlobContainer: number;
  url: string;
  thumbnailUrl: null;
}
