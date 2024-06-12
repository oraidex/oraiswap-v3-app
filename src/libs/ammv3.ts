export class SingletonAMMV3 {
  private static instance: SingletonAMMV3 | null = null

  private constructor(public readonly prefix: string = 'orai') {}

  static getInstance(): SingletonAMMV3 {
    if (!SingletonAMMV3.instance) {
      SingletonAMMV3.instance = new SingletonAMMV3()
    }
    return SingletonAMMV3.instance
  }

  public static async connect(prefix: string = 'orai'): Promise<any> {
    return new SingletonAMMV3(prefix)
  }

  public static async swap(): Promise<any> {}
  public static async createPositions(): Promise<any> {}
  public static async getPools(): Promise<any> {}
  public static async getPositions(): Promise<any> {}
}
