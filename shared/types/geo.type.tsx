// https://geo.api.gouv.fr/
export interface GeoCity {
  nom: string;
  code: string;
  _score?: number;
  departement?: GeoEntity;
  region?: GeoEntity;
}

interface GeoEntity {
  nom: string;
  code: string;
}
