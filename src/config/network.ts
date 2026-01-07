// Network configuration for Owly

export const SUI_NETWORK = 'testnet';

export const NETWORK_CONFIG = {
    testnet: {
        suiRpcUrl: 'https://fullnode.testnet.sui.io:443',
        walrusPublisherUrl: 'https://publisher.walrus-testnet.walrus.space',
        walrusAggregatorUrl: 'https://aggregator.walrus-testnet.walrus.space',
        // Contract address - deployed on testnet (with seal_approve support)
        vaultContractPackageId: '0xe5128896e1f2c60e992844d747752741d2c421bc4a40f8d6aface49aa085c3c7',
        vaultContractModuleName: 'vault',
        sealKeyServers: [
            {
                objectId: '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75',
                url: 'https://seal-key-server-testnet-1.mystenlabs.com',
                weight: 1,
            },
            {
                objectId: '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8',
                url: 'https://seal-key-server-testnet-2.mystenlabs.com',
                weight: 1,
            },
        ],
    },
    mainnet: {
        suiRpcUrl: 'https://fullnode.mainnet.sui.io:443',
        walrusPublisherUrl: 'https://publisher.walrus.walrus.space',
        walrusAggregatorUrl: 'https://aggregator.walrus.walrus.space',
        vaultContractPackageId: '',
        vaultContractModuleName: 'vault',
        sealKeyServers: [],
    },
} as const;

export function getNetworkConfig() {
    return NETWORK_CONFIG[SUI_NETWORK];
}
