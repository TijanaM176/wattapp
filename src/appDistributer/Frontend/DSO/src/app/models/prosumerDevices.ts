export interface Devices {
  consumers: Array<{
    timestamps: Array<object>;
    id: string;
    ipAddress: string;
    name: string;
    categoryId: number;
    typeId: number;
    manufacturer: string;
    wattage: number;
    category: string;
    type: string;
  }>;
  producers: Array<object>;
  storage: Array<object>;
}
