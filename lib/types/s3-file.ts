//
// s3-file.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// S3 file type definitions
//

export interface S3File {
  id: number;
  object_key: string;
  file_url: string;
  organization_id: string;
  upload_timestamp: string;
  file_size: number;
}

export interface CreateS3FileData {
  object_key: string;
  file_url: string;
  organization_id: string;
  file_size: number;
} 