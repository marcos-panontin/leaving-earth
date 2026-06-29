declare module '@/utils/manuevers.js' {
  export const manuevers: Array<{
    From: string;
    To: string;
    Difficulty: number;
    Exclamation: boolean;
    Aerobraking: boolean;
    Hourglasses: number;
    OptionalHourglass: boolean;
    SolarRadiation: boolean;
    Reentry: boolean;
    Landing: boolean;
    OptionalLanding: boolean;
    Slingshot?: string;
    BackgroundClass?: string;
  }>;
}
