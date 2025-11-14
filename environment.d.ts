interface EnvironmentVariables {
  readonly NEXT_PUBLIC_APP_ENV: 'production' | 'development'
  readonly NEXT_PUBLIC_APP_NAME: string
  readonly NEXT_PUBLIC_APP_URL: string
  readonly NEXT_PUBLIC_PRIVATE_KEY: `0x${string}`
  readonly NEXT_PUBLIC_RESOURCE_WALLET_ADDRESS: `0x${string}`
  readonly CDP_API_KEY_ID: string
  readonly CDP_API_KEY_SECRET: string
  readonly NEXT_PUBLIC_PROJECT_ID: string
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables { }
}
