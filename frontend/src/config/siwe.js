
import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import { getAddress } from '@ethersproject/address';

const BASE_URL = 'http://localhost:8080';

export const siweConfig = (chains) => {
    return createSIWEConfig({
        signOutOnAccountChange: true,
        signOutOnNetworkChange: true,
        getMessageParams: async () => ({
            domain: window.location.host,
            uri: window.location.origin,
            chains: chains.map(chain => parseInt(chain.id.toString())),
            statement: 'Welcome to the CarHive! Please sign this message to Register Account',
        }),
        createMessage: ({ address, ...args }) => {
            const normalizeAddress = (addr) => {
                try {
                    const splitAddress = addr.split(':');
                    const extractedAddress = splitAddress[splitAddress.length - 1];
                    const checksumAddress = getAddress(extractedAddress);
                    splitAddress[splitAddress.length - 1] = checksumAddress;
                    return splitAddress.join(':');
                } catch {
                    return addr;
                }
            };
            return formatMessage(args, normalizeAddress(address));
        },
        getNonce: async () => {
            const res = await fetch(BASE_URL + "/nonce", { method: "GET", credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch nonce');
            return await res.text();
        },
        getSession: async () => {
            const res = await fetch(BASE_URL + "/session", { method: "GET", credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch session');
            const data = await res.json();
            return typeof data === 'object' && typeof data.address === 'string' && typeof data.chainId === 'number'
                ? data
                : null;
        },
        verifyMessage: async ({ message, signature }) => {
            const res = await fetch(BASE_URL + "/verify", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, signature }),
                credentials: 'include',
            });
            if (!res.ok) return false;
            const result = await res.json();
            return result === true;
        },
        signOut: async () => {
            const res = await fetch(BASE_URL + "/signout", { method: "GET", credentials: 'include' });
            if (!res.ok) throw new Error('Failed to sign out');
            const data = await res.json();
            return data === "{}";
        },
    });
};

