export interface Brand {
    id: number;
    name: string;
    image_full_url: string;
}

export type GetBrandsResponse = Brand[];
