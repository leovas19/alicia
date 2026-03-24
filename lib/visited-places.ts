export type VisitedPlace = {
  id: string;
  name: string;
  country: string;
  note: string;
  latitude: number;
  longitude: number;
  orderIndex?: number;
};

export const initialVisitedPlaces: Omit<VisitedPlace, "id" | "orderIndex">[] = [
  {
    name: "Paris",
    country: "France",
    note: "Un arrêt qui ressemble à une parenthèse douce, un peu cinématographique.",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    name: "Toulouse",
    country: "France",
    note: "Une étape importante du sud, douce et pleine de repères.",
    latitude: 43.6047,
    longitude: 1.4442
  },
  {
    name: "Montpellier",
    country: "France",
    note: "Un endroit lumineux, vivant, avec une vraie sensation d'élan.",
    latitude: 43.6119,
    longitude: 3.8772
  },
  {
    name: "Montbeliard",
    country: "France",
    note: "Un point plus discret, mais qui compte dans la chronologie des souvenirs.",
    latitude: 47.5096,
    longitude: 6.7983
  },
  {
    name: "Bonnefont",
    country: "France",
    note: "Le calme d'un lieu plus intime, plus local, mais pas moins précieux.",
    latitude: 43.2544,
    longitude: 0.2804
  },
  {
    name: "Muret",
    country: "France",
    note: "Une ville proche de Toulouse pour garder aussi les trajets courts dans la carte.",
    latitude: 43.4607,
    longitude: 1.3254
  },
  {
    name: "Tarbes",
    country: "France",
    note: "Le sud-ouest, les montagnes pas loin, et une trace qui reste.",
    latitude: 43.2328,
    longitude: 0.0781
  },
  {
    name: "Hossegor",
    country: "France",
    note: "Un point plus solaire, plus libre, avec l'air de l'océan derrière.",
    latitude: 43.6652,
    longitude: -1.4437
  },
  {
    name: "Lourdes",
    country: "France",
    note: "Un lieu connu, mais qui devient surtout un souvenir à deux une fois posé ici.",
    latitude: 43.095,
    longitude: -0.0461
  }
];
