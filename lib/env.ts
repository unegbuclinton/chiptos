const env = {
    OPENSEA_API_KEY: process?.env?.NEXT_PUBLIC_OPENSEA_API_KEY ?? '',   
    ALCHEMY_API_KEY: process?.env?.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',   

    TWITTER_URL: process?.env?.NEXT_PUBLIC_TWITTER_URL ?? '',   
    FACEBOOK_URL: process?.env?.NEXT_PUBLIC_FACEBOOK_URL ?? '',   
    INSTAGRAM_URL: process?.env?.NEXT_PUBLIC_INSTAGRAM_URL ?? '',   
    DISCORD_URL: process?.env?.NEXT_PUBLIC_DISCORD_URL ?? '',   
    HOME_URL: process?.env?.NEXT_PUBLIC_HOME_URL ?? '',   
    STORE_URL: process?.env?.NEXT_PUBLIC_STORE_URL ?? '',   
}

export default env