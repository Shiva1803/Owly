// Network configuration for Owly

export const SUI_NETWORK = 'testnet';

export const NETWORK_CONFIG = {
    testnet: {
        suiRpcUrl: 'https://fullnode.testnet.sui.io:443',
        walrusPublisherUrl: 'https://publisher.walrus-testnet.walrus.space',
        walrusAggregatorUrl: 'https://aggregator.walrus-testnet.walrus.space',
        // Contract address - deployed on testnet
        vaultContractPackageId: '0xc64652e9b60e7ad3014664531175907fa3ce802903016f9a4f28529254ba1afc',
        vaultContractModuleName: 'vault',
    },
    mainnet: {
        suiRpcUrl: 'https://fullnode.mainnet.sui.io:443',
        walrusPublisherUrl: 'https://publisher.walrus.walrus.space',
        walrusAggregatorUrl: 'https://aggregator.walrus.walrus.space',
        vaultContractPackageId: '',
        vaultContractModuleName: 'vault',
    },
} as const;

export function getNetworkConfig() {
    return NETWORK_CONFIG[SUI_NETWORK];
}
