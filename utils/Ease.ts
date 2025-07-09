const ease = {
    exponentialIn: (t: number): number => {
      return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
    },
    exponentialOut: (t: number): number => {
      return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
    },
    exponentialInOut: (t: number): number => {
      return t === 0.0 || t === 1.0
        ? t
        : t < 0.5
          ? 0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
          : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
    },
    sineOut: (t: number): number => {
      const HALF_PI = Math.PI / 2;
      return Math.sin(t * HALF_PI);
    },
    circularInOut: (t: number): number => {
      return t < 0.5
        ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
        : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
    },
    cubicIn: (t: number): number => {
      return t * t * t;
    },
    cubicOut: (t: number): number => {
      const f = t - 1.0;
      return f * f * f + 1.0;
    },
    cubicInOut: (t: number): number => {
      return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    },
    quadraticOut: (t: number): number => {
      return -t * (t - 2.0);
    },
    quarticOut: (t: number): number => {
      return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    },
  };
  
  export default ease;
  