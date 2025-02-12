export default interface ApiModel extends Record<string, any>{
  id: string;
  ts?: string;
  cts?: string;
  deviceCts?: string;
}
