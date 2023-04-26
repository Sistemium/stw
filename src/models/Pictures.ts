export interface PictureInfo {
  name: string;
  src: string;
  height: number;
  width: number;
}

export interface IMSResponse {
  name: string;
  folder: string;
  pictures: PictureInfo[],
}
